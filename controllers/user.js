const {robinhood_execute_function, investment_profile} = require('../models/robinhoodapi');
const {handle_response} = require('../models/handlers');
const Database = require('../models/mysql.js');
const jwt = require('jsonwebtoken');
const alpaca = require('../models/alpaca.js');

const db = new Database();
const secretKey = 'crazysynckey2121';
// User Controllers

// update user info
// https://github.com/gitdagray/mern_stack_course/blob/main/lesson_08-backend/server.js https://www.npmjs.com/package/express-async-handler?activeTab=readme

// DATABASE FUNCTIONS FOR USER

const createAlpacaUser = async (req, res) => {
    // Adds a user's robinhood code to the database
    const {email, id} = req.userinfo;
    const {key, secret} = req.body;
    if (!key || !secret) {
        res.status(400).json({error: "Missing key or secret"});
        return;
    }
    const checkAccount = await alpaca.alpacaGetAccount(key, secret);
    if (checkAccount.message) {
        res.status(parseInt(checkAccount.message.slice(-3))).json({error: checkAccount.message});
    } 
    else {
        const sql = `INSERT INTO api_keys (user_id, alpaca_key, alpaca_secret)
        SELECT ?, ?, ?
        FROM DUAL
        WHERE NOT EXISTS (
            SELECT 1
            FROM api_keys
            WHERE user_id = ?
        );`;
        const params = [id, key, secret, id];
        const rows = await db.statement(sql, params);
        if (rows.code) {
            res.status(400).json({error: rows.sqlMessage});
        }
        else if (rows.affectedRows === 0) {
            res.status(400).json({error: "User already has registered alpaca account exists"});
        }
        else if (rows.affectedRows === 1) {
            const token = jwt.sign({
                UserInfo: {
                    email: email,
                    id: id,
                    alpaca_key: key,
                    alpaca_secret: secret
                }}, secretKey, {expiresIn: '24h'});
            res.status(200).json(token);
        }
     }
}

const checkAccount = async (req, res) => {
    const {email, id, alpaca_key, alpaca_secret} = req.userinfo;
    const sql = `SELECT * FROM user WHERE id = ? AND email = ?;`;
    const params = [id, email];
    try {
        const rows = await db.statement(sql, params);
        if (rows.length === 0) {
            console.log("User not found")
            res.status(404).json({ error: "User not found" });
        } else {
            if (!alpaca_key || !alpaca_secret) {
                console.log("Missing key or secret")
                res.status(400).json({error: "Missing key or secret"});
            } else {
                const token = await alpaca.alpacaGetAccount(alpaca_key, alpaca_secret);
                if (token.message) {
                    console.log("Error with alpaca")
                    res.status(parseInt(token.message.slice(-3))).json({error: token.message});
                } else {
                    console.log("Both account exists")
                    res.status(200).json(token);
                }
            }
        }
    } catch (err) {
        res.status(400).json({ error: err.sqlMessage });
    }
}

const createUser = async (req, res) => {
    const { password, email, phone} = req.body;
    const sql = `INSERT INTO user (email, password, phone, creator_status)
        SELECT ?, ?, ?, ?
        FROM DUAL
        WHERE NOT EXISTS (
            SELECT 1
            FROM user
            WHERE email = ?
    )`;
    const params = [email, password, phone, false, email];
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
        if (user.isempty) res.status(400).json({error: "Invalid Credentials"});
        else {
            const token = jwt.sign({
            UserInfo: {
                email: user[0].email,
                id: user[0].id
            }}, secretKey, {expiresIn: '24h'});
        res.json({
            token: token,
            user: {
                id: user[0].id,
                email: user[0].email,
                phone: user[0].phone,
                creator_status: user[0].creator_status
            }
        });
        }
    }
}

const updateUser = async (req, res) => {
    // other parameters should be defaulted to NULL if not updating
    const { email, password, phone, creator_status } = req.body;
    const sql = `UPDATE user
    SET 
        email = COALESCE(?, email),
        password = COALESCE(?, password),
        phone = COALESCE(?, phone),
        creator_status = COALESCE(?, creator_status)
    WHERE id = ?
    `;
    const { id } = req.userinfo;
    const params = [email, password, phone, creator_status, id];
    try {
        const rows = await db.statement(sql, params);
        if (rows.affectedRows === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json({ message: "User updated successfully" });
        }
    } catch (err) {
        res.status(400).json({ error: err.sqlMessage });
    }
}

const getAlpacaUser = async (req, res) => {
    const { alpaca_key, alpaca_secret } = req.userinfo;
    const { date_end, period, timeframe, extended_hours} = req.body;
    const response = await alpaca.alpacaGetPortfolioHistory(alpaca_key, alpaca_secret, date_end, period, timeframe, extended_hours);
    res.status(200).json(response);
}

const getUser = async (req, res) => {
    const { id, email } = req.userinfo;
    const sql = `SELECT * FROM user WHERE id = ? AND email = ?;
    `;
    const params = [id, email];
    
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
    const { id } = req.userinfo;
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

const subscribe = async (req, res) => {
    const creator_id = parseInt(req.params.id);
    const { id} = req.userinfo;
    const sql = `INSERT INTO subs (creator_id, sub_id, active, start_time) SELECT creator.id, sub.id, 1, ?
    FROM user AS creator, user AS sub
    WHERE creator.id = ? AND sub.id = ? AND creator.creator_status = 1 AND creator.id != sub.id;
    `
    const start_time = new Date().toISOString();
    const params = [start_time, creator_id, id];
    const rows = await db.statement(sql, params);
    if (rows) {
        if (rows.code) {
            res.status(400).json(rows.sqlMessage);
        }
        else {
            res.status(200).json(rows);
        }
    } else {
        res.status(400).json({"error": "Unknown Error"});
    }
    
}

const getSubscribers = async (req, res) => {
    const { id } = req.userinfo;
    const sql = `SELECT * FROM subs WHERE creator_id = ?`;
    const params = [id];
    try {
        const rows = await db.statement(sql, params);
        if (rows.affectedRows === 0) {
            res.status(404).json({ error: "Error" });
        } else {
            res.status(200).json(rows);
        }
    } catch (err) {
        res.status(400).json({ error: err.sqlMessage });
    }
}



module.exports = {createUser, createAlpacaUser, updateUser, getUser, deleteUser, subscribe, getSubscribers, getAlpacaUser, checkAccount};

