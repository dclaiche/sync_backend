const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const { user_signup } = require('../controllers/signup');
const { validate_signup } = require('../middleware/validate_requests');


// CONTROLLERS OF AUTHENTICATION
router.post('/signup', validate_signup, user_signup);



module.exports = router;