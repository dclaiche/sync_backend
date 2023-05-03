// Import the Alpaca module
const Alpaca = require("@alpacahq/alpaca-trade-api");
const axios = require('axios');



// Instantiate the API with configuration options

async function getInstance(key, secret) {
    const options = {
        keyId: key,
        secretKey: secret,
        paper: true,
      };

    const alpaca = new Alpaca(options);
    return alpaca;
}

// Get the account information
async function alpacaGetAccount(key, secret) {
    const alpaca = await getInstance(key, secret);
    try {
        const account = await alpaca.getAccount();
        return account;
    } catch (error) {
        return error
    }
}

async function alpacaCreateOrder(key, secret, symbol, notional, type, time_in_force) {
    const alpaca = getInstance(key, secret);
    const params = {
        symbol: symbol,
        notional: notional,
        side: "buy",
        type: type,
        time_in_force: time_in_force
    };
    try {
        const order = await alpaca.createOrder(params);
        return order;
    } catch (error) {
        return error;
    }
}

async function alpacaGetPortfolioHistory(key, secret, date_end, period, timeframe, extended_hours) {

    // FORMAT
    // date_start: Date,
    // date_end: Date,
    // period: '1M' | '3M' | '6M' | '1A' | 'all' | 'intraday',
    // timeframe: '1Min' | '5Min' | '15Min' | '1H' | '1D',
    // extended_hours: Boolean
    const params = {
        'date_end': date_end,
        'period': period,
        'timeframe': timeframe,
        'extended_hours': extended_hours
      }

      const headers = {"APCA-API-KEY-ID": key, "APCA-API-SECRET-KEY": secret, "Content-Type": "application/json"}

    const response = await axios.get('https://paper-api.alpaca.markets/v2/account/portfolio/history', 
    { 
        headers: headers,
        params: params
    });
    return response.data;
}

module.exports = {
    alpacaGetAccount,
    alpacaCreateOrder,
    alpacaGetPortfolioHistory};