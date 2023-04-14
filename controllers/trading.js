const alpaca = require('../models/alpaca');

const getAccount = async (req, res) => {
    const {email, id, alpaca_key, alpaca_secret} = req.userinfo;
    const token = await alpaca.alpacaGetAccount(alpaca_key, alpaca_secret);
    res.status(200).json(token);
}

const createOrder = async (req, res) => {
    const {email, id, alpaca_key, alpaca_secret} = req.userinfo;
    const {symbol, notional, type, time_in_force} = req.body;
    const token = await alpaca.alpacaCreateOrder(alpaca_key, alpaca_secret, symbol, notional, type, time_in_force);
    res.status(200).json(token);
}

module.exports = {
    getAccount,
    createOrder};