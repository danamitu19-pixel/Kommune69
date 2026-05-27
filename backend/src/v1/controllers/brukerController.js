const argon2     = require('argon2');
const brukerRepo = require('../repositories/brukerRepository');

const GYLDIGE_ROLLER = ['admin', 'it_avdeling', 'driftspersonell'];

// GET /api/v1/brukere  — kun admin
const hentAlle = async (_req, res) => {
  try {
    const brukere = await brukerRepo.hentAlle();
    res.status(200).json(brukere);
  } catch (error) {
    console.error('[brukerController.hentAlle]', error);
    res.status(500).json({ message: 'Feil ved henting av brukere' });
  }
};

// POST /api/v1/brukere  — kun admin
const opprett = async (req, res) => {
  try {
    const { brukernavn, passord, epost, rolle } = req.body;

    if (!brukernavn || !passord || !rolle)
      return res.status(400).json({ message: 'Brukernavn, passord og rolle er pakrevd' });

    if (!GYLDIGE_ROLLER.includes(rolle))
      return res.status(400).json({ message: 'Ugyldig rolle' });

    const eksisterer = await brukerRepo.finnBruker(brukernavn);
    if (eksisterer)
      return res.status(409).json({ message: 'Brukernavn er allerede i bruk' });

    const passord_hash = await argon2.hash(passord);
    const id = await brukerRepo.opprett({ brukernavn, passord_hash, epost, rolle });

    res.status(201).json({ bruker_id: id, brukernavn, rolle });
  } catch (error) {
    console.error('[brukerController.opprett]', error);
    res.status(500).json({ message: 'Feil ved opprettelse av bruker' });
  }
};

module.exports = { hentAlle, opprett };
