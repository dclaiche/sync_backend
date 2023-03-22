const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const { user_signup} = require('../controllers/signup');
const { validate_signup } = require('../middleware/validate_requests');
const { brokerage_auth_login } = require('../controllers/auth');


// CONTROLLERS OF AUTHENTICATION
router.post('/signup', validate_signup, user_signup);
router.post('/brokerage_auth_login', brokerage_auth_login);


module.exports = router;