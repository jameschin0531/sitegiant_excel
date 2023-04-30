
const XLSX = require('xlsx');
require('dotenv').config();
const { BASE_URL, http_options } = require('./config.js');

const ID_COL = 0;
const STOCK_COL = 1;

// Load the workbook
const workbook = XLSX.readFile('products.xlsx');

// main flow
const excel_data = getExcelData();
updateExcelData(excel_data);

// functions
function getExcelData() {
  // Get the first worksheet
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  // Convert the worksheet to a JSON object
  return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
}

function updateExcelData(data) {
  // // Loop through each row of the data array
  data.forEach((row, rowIndex) => {
    // Get the product ID from the first column
    const productId = row[ID_COL];
    console.log(`${BASE_URL}${productId}`, http_options);
    // Make a request to the API to get the current stock
    fetch(`${BASE_URL}${productId}`, http_options)
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData);
        // Update the current stock column in the data array
        data[rowIndex][STOCK_COL] = responseData?.response[0]?.total_available_stock;
        // console.log(data[rowIndex]);
        writeExcelSheet(data);
      })
      .catch(error => console.log(error));
  });
}
function writeExcelSheet(data) {
  // Create a new worksheet with the updated data
  const updatedWorksheet = XLSX.utils.aoa_to_sheet(data);
  // Update the workbook with the new worksheet
  workbook.Sheets[workbook.SheetNames[0]] = updatedWorksheet;
  // Write the updated workbook back to the file
  XLSX.writeFile(workbook, 'products.xlsx');
}