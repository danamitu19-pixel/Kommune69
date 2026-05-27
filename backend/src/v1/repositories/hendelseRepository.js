const pool = require('../data/db');

const hentAlle = async () => {
  const [rows] = await pool.query(`
    SELECT h.*,
      a.brukernavn AS ansvarlig_navn,
      o.brukernavn AS opprettet_av_navn
    FROM hendelse h
    LEFT JOIN bruker a ON h.ansvarlig_id = a.bruker_id
    LEFT JOIN bruker o ON h.opprettet_av  = o.bruker_id
    ORDER BY h.dato_opprettet DESC
  `);
  return rows;
};

const hentEn = async (id) => {
  const [rows] = await pool.query(`
    SELECT h.*,
      a.brukernavn AS ansvarlig_navn,
      o.brukernavn AS opprettet_av_navn
    FROM hendelse h
    LEFT JOIN bruker a ON h.ansvarlig_id = a.bruker_id
    LEFT JOIN bruker o ON h.opprettet_av  = o.bruker_id
    WHERE h.hendelse_id = ?
  `, [id]);
  return rows[0];
};

const opprett = async ({ tittel, type, beskrivelse, sted, prioritet, opprettet_av, ansvarlig_id }) => {
  const [result] = await pool.query(
    `INSERT INTO hendelse (tittel, type, beskrivelse, sted, prioritet, opprettet_av, ansvarlig_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [tittel, type, beskrivelse, sted, prioritet, opprettet_av, ansvarlig_id || null]
  );
  return result.insertId;
};

const oppdater = async (id, { status, prioritet, ansvarlig_id, losning, dato_losning }) => {
  const [result] = await pool.query(
    `UPDATE hendelse SET
      status       = COALESCE(?, status),
      prioritet    = COALESCE(?, prioritet),
      ansvarlig_id = COALESCE(?, ansvarlig_id),
      losning      = COALESCE(?, losning),
      dato_losning = COALESCE(?, dato_losning)
     WHERE hendelse_id = ?`,
    [status, prioritet, ansvarlig_id, losning, dato_losning, id]
  );
  return result.affectedRows;
};

module.exports = { hentAlle, hentEn, opprett, oppdater };
