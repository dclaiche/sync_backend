const {robinhood_get_auth} = require('../models/robinhoodapi');
const Database = require('../models/mysql.js');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const db = new Database();
const secretKey = 'crazysynckey2121';
// @desc Login
// @route POST /auth
// @access Public
const brokerage_auth_login = async (req, res) => {
    // const sql = `INSERT INTO api_keys (user_id, robinhood_JWT) VALUES (USER_ID, $code);`;
    // const rows = await db.statement(sql, params);
    const token = await robinhood_get_auth(req, res);
    if (token) {
        if(token.code) res.status(token.code).json(token.body);
        else {
            res.status(200).json(token);}
    } else {
        res.status(400).json({"error": "Invalid Credentials"});
    }
}

const normal_login = async (req, res) => {
    const { password, email} = req.body;
    const sql = `SELECT * FROM user WHERE password = ? AND email = ?`;
    const params = [password, email];
    const rows = await db.statement(sql, params);
    if (rows.isempty) res.status(400).json({error: "Invalid Credentials"});
    else {
        const token = jwt.sign({
        UserInfo: {
            email: rows[0].email,
            id: rows[0].id
        }}, secretKey, {expiresIn: '1h'});
        res.json(token);
    }
}


module.exports = {brokerage_auth_login, normal_login};
// get token, searches DB for token and returns it if found