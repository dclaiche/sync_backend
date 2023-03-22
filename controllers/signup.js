const Database = require('../models/mysql.js');

const db = new Database();


const user_signup = async (req, res) => {
    const { password, email, phone} = req.body;
    const sql = `INSERT INTO user (email, password, phone) VALUES (?, ?, ?)`;
    const params = [email, password, phone];
    const rows = await db.statement(sql, params);
    if (rows.code) res.status(400).json({error: rows.sqlMessage});
    else res.status(200).json(rows);
}



module.exports = {user_signup};