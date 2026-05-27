const hendelseRepo = require('../repositories/hendelseRepository');

const GYLDIGE_TYPER      = ['vannlekkasje', 'brannfare', 'it_feil', 'annet'];
const GYLDIGE_PRIORITETER = ['lav', 'medium', 'hoy', 'kritisk'];
const GYLDIGE_STATUSER   = ['ny', 'pagaende', 'losnet', 'lukket'];

// GET /api/v1/hendelser  — alle innloggede
const hentAlle = async (_req, res) => {
  try {
    const hendelser = await hendelseRepo.hentAlle();
    res.status(200).json(hendelser);
  } catch (error) {
    console.error('[hendelseController.hentAlle]', error);
    res.status(500).json({ message: 'Feil ved henting av hendelser' });
  }
};

// GET /api/v1/hendelser/:id  — alle innloggede
const hentEn = async (req, res) => {
  try {
    const hendelse = await hendelseRepo.hentEn(req.params.id);
    if (!hendelse) return res.status(404).json({ message: 'Hendelse ikke funnet' });
    res.status(200).json(hendelse);
  } catch (error) {
    console.error('[hendelseController.hentEn]', error);
    res.status(500).json({ message: 'Feil ved henting av hendelse' });
  }
};

// POST /api/v1/hendelser  — kun admin
const opprett = async (req, res) => {
  try {
    const { tittel, type, beskrivelse, sted, prioritet, ansvarlig_id } = req.body;

    if (!tittel || !type || !prioritet)
      return res.status(400).json({ message: 'Tittel, type og prioritet er pakrevd' });

    if (!GYLDIGE_TYPER.includes(type))
      return res.status(400).json({ message: 'Ugyldig type' });

    if (!GYLDIGE_PRIORITETER.includes(prioritet))
      return res.status(400).json({ message: 'Ugyldig prioritet' });

    const id = await hendelseRepo.opprett({
      tittel, type, beskrivelse, sted, prioritet,
      opprettet_av: req.user.bruker_id,
      ansvarlig_id,
    });

    res.status(201).json({ hendelse_id: id });
  } catch (error) {
    console.error('[hendelseController.opprett]', error);
    res.status(500).json({ message: 'Feil ved opprettelse av hendelse' });
  }
};

// PUT /api/v1/hendelser/:id  — kun admin
const oppdater = async (req, res) => {
  try {
    const { status } = req.body;

    if (status && !GYLDIGE_STATUSER.includes(status))
      return res.status(400).json({ message: 'Ugyldig status' });

    const rader = await hendelseRepo.oppdater(req.params.id, req.body);
    if (!rader) return res.status(404).json({ message: 'Hendelse ikke funnet' });

    res.status(200).json({ message: 'Hendelse oppdatert' });
  } catch (error) {
    console.error('[hendelseController.oppdater]', error);
    res.status(500).json({ message: 'Feil ved oppdatering av hendelse' });
  }
};

module.exports = { hentAlle, hentEn, opprett, oppdater };
