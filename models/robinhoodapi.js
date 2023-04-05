const {getMfaToken} = require('../models/handlers');


const robinhood_get_auth = async (req, res) => {
    const { username, password, code } = req.body;
    var credentials = {username, password};
    const token = await new Promise(async (resolve, reject) => {
        var Robinhood = require('robinhood')(credentials, async (err, data) => {
            if(err) {
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            } else {
                var mfa_code = await getMfaToken(code);
                if (data && data.mfa_required) {
                if (!mfa_code) {
                    console.log('mfa code required');
                } else {
                    Robinhood.set_mfa_code(mfa_code, () => {
                        const token = Robinhood.auth_token();
                        console.log(token);
                        resolve(token);
                    });
                }
                }
                else {
                    console.log("no mfa required")
                    const token = Robinhood.auth_token();
                    resolve(token);
                }
            }
        });
    });
return token;
}


const robinhood_get_X = async (credentials, code, extra = null, apiFunction) => {
    const token = await new Promise(async (resolve, reject) => {
        console.log(credentials);
        var Robinhood = require('robinhood')(credentials, async (err, data) => {
            var mfa_code = await getMfaToken(code);
            if(err) {
                // need to test all err responses
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            } else {
                if (data && data.mfa_required) {
                    if (!mfa_code) {
                        resolve({'error' : 'mfa code required'});
                    } else {
                        Robinhood.set_mfa_code(mfa_code, async () => {
                            const body = extra ? await apiFunction(extra, Robinhood) : await apiFunction(Robinhood);
                            resolve(body)
                        });
                    }
                }
                else {
                    console.log("no mfa required")
                    const token = Robinhood.auth_token();
                }
            }
        });
    });
    return token;
}

const investment_profile = async (Robinhood) => {
    const result = await new Promise(async (resolve, reject) => {
        Robinhood.investment_profile(function(err, response, body){
            if(err){
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            }else{
                resolve(body);
            }
        });
    });
    return result;
}

const instruments = async (symbol, Robinhood) => {
    const result = await new Promise(async (resolve, reject) => {
        Robinhood.instruments(symbol, function(err, response, body){
            if(err){
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            }else{
                console.log("instruments");
                resolve(body);
            }
        })
    });
    return result;
}

const quoteData = async (stock, Robinhood) => {
    const result = await new Promise((resolve, reject) => {
        Robinhood.quote_data(stock, function(err, response, body){
            if(err){
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            }else{
                console.log("quote_data");
                resolve(body);
            }
        })
    });
    return result;
}


const accounts = async (Robinhood) => {
    const result = await new Promise((resolve, reject) => {
        Robinhood.accounts(function(err, response, body){
            if(err){
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            }else{
                console.log("accounts");
                resolve(body);
            }
        })
    });
    return result;
}

const robinUser = async (Robinhood) => {
    const result = await new Promise((resolve, reject) => {
        Robinhood.user(function(err, response, body){
            if(err){
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            }else{
                console.log("user");
                resolve(body);
            }
        })
    });
    return result;
}

const dividends = async (Robinhood) => {
    const result = await new Promise((resolve, reject) => {
        Robinhood.dividends(function(err, response, body){
            if(err){
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            }else{
                resolve(body);
            }
        })
    });
    return result;
}

const earnings = async (option, Robinhood) => {
    const result = await new Promise((resolve, reject) => {
        Robinhood.earnings(option, function(err, response, body){
            if(err){
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            }else{
                resolve(body);
            }
        })
    });
    return result;
}

const orders = async (option, Robinhood) => {
    const result = await new Promise((resolve, reject) => {
        Robinhood.orders(options, function(err, response, body){
            if(err){
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            }else{
                resolve(body);
            }
        })
    });
    return result;
}

const positions = async (Robinhood) => {
    const result = await new Promise((resolve, reject) => {
        Robinhood.positions(function(err, response, body){
            if (err){
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            }else{
                resolve(body);
            }
        });
    });
    return result;
}

const nonzero_positions = async (Robinhood) => {
    const result = await new Promise((resolve, reject) => {
        Robinhood.nonzero_positions(function(err, response, body){
            if (err){
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            }else{
                resolve(body);
            }
        });
    });
    return result;
}

const place_buy_order = async (options, Robinhood) => {
    const result = await new Promise((resolve, reject) => {
        Robinhood.place_buy_order(options, function(error, response, body){
            if(err){
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            }else{
                resolve(body);
            }
        })
    });
    return result;
}

const place_sell_order = async (options, Robinhood) => {
    const result = await new Promise((resolve, reject) => {
        Robinhood.place_sell_order(options, function(error, response, body){
            if(error){
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            }else{
                resolve(body);
            }
        })
    });
    return result;
}

module.exports = {
    robinhood_get_auth,
    robinhood_get_X,
    investment_profile,
    instruments,
    quoteData,
    accounts,
    robinUser,
    dividends,
    earnings,
    orders,
    positions,
    nonzero_positions,
    place_buy_order,
    place_sell_order
}