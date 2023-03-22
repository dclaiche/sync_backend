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

async function start(req, res) {
    var credentials = {
        username: 'dclaiche@hotmail.com',
        password: 'Dxto80kgwvvl$'
    };
    var mfa_code = await getMfaToken('LDDV3JUJ4VC7WZ2D');
    console.log(mfa_code);
    var Robinhood = require('robinhood')(credentials, async (err, data) => {
        if(err) {
            console.log(err);
        } else {
            if (data && data.mfa_required) {
            if (!mfa_code) {
                console.log('mfa code required');
            } else {
                Robinhood.set_mfa_code(mfa_code, () => {
                    console.log(Robinhood.auth_token());
                });
            }
            }
            else {
                console.log(Robinhood.auth_token());
            }
        }
    });
    res.end();
}


module.exports = {start};
// get token, searches DB for token and returns it if found