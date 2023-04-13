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
var count = 0;

const login = async (req, res) => {
    // Logs in a user with a email and password 
    // returns a private JWT token granting access to the user's account with or without robinhood credentials
    const { password, email} = req.body;
    const sql = `SELECT u.id, u.email, ak.robinhood_code, ak.robinhood_email, ak.robinhood_password
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
                robinhood_code: rows[0].robinhood_code,
                robinhood_password: rows[0].robinhood_password,
                robinhood_email: rows[0].robinhood_email
            }}, secretKey, {expiresIn: '24h'});
        res.json(token);
    }
}

const testPopulate = async (req, res) => {
    const {credentials, code, extra } = req.body;
    const token = await robinhood_execute_function(credentials, code, extra, popularity);
    handle_response(res, token)
}


module.exports = {
    login,
    testPopulate};
// get token, searches DB for token and returns it if found