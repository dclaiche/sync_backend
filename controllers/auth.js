const {robinhood_get_auth} = require('../models/robinhoodapi');

async function brokerage_auth_login(req, res) {
    const token = await robinhood_get_auth(req, res);
    // TODO: Check for Error else return token
    console.log(token)
    if (token) {
        if(token.code) res.status(token.code).json(token.body);
        else res.status(200).json(token);
    } else {
        res.status(400).json({"error": "Invalid Credentials"});
    }
}


module.exports = {brokerage_auth_login};
// get token, searches DB for token and returns it if found