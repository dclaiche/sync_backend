
async function validate_signup(req, res, next) {
    const { password, email } = req.body;
    if (password && email) {
        next();
    } else {
        res.status(400).json({ message: "Missing required fields" });
    }
}

module.exports = {
    validate_signup};