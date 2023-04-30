require('dotenv').config();
module.exports = {
  BASE_URL: 'https://inventoryapi2.sitegiant.io/api/v1/items/',
  http_options: {
    'method': 'GET',
    'headers': {
      'authority': 'inventoryapi2.sitegiant.io',
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
      'authorization': `Bearer ${process.env.AUTH_TOKEN}`,
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
}


