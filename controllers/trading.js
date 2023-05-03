const alpaca = require('../models/alpaca');
const Database = require('../models/mysql.js');

const db = new Database();

const getAccount = async (req, res) => {
    const {email, id, alpaca_key, alpaca_secret} = req.userinfo;
    if (!alpaca_key || !alpaca_secret) {
        res.status(400).json({error: "Missing key or secret"});
    } else {
        const token = await alpaca.alpacaGetAccount(alpaca_key, alpaca_secret);
        if (token.message) {
            res.status(parseInt(token.message.slice(-3))).json({error: token.message});
        } else {
            res.status(200).json(token);
        }
    }
}

const createOrder = async (req, res) => {
    const {email, id, alpaca_key, alpaca_secret} = req.userinfo;
    const {symbol, notional, type, time_in_force} = req.body;
    const token = await alpaca.alpacaCreateOrder(alpaca_key, alpaca_secret, symbol, notional, type, time_in_force);
    res.status(200).json(token);
}

const getOrdersForSub = async (req, res) => {

    //with time
//     SELECT transactions.*
// FROM transactions
// JOIN subs ON transactions.user_id = subs.creator_id
// WHERE subs.sub_id = ? AND subs.active = 1 AND transactions.created_at > ?;

    const {email, id, alpaca_key, alpaca_secret} = req.userinfo;
    const sql = `SELECT transactions.*
    FROM transactions
    JOIN subs ON transactions.user_id = subs.creator_id
    WHERE subs.sub_id = ? AND subs.active = 1;
    `
    const params = [id]
    const newOrders = await db.statement(sql, params);
    res.status(200).json(newOrders)
}

module.exports = {
    getAccount,
    createOrder,
    getOrdersForSub};