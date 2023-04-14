// Import the Alpaca module
const Alpaca = require("@alpacahq/alpaca-trade-api");



// Instantiate the API with configuration options

function getInstance(key, secret) {
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
    const alpaca = getInstance(key, secret);
    try {
        const account = await alpaca.getAccount();
        return account;
    } catch (error) {
        return error;
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

module.exports = {
    alpacaGetAccount,
    alpacaCreateOrder};