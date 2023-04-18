const crypto = require('crypto');
const base32 = require('hi-base32');

const handle_response = (res, data) => {
    if (data) {
        if (data.code) {
            res.status(data.code).json(data.body);
        }
        else {
            res.status(200).json(data);
        }
    } else {
        res.status(400).json({"error": "Unknown Error"});
    }
}

const getMfaToken = async (secret) => {
    const intervalsNo = Math.floor(Date.now() / 1000 / 30);
    const key = base32.decode.asBytes(secret.toUpperCase());
    const msg = Buffer.alloc(8);
    msg.writeBigInt64BE(BigInt(intervalsNo), 0);
    const hmac = crypto.createHmac('sha1', Buffer.from(key)).update(msg).digest();
    const o = hmac[19] & 15;
    const h = (hmac.readUInt32BE(o) & 0x7fffffff) % 1000000;
    return h.toString().padStart(6, '0');
}


module.exports = {handle_response, getMfaToken};