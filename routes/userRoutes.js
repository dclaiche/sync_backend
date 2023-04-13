const {Router} = require('express');
const router = Router();


const userController = require('../controllers/user');
const { validate_signup, validate_auth } = require('../middleware/validate_requests');
const authController = require('../controllers/auth');


// CONTROLLERS OF USER

router.post('/signup', validate_signup, userController.createUser);
router.post('/robinhood_signup', validate_auth, userController.createRobinhoodUser);
router.put('/update', validate_auth, userController.updateUser);


module.exports = router;