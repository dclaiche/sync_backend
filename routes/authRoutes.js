const {Router} = require('express');
const router = Router();


const { createUser } = require('../controllers/user');
const { validate_signup, validate_auth } = require('../middleware/validate_requests');
const authController = require('../controllers/auth');
const { get_investment_profile } = require('../controllers/user');


// CONTROLLERS OF AUTHENTICATION
router.post('/login', authController.login);
router.post('/test', authController.testPopulate);

module.exports = router;