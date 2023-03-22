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
            var mfa_code = await getMfaToken(code);
            if(err) {
                resolve(err);
            } else {
                if (data && data.mfa_required) {
                if (!mfa_code) {
                    console.log('mfa code required');
                } else {
                    Robinhood.set_mfa_code(mfa_code, () => {
                        const token = Robinhood.auth_token();
                        console.log(`token in model:  + ${token}`);
                        resolve(token);
                    });
                }
                }
                else {
                    const token = Robinhood.auth_token();
                    resolve(token);
                }
            }
        });
    });
return token;

}

module.exports = {
    robinhood_get_auth
}