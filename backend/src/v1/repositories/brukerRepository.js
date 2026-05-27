const pool = require('../data/db');

const finnBruker = async (brukernavn) => {
  const [rows] = await pool.query(
    'SELECT * FROM bruker WHERE brukernavn = ?',
    [brukernavn]
  );
  return rows[0];
};

const hentAlle = async () => {
  const [rows] = await pool.query(
    'SELECT bruker_id, brukernavn, epost, rolle FROM bruker ORDER BY rolle, brukernavn'
  );
  return rows;
};

const opprett = async ({ brukernavn, passord_hash, epost, rolle }) => {
  const [result] = await pool.query(
    'INSERT INTO bruker (brukernavn, passord_hash, epost, rolle) VALUES (?, ?, ?, ?)',
    [brukernavn, passord_hash, epost, rolle]
  );
  return result.insertId;
};

module.exports = { finnBruker, hentAlle, opprett };
