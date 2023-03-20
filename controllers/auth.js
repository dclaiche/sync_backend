
const {tester} = require('../models/tokens');

const new_token = async (req, res) => {
    console.log("new_token");
    const username = "devon"
    const result = await tester(username);
    res.status(200).json(result);
}

const test2 = async (req, res) => {
    res.status(200).json({message: "test2"});
}

module.exports = {new_token, test2};