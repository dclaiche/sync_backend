const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const { user_signup} = require('../controllers/signup');
const { validate_signup } = require('../middleware/validate_requests');
const { start } = require('../controllers/auth');


// CONTROLLERS OF AUTHENTICATION
router.post('/signup', validate_signup, user_signup);
router.get('/start', start);
router.post('/start', start);


module.exports = router;