import { useEffect, useState } from 'react'
import Layout from './Layout'
import { hentBrukere, opprettBruker } from '../api'

export default function Brukere() {
  const [brukere, setBrukere] = useState([])
  const [visForm, setVisForm] = useState(false)
  const [feil,    setFeil]    = useState('')
  const [suksess, setSuksess] = useState('')

  const [form, setForm] = useState({ brukernavn: '', passord: '', epost: '', rolle: 'driftspersonell' })

  useEffect(() => { hentBrukere().then(setBrukere) }, [])

  const handleOpprett = async (e) => {
    e.preventDefault()
    setFeil('')
    const data = await opprettBruker(form)
    if (data.bruker_id) {
      setSuksess(`Bruker "${data.brukernavn}" opprettet!`)
      setForm({ brukernavn: '', passord: '', epost: '', rolle: 'driftspersonell' })
      setVisForm(false)
      hentBrukere().then(setBrukere)
      setTimeout(() => setSuksess(''), 3000)
    } else {
      setFeil(data.message || 'Noe gikk galt')
    }
  }

  const rolleLabel = { admin: 'Admin', it_avdeling: 'IT-avdeling', driftspersonell: 'Driftspersonell' }
  const rolleFarge = { admin: 'var(--accent)', it_avdeling: 'var(--info)', driftspersonell: 'var(--success)' }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Brukere</h2>
          <p>{brukere.length} brukere registrert</p>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setVisForm(!visForm)}>
          {visForm ? 'Avbryt' : '+ Ny bruker'}
        </button>
      </div>

      {suksess && <p style={{ color: 'var(--success)', marginBottom: '16px', fontSize: '13px' }}>{suksess}</p>}

      {visForm && (
        <div className="form-card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Opprett ny bruker</h3>
          <form onSubmit={handleOpprett}>
            <div className="form-row">
              <div className="form-group">
                <label>Brukernavn *</label>
                <input type="text" value={form.brukernavn} onChange={e => setForm({ ...form, brukernavn: e.target.value })} placeholder="fornavn.etternavn" required />
              </div>
              <div className="form-group">
                <label>Passord *</label>
                <input type="password" value={form.passord} onChange={e => setForm({ ...form, passord: e.target.value })} placeholder="Midlertidig passord" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>E-post</label>
                <input type="email" value={form.epost} onChange={e => setForm({ ...form, epost: e.target.value })} placeholder="epost@kommune69.no" />
              </div>
              <div className="form-group">
                <label>Rolle *</label>
                <select value={form.rolle} onChange={e => setForm({ ...form, rolle: e.target.value })}>
                  <option value="admin">Admin</option>
                  <option value="it_avdeling">IT-avdeling</option>
                  <option value="driftspersonell">Driftspersonell</option>
                </select>
              </div>
            </div>
            {feil && <p className="error-msg">{feil}</p>}
            <button type="submit" className="btn btn-primary">Opprett bruker</button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Brukernavn</th>
              <th>E-post</th>
              <th>Rolle</th>
            </tr>
          </thead>
          <tbody>
            {brukere.map(b => (
              <tr key={b.bruker_id} style={{ cursor: 'default' }}>
                <td style={{ fontWeight: 500 }}>{b.brukernavn}</td>
                <td style={{ color: 'var(--text-muted)' }}>{b.epost || '—'}</td>
                <td>
                  <span className="badge" style={{ background: rolleFarge[b.rolle] + '22', color: rolleFarge[b.rolle] }}>
                    {rolleLabel[b.rolle]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
