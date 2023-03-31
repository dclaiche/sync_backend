const {robinhood_get_X, investment_profile} = require('../models/robinhoodapi');
const {handle_response} = require('../models/handlers');

async function get_investment_profile(req, res) {
    console.log(req.body)
    const {credentials, code, extra, } = req.body;
    const token = await robinhood_get_X(credentials, code, extra, investment_profile);
    handle_response(res, token);
    
}

module.exports = {get_investment_profile};

