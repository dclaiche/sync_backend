const {Router} = require('express');
const router = Router();


const userController = require('../controllers/user');
const { validate_signup, validate_auth } = require('../middleware/validate_requests');

// CONTROLLERS OF USER

router.post('/signup', validate_signup, userController.createUser);
router.post('/alpaca_signup', validate_auth, userController.createAlpacaUser);
router.put('/update', validate_auth, userController.updateUser);


module.exports = router;