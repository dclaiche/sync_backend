const {Router} = require('express');
const router = Router();

const { validate_signup, validate_auth } = require('../middleware/validate_requests');
const authController = require('../controllers/auth');



// CONTROLLERS OF AUTHENTICATION
router.post('/login', authController.login);

module.exports = router;