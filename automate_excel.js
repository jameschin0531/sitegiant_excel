
// const fetch = require('fetch');
const XLSX = require('xlsx');

// Load the workbook
const workbook = XLSX.readFile('products.xlsx');
// Get the first worksheet
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
// Convert the worksheet to a JSON object
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Remove the header ro
// data.shift();

const auth_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0MCIsImp0aSI6IjIxNmEzMTBhYThjMTA2ZmFmMjg5NDY4YmZjNDY0NGJhZjBjYTA5MWRkNjYzZjU2MTFiOTVmM2JkYjc3OWY5M2E1Mzk2MjU5MDJkZjZmNjk1IiwiaWF0IjoxNjgxOTkxMjkzLjI0MzUyNywibmJmIjoxNjgxOTkxMjkzLjI0MzUzMSwiZXhwIjoxNjgyMDM0NDkzLjIzNDIxNiwic3ViIjoiNjYyNyIsInNjb3BlcyI6WyIqIl19.a1k_JR9TVgDNMTD4q-64vA3vVSJXsl5oJpSVm6I2iO3D9WeENGi1T6bYO8Kh4841JUPggWvQ38xAITaDW90gRL5HKs0E4Cg7fzzGXaxopbu1ZIYCI4w-8ppdl-n9-iEB_o8jEw3_ukIm0ShtZ117k01bQ-YEX9vvryTQbflaNwW5Iqd1A4yWxcasHLgpOanWBNSlmeWvbuffNg_H4IJaodgrXxD4yrYfSS2rtaSzntRtu4HmiOHM8isetFm_7GuUVn5Y2akf7UuV89NuaVpaOUQShElZot9yxtor0eO5eO-4Vz4fIelEel8yt4qVYU_PIwM71ONCcuoGGhDKfscuOGPziRFqXEGrc-IKvCVkShiaBbHySPpVaBciIjWuXkiBA9ilhGrbfxj8J9UTVCwr-hmeT2te-M5j-GaAdGDeWaA-Z2IviTSFdwPl23bE3tURQjIwsUB9PwzOcm-vdOCrNN2gabrBys80sNz19v8rPW8bd4mFqu60l13n1We1pHSfUVreqzGyZKXFxXH8toGMbUhleMgYi4lrRAaoJ4JnaIz-P0FJ5LNMT9haaD_DLvWZmEUiV6VE8It9WMETMZXnjhvZRN7ENDwxAZ4DZNlnm4EA7pcgqA-t46jH8-rzwgsVUAk4qLl0n8GGiHNL3M6E5fLMJ2TX65qNUjoDhir_FRg';
const id_column = 0;
const stock_column = 1;

// Define the API endpoint
const base_url = 'https://inventoryapi2.sitegiant.io/api/v1/items/';

const request = require('request');
const options = {
  'method': 'GET',
  'headers': {
    'authority': 'inventoryapi2.sitegiant.io',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'authorization': `Bearer ${auth_token}`,
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
};

// // Loop through each row of the data array
data.forEach((row, rowIndex) => {
  // Get the product ID from the first column
  const productId = row[id_column];
  // Make a request to the API to get the current stock
  fetch(`${base_url}${productId}`, options)
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData);
      // Update the current stock column in the data array
      data[rowIndex][stock_column] = responseData?.response[0]?.total_available_stock;
      // console.log(data[rowIndex]);
      updateExcelSheet(data);
    })
    .catch(error => console.log(error));
});

function updateExcelSheet(data) {
  // Create a new worksheet with the updated data
  const updatedWorksheet = XLSX.utils.aoa_to_sheet(data);
  // Update the workbook with the new worksheet
  workbook.Sheets[workbook.SheetNames[0]] = updatedWorksheet;
  // Write the updated workbook back to the file
  XLSX.writeFile(workbook, 'products.xlsx');
}