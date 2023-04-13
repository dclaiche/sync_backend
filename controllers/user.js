const {robinhood_execute_function, investment_profile} = require('../models/robinhoodapi');
const {handle_response} = require('../models/handlers');
const Database = require('../models/mysql.js');
const jwt = require('jsonwebtoken');

const db = new Database();
const secretKey = 'crazysynckey2121';
// User Controllers

// update user info
// https://github.com/gitdagray/mern_stack_course/blob/main/lesson_08-backend/server.js https://www.npmjs.com/package/express-async-handler?activeTab=readme

// DATABASE FUNCTIONS FOR USER

const createRobinhoodUser = async (req, res) => {
    // Adds a user's robinhood code to the database
    const {email, id} = req.userinfo;
    const {credentials, code} = req.body;
    const sql = `INSERT INTO api_keys (user_id, robinhood_code, robinhood_password, robinhood_email)
    SELECT ?, ?, ?, ?
    FROM DUAL
    WHERE NOT EXISTS (
        SELECT 1
        FROM api_keys
        WHERE user_id = ?
    );`;
    console.log(`email: ${email}, user_id: ${id}, credentials: ${credentials}, code: ${code}`);
    const params = [id, code, credentials.password, credentials.username, id];
    const rows = await db.statement(sql, params);
    console.log(rows)
    if (rows.code) {
        res.status(400).json({error: rows.sqlMessage});
    }
    else if (rows.affectedRows === 0) {
        res.status(400).json({error: "User already has registered robinhood account exists"});
    }
    else if (rows.affectedRows === 1) {
        const token = jwt.sign({
            UserInfo: {
                email: email,
                id: id,
                robinhood_code: code,
                robinhood_password: credentials.password,
                robinhood_email: credentials.username}
            }, secretKey, {expiresIn: '24h'});
        res.status(200).json(token);
    }
}

const createUser = async (req, res) => {
    const { password, email, phone} = req.body;
    const sql = `INSERT INTO user (email, password, phone)
        SELECT ?, ?, ?
        FROM DUAL
        WHERE NOT EXISTS (
            SELECT 1
            FROM user
            WHERE email = ?
    )`;
    const params = [email, password, phone, email];
    const rows = await db.statement(sql, params);
    if (rows.code) {
        res.status(400).json({error: rows.sqlMessage});
    }
    else if (rows.affectedRows === 0) {
        res.status(400).json({error: "User already exists"});
    }
    else {
        const sql2 = `SELECT * FROM user WHERE password = ? AND email = ?`;
        const params2 = [password, email];
        const user = await db.statement(sql2, params2);
        console.log(user);
        if (user.isempty) res.status(400).json({error: "Invalid Credentials"});
        else {
            const token = jwt.sign({
            UserInfo: {
                email: user[0].email,
                id: user[0].id
            }}, secretKey, {expiresIn: '24h'});
            res.json(token);
        }
    }
}

const updateUser = async (req, res) => {
    const { id, email, password, phone } = req.body;
    const sql = `UPDATE user SET email = ?, password = ?, phone = ? WHERE id = ?`;
    const params = [email, password, phone, id];
    console.log(params);
    // try {
    //     const rows = await db.statement(sql, params);
    //     if (rows.affectedRows === 0) {
    //         res.status(404).json({ error: "User not found" });
    //     } else {
    //         res.status(200).json({ message: "User updated successfully" });
    //     }
    // } catch (err) {
    //     res.status(400).json({ error: err.sqlMessage });
    // }
    res.end();
}

const getUser = async (req, res) => {
    const { password, email} = req.body;
    const sql = `SELECT * FROM user WHERE password = ? AND email = ?;
    `;
    const params = [password, email];
    
    try {
        const rows = await db.statement(sql, params);
        if (rows.length === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json(rows[0]);
        }
    } catch (err) {
        res.status(400).json({ error: err.sqlMessage });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM user WHERE id = ?`;
    const params = [id];
    
    try {
        const rows = await db.statement(sql, params);
        if (rows.affectedRows === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json({ message: "User deleted successfully" });
        }
    } catch (err) {
        res.status(400).json({ error: err.sqlMessage });
    }
}

async function get_investment_profile(req, res) {
    const {credentials, code, extra, } = req.body;
    const token = await robinhood_execute_function(credentials, code, extra, investment_profile);
    handle_response(res, token);
}

module.exports = {createUser, get_investment_profile, createRobinhoodUser, updateUser, getUser, deleteUser};

