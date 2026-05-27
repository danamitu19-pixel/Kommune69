import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from './Layout'
import { opprettHendelse, hentBrukere } from '../api'

export default function NyHendelse() {
  const navigate = useNavigate()
  const [brukere, setBrukere] = useState([])
  const [feil,    setFeil]    = useState('')
  const [laster,  setLaster]  = useState(false)

  const [form, setForm] = useState({
    tittel:       '',
    type:         'vannlekkasje',
    beskrivelse:  '',
    sted:         '',
    prioritet:    'medium',
    ansvarlig_id: '',
  })

  useEffect(() => { hentBrukere().then(setBrukere) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFeil('')
    setLaster(true)
    try {
      const data = await opprettHendelse(form)
      if (data.hendelse_id) {
        navigate(`/hendelser/${data.hendelse_id}`)
      } else {
        setFeil(data.message || 'Noe gikk galt')
      }
    } catch {
      setFeil('Kunne ikke opprette hendelse')
    } finally {
      setLaster(false)
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Ny hendelse</h2>
          <p>Registrer en ny hendelse i systemet</p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tittel *</label>
            <input type="text" value={form.tittel} onChange={e => setForm({ ...form, tittel: e.target.value })} placeholder="Kort beskrivende tittel" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="vannlekkasje">Vannlekkasje</option>
                <option value="brannfare">Brannfare</option>
                <option value="it_feil">IT-feil</option>
                <option value="annet">Annet</option>
              </select>
            </div>
            <div className="form-group">
              <label>Prioritet *</label>
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
              <label>Sted</label>
              <input type="text" value={form.sted} onChange={e => setForm({ ...form, sted: e.target.value })} placeholder="F.eks. Radhuset, 2. etasje" />
            </div>
            <div className="form-group">
              <label>Ansvarlig</label>
              <select value={form.ansvarlig_id} onChange={e => setForm({ ...form, ansvarlig_id: e.target.value })}>
                <option value="">Ikke tildelt</option>
                {brukere.map(b => <option key={b.bruker_id} value={b.bruker_id}>{b.brukernavn}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Beskrivelse</label>
            <textarea value={form.beskrivelse} onChange={e => setForm({ ...form, beskrivelse: e.target.value })} placeholder="Detaljert beskrivelse av hendelsen..." />
          </div>

          {feil && <p className="error-msg">{feil}</p>}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/')}>Avbryt</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={laster}>
              {laster ? 'Oppretter...' : 'Opprett hendelse'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
