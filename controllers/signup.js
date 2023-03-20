const mysql = require('mysql');

const con = mysql.createConnection({
    host: "syncdb2.cluster-cjgbedur5ue8.us-west-1.rds.amazonaws.com",
    user: "dclaiche",
    password: "Dxto80kgwvvl$",
    database: "SyncDB"
});

const user_signup = async (req, res) => {
    const { password, email } = req.body;
    con.connect(function(err) {
        con.query(`INSERT INTO user (email, password) VALUES ('${email}', '${password}')`, function(err, result, fields) {
            if (err) res.send(err);
            if (result) res.status(200).json({email: email, password: password});
            if (fields) console.log(fields);
        });
    });
}

module.exports = {user_signup};