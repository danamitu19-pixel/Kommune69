const express = require('express');
const router  = express.Router();
const { hentAlle, opprett }             = require('../controllers/brukerController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/',  authenticateToken, authorizeRoles('admin'), hentAlle);
router.post('/', authenticateToken, authorizeRoles('admin'), opprett);

module.exports = router;
