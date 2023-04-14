const {robinhood_get_auth, popularity, robinhood_execute_function} = require('../models/robinhoodapi');
const Database = require('../models/mysql.js');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { handle_response } = require('../models/handlers');

const db = new Database();
const secretKey = 'crazysynckey2121';
// @desc Login
// @route POST /auth
// @access Public

const login = async (req, res) => {
    // Logs in a user with a email and password 
    // returns a private JWT token granting access to the user's account with or without robinhood credentials
    const { password, email} = req.body;
    const sql = `SELECT u.id, u.email, ak.alpaca_key, ak.alpaca_secret
    FROM api_keys ak
    JOIN user u ON ak.user_id = u.id
    WHERE u.password = ? AND u.email = ?;
    `;
    const params = [password, email];
    const rows = await db.statement(sql, params);
    if (!rows.length) {
        const sql2 = `SELECT * FROM user WHERE password = ? AND email = ?`;
        const rows2 = await db.statement(sql2, params);
        if (!rows2.length) res.status(400).json({error: "Invalid Credentials"});
        else {
            const token = jwt.sign({
                UserInfo: {
                    email: rows2[0].email,
                    id: rows2[0].id
                }}, secretKey, {expiresIn: '24h'});
            res.json(token);
        }
    }
    else {
        const token = jwt.sign({
            UserInfo: {
                email: rows[0].email,
                id: rows[0].id,
                alpaca_key: rows[0].alpaca_key,
                alpaca_secret: rows[0].alpaca_secret
            }}, secretKey, {expiresIn: '24h'});
        res.json(token);
    }
}


module.exports = {
    login};
// get token, searches DB for token and returns it if found