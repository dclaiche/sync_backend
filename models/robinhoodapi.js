const crypto = require('crypto');
const base32 = require('hi-base32');

async function getMfaToken(secret) {
    const intervalsNo = Math.floor(Date.now() / 1000 / 30);
    const key = base32.decode.asBytes(secret.toUpperCase());
    const msg = Buffer.alloc(8);
    msg.writeBigInt64BE(BigInt(intervalsNo), 0);
    const hmac = crypto.createHmac('sha1', Buffer.from(key)).update(msg).digest();
    const o = hmac[19] & 15;
    const h = (hmac.readUInt32BE(o) & 0x7fffffff) % 1000000;
    return h.toString().padStart(6, '0');
}


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


const robinhood_get_account = async (req, res) => {
    var credentials = {"username" : "dclaiche@hotmail.com", "password" : "Dxto80kgwvvl$"};

    const token = await new Promise(async (resolve, reject) => {
        var Robinhood = require('robinhood')(credentials, async (err, data) => {
            var mfa_code = await getMfaToken("5EDENVA5RQ5AT7VZ");
            console.log(Robinhood.auth_token());
            if(err) {
                const responseMatch = err.message.match(/\{.*\}/s);
                const response = responseMatch ? responseMatch[0] : '{}';
                const { statusCode, body } = JSON.parse(response);
                resolve({'code' : statusCode, 'body' : body});
            } else {
                if (data && data.mfa_required) {
                if (!mfa_code) {
                    resolve({'error' : 'mfa code required'});
                } else {
                    Robinhood.set_mfa_code(mfa_code, () => {
                        Robinhood.investment_profile(function(err, response, body){
                            if(err){
                                console.error(err);
                            }else{
                                resolve(body);
                            }

                        });
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

module.exports = {
    robinhood_get_auth,
    robinhood_get_account
}