require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');

const authRoutes     = require('./v1/routes/authRoutes');
const hendelseRoutes = require('./v1/routes/hendelseRoutes');
const brukerRoutes   = require('./v1/routes/brukerRoutes');

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    'http://192.168.20.40:5173', // Admin-UI
    'http://192.168.10.10:5173', // Drift-UI
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/hendelser', hendelseRoutes);
app.use('/api/v1/brukere',   brukerRoutes);

app.get('/api/v1/health', (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'internal_error' });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`kommune69-api kjorer pa port ${PORT}`);
});
