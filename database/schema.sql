-- Kommune 69 Varslingssystem
-- Database: kommune69

CREATE DATABASE IF NOT EXISTS kommune69
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kommune69;

-- --------------------------------------------------------
-- Tabell: bruker
-- --------------------------------------------------------
CREATE TABLE bruker (
  bruker_id     INT AUTO_INCREMENT PRIMARY KEY,
  brukernavn    VARCHAR(100)  NOT NULL UNIQUE,
  passord_hash  VARCHAR(255)  NOT NULL,
  epost         VARCHAR(150),
  rolle         ENUM('admin', 'it_avdeling', 'driftspersonell') NOT NULL
);

-- --------------------------------------------------------
-- Tabell: hendelse
-- --------------------------------------------------------
CREATE TABLE hendelse (
  hendelse_id    INT AUTO_INCREMENT PRIMARY KEY,
  tittel         VARCHAR(255) NOT NULL,
  type           ENUM('vannlekkasje', 'brannfare', 'it_feil', 'annet') NOT NULL,
  beskrivelse    TEXT,
  sted           VARCHAR(255),
  prioritet      ENUM('lav', 'medium', 'hoy', 'kritisk') NOT NULL DEFAULT 'medium',
  status         ENUM('ny', 'pagaende', 'losnet', 'lukket') NOT NULL DEFAULT 'ny',
  dato_opprettet DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dato_losning   DATETIME,
  losning        TEXT,
  ansvarlig_id   INT,
  opprettet_av   INT          NOT NULL,

  FOREIGN KEY (ansvarlig_id) REFERENCES bruker(bruker_id),
  FOREIGN KEY (opprettet_av) REFERENCES bruker(bruker_id)
);

-- --------------------------------------------------------
-- Testdata: brukere
-- Passord for alle: Test1234!
-- Hash generert med: node -e "require('argon2').hash('Test1234!').then(console.log)"
-- --------------------------------------------------------
INSERT INTO bruker (brukernavn, passord_hash, epost, rolle) VALUES
('admin1',        '$argon2id$v=19$m=65536,t=3,p=4$placeholder_hash_admin1',        'admin1@kommune69.no',   'admin'),
('it_bruker1',    '$argon2id$v=19$m=65536,t=3,p=4$placeholder_hash_it1',           'it1@kommune69.no',      'it_avdeling'),
('drift_bruker1', '$argon2id$v=19$m=65536,t=3,p=4$placeholder_hash_drift1',        'drift1@kommune69.no',   'driftspersonell');

-- --------------------------------------------------------
-- Testdata: hendelser
-- --------------------------------------------------------
INSERT INTO hendelse (tittel, type, beskrivelse, sted, prioritet, status, opprettet_av, ansvarlig_id) VALUES
('Vannlekkasje i 3. etasje',   'vannlekkasje', 'Vann renner fra taket i korridor 3B.',      'Rådhuset, 3. etasje', 'hoy',    'pagaende', 1, 1),
('IT-system nede',             'it_feil',      'Fagsystemet er utilgjengelig for alle.',     'IT-avdelingen',       'kritisk', 'ny',       1, 2),
('Brannalarm utløst',          'brannfare',    'Brannalarm gikk i kantinen, ingen brann.',   'Kantinen',            'medium',  'losnet',   1, 1);
