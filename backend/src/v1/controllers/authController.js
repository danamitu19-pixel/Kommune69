const argon2     = require('argon2');
const jwt        = require('jsonwebtoken');
const brukerRepo = require('../repositories/brukerRepository');

const SECRET_KEY  = process.env.SESSION_JWT_SECRET;
const TTL_MINUTES = Number(process.env.SESSION_TTL_MINUTES) || 480;

// POST /api/v1/auth/login  — public
const login = async (req, res) => {
  try {
    const { brukernavn, passord } = req.body;

    if (!brukernavn || !passord)
      return res.status(400).json({ message: 'Brukernavn og passord er pakrevd' });

    const bruker = await brukerRepo.finnBruker(brukernavn);
    if (!bruker)
      return res.status(401).json({ message: 'Feil brukernavn eller passord' });

    const gyldig = await argon2.verify(bruker.passord_hash, passord);
    if (!gyldig)
      return res.status(401).json({ message: 'Feil brukernavn eller passord' });

    const token = jwt.sign(
      { bruker_id: bruker.bruker_id, brukernavn: bruker.brukernavn, rolle: bruker.rolle },
      SECRET_KEY,
      { expiresIn: `${TTL_MINUTES}m` }
    );

    res.cookie('session', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   TTL_MINUTES * 60 * 1000,
    });

    res.status(200).json({ rolle: bruker.rolle, brukernavn: bruker.brukernavn });
  } catch (error) {
    console.error('[authController.login]', error);
    res.status(500).json({ message: 'Intern feil ved innlogging' });
  }
};

// POST /api/v1/auth/logout  — innlogget bruker
const logout = (_req, res) => {
  res.clearCookie('session');
  res.status(200).json({ ok: true });
};

module.exports = { login, logout };
