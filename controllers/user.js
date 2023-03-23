const {robinhood_get_account} = require('../models/robinhoodapi');

async function get_user_info(req, res) {
    const token = await robinhood_get_account(req, res);
    res.end();
}

module.exports = {get_user_info};