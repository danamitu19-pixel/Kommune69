const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SESSION_JWT_SECRET;

// Verifiserer session-cookie. Setter req.user = { bruker_id, brukernavn, rolle }.
function authenticateToken(req, res, next) {
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ error: 'ikke_innlogget' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ error: 'ikke_innlogget' });
    req.user = user;
    next();
  });
}

// Bruk: authorizeRoles('admin')  eller  authorizeRoles('admin', 'it_avdeling')
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rolle)) {
      return res.status(403).json({ message: 'Ingen tilgang' });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
