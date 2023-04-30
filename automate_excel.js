
const XLSX = require('xlsx');
require('dotenv').config();
const { LOGIN_URL, BASE_URL, INVENTORY_TOKEN_URL } = require('./config.js');

const ID_COL = 0;
const STOCK_COL = 1;

// Load the workbook
const workbook = XLSX.readFile('products.xlsx');

// main flow
loginGetToken().then(token => {
  getInventoryToken(token).then(inventory_token => {
    const excel_data = getExcelData();
    updateExcelData(excel_data, inventory_token);
  });
});
// functions
async function loginGetToken() {
  const credential = {
    "email": process.env.EMAIL,
    "password": process.env.PASSWORD
  };
  const webRequestConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credential)
  };
  const token = await fetch(`${LOGIN_URL}`, webRequestConfig)
    .then(response => response.json())
    .then(responseJson => {
      return responseJson?.response?.access_token;
    })
    .catch(error => console.log(error));

  return token;
}
async function getInventoryToken(token) {
  console.log('token', token);
  const webRequestConfig = {
    method: 'GET',
    headers: formRequestHeader(token)
  };
  const inventory_token = await fetch(`${INVENTORY_TOKEN_URL}`, webRequestConfig)
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson, 'responseJson');
      return responseJson?.response?.access_token;
    })
    .catch(error => console.log(error));
  return inventory_token;
}
function formRequestHeader(token) {
  return {
    'authority': 'inventoryapi2.sitegiant.io',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'authorization': `Bearer ${token}`,
    'locale': 'en',
    'origin': 'https://sitegiant.co',
    'referer': 'https://sitegiant.co/',
    'sec-ch-ua': '"Chromium";v="112", "Microsoft Edge";v="112", "Not:A-Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'store-id': '3209',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.46'
  }
}
function getExcelData() {
  // Get the first worksheet
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  // Convert the worksheet to a JSON object
  return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
}
function updateExcelData(data, inventory_token) {
  // // Loop through each row of the data array
  data.forEach((row, rowIndex) => {
    // Get the product ID from the first column
    const productId = row[ID_COL];
    // console.log(`${BASE_URL}${productId}`, http_options);
    // Make a request to the API to get the current stock
    fetch(`${BASE_URL}${productId}`, {
      method: 'GET',
      headers: formRequestHeader(inventory_token)
    })
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