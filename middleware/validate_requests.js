const jwt = require('jsonwebtoken');

async function validate_signup(req, res, next) {
    const { password, email, phone } = req.body;
    if (password && email) {
        if (phone && phone.toString().length > 10) {
        res.status(400).json({ message: "Invalid phone number" });
        } else {
            next();
        }
    } else {
        res.status(400).json({ message: "Missing required fields" });
    }
}

const validate_auth = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    // Change secret to be in .env file
    const secretKey = 'crazysynckey2121';
    const token = authHeader.split(' ')[1]


    jwt.verify(
        token,
        secretKey,
        (err, decoded) => {
            if (err) {
                console.error('Error:', err);
                return res.status(403).json({ message: 'Forbidden' })
            }
            req.userinfo = decoded.UserInfo
            next()
        }
    )
}

module.exports = {
    validate_signup,
    validate_auth
};