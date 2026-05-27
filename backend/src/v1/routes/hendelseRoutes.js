const express = require('express');
const router  = express.Router();
const { hentAlle, hentEn, opprett, oppdater }  = require('../controllers/hendelseController');
const { authenticateToken, authorizeRoles }     = require('../middleware/authMiddleware');

router.get('/',    authenticateToken, hentAlle);
router.get('/:id', authenticateToken, hentEn);
router.post('/',   authenticateToken, authorizeRoles('admin'), opprett);
router.put('/:id', authenticateToken, authorizeRoles('admin'), oppdater);

module.exports = router;
