const {Router} = require('express');
const router = Router();

const tradingController = require('../controllers/trading');
const { validate_signup, validate_auth } = require('../middleware/validate_requests');


router.get('/account', validate_auth, tradingController.getAccount);
router.post('/create', validate_auth, tradingController.createOrder);

module.exports = router;