
async function validate_signup(req, res, next) {
    const { password, email, phone } = req.body;
    if (password && email) {
        if (!phone && phone.toString().length > 10) {
        res.status(400).json({ message: "Invalid phone number" });
        } else {
            next();
        }
    } else {
        res.status(400).json({ message: "Missing required fields" });
    }
}

module.exports = {
    validate_signup};