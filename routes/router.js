const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());


const { user_signup} = require('../controllers/signup');
const { validate_signup, validate_auth } = require('../middleware/validate_requests');
const authController = require('../controllers/auth');
const { get_investment_profile } = require('../controllers/user');


// CONTROLLERS OF AUTHENTICATION
router.post('/signup', validate_signup, user_signup);
router.post('/brokerage_auth_login', authController.brokerage_auth_login);

// CONTROLLERS OF USER
// re add validate_auth
router.post('/user', validate_auth, get_investment_profile);
router.post('/login', authController.normal_login);


module.exports = router;