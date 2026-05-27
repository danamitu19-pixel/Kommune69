import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from './Layout'
import { hentHendelse, oppdaterHendelse, hentBrukere } from '../api'
import { useAuth } from '../auth'

export default function HendelseDetalj() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { user }  = useAuth()

  const [hendelse, setHendelse] = useState(null)
  const [brukere,  setBrukere]  = useState([])
  const [form,     setForm]     = useState({})
  const [lagret,   setLagret]   = useState(false)
  const [feil,     setFeil]     = useState('')

  useEffect(() => {
    hentHendelse(id).then(data => {
      setHendelse(data)
      setForm({
        status:       data.status,
        prioritet:    data.prioritet,
        ansvarlig_id: data.ansvarlig_id || '',
        losning:      data.losning || '',
        dato_losning: data.dato_losning ? data.dato_losning.slice(0, 16) : '',
      })
    })
    if (user?.rolle === 'admin') hentBrukere().then(setBrukere)
  }, [id])

  const handleLagre = async () => {
    setFeil('')
    const res = await oppdaterHendelse(id, form)
    if (res.message === 'Hendelse oppdatert') {
      setLagret(true)
      setTimeout(() => setLagret(false), 2000)
      hentHendelse(id).then(setHendelse)
    } else {
      setFeil(res.message || 'Noe gikk galt')
    }
  }

  if (!hendelse) return <Layout><div className="empty">Laster...</div></Layout>

  const erAdmin = user?.rolle === 'admin'

  return (
    <Layout>
      <a className="back-btn" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        &larr; Tilbake til dashboard
      </a>

      <div className="page-header">
        <div>
          <h2>{hendelse.tittel}</h2>
          <p>Opprettet av {hendelse.opprettet_av_navn} &mdash; {new Date(hendelse.dato_opprettet).toLocaleString('no-NO')}</p>
        </div>
        <span className={`badge badge-${hendelse.prioritet}`} style={{ fontSize: '13px', padding: '6px 14px' }}>
          {hendelse.prioritet?.toUpperCase()}
        </span>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Informasjon</h3>
          <div className="detail-row"><span>Type</span><span>{hendelse.type?.replace('_', '-')}</span></div>
          <div className="detail-row"><span>Sted</span><span>{hendelse.sted || '—'}</span></div>
          <div className="detail-row"><span>Status</span><span className={`badge badge-${hendelse.status}`}>{hendelse.status}</span></div>
          <div className="detail-row"><span>Ansvarlig</span><span>{hendelse.ansvarlig_navn || '—'}</span></div>
          {hendelse.dato_losning && (
            <div className="detail-row"><span>Losnet</span><span>{new Date(hendelse.dato_losning).toLocaleString('no-NO')}</span></div>
          )}
        </div>

        <div className="detail-card">
          <h3>Beskrivelse</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{hendelse.beskrivelse || 'Ingen beskrivelse'}</p>
          {hendelse.losning && (
            <>
              <h3 style={{ marginTop: '16px' }}>Losning</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{hendelse.losning}</p>
            </>
          )}
        </div>
      </div>

      {erAdmin && (
        <div className="form-card">
          <h3 style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Oppdater hendelse
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="ny">Ny</option>
                <option value="pagaende">Pagaende</option>
                <option value="losnet">Losnet</option>
                <option value="lukket">Lukket</option>
              </select>
            </div>
            <div className="form-group">
              <label>Prioritet</label>
              <select value={form.prioritet} onChange={e => setForm({ ...form, prioritet: e.target.value })}>
                <option value="lav">Lav</option>
                <option value="medium">Medium</option>
                <option value="hoy">Hoy</option>
                <option value="kritisk">Kritisk</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ansvarlig</label>
              <select value={form.ansvarlig_id} onChange={e => setForm({ ...form, ansvarlig_id: e.target.value })}>
                <option value="">Ikke tildelt</option>
                {brukere.map(b => <option key={b.bruker_id} value={b.bruker_id}>{b.brukernavn}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Dato losnet</label>
              <input type="datetime-local" value={form.dato_losning} onChange={e => setForm({ ...form, dato_losning: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Losning</label>
            <textarea value={form.losning} onChange={e => setForm({ ...form, losning: e.target.value })} placeholder="Beskriv hva som ble gjort..." />
          </div>

          {feil   && <p className="error-msg">{feil}</p>}
          {lagret && <p style={{ color: 'var(--success)', fontSize: '13px', textAlign: 'center', marginBottom: '8px' }}>Lagret!</p>}

          <button className="btn btn-primary" onClick={handleLagre}>Lagre endringer</button>
        </div>
      )}
    </Layout>
  )
}
