const {robinhood_get_auth} = require('../models/robinhoodapi');

async function brokerage_auth_login(req, res) {
    const token = await robinhood_get_auth(req, res);
    console.log("hi")
    res.status(200).json(token);
}


module.exports = {brokerage_auth_login};
// get token, searches DB for token and returns it if found