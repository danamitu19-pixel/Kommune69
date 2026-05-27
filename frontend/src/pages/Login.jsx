import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { login } from '../api'

export default function Login() {
  const [form, setForm]   = useState({ brukernavn: '', passord: '' })
  const [feil, setFeil]   = useState('')
  const [laster, setLaster] = useState(false)
  const { loggInn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFeil('')
    setLaster(true)
    try {
      const data = await login(form)
      if (data.rolle) {
        // Kun admin har tilgang til Admin-UI. IT og drift sendes til Drift-UI.
        if (data.rolle !== 'admin') {
          setFeil('Ingen tilgang. Bruk Drift-UI for din rolle.')
          return
        }
        loggInn({ rolle: data.rolle, brukernavn: data.brukernavn })
        navigate('/')
      } else {
        setFeil(data.message || 'Feil brukernavn eller passord')
      }
    } catch {
      setFeil('Kunne ikke koble til serveren')
    } finally {
      setLaster(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Kommune 69</h1>
        <p>Varslingssystem — logg inn for å fortsette</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Brukernavn</label>
            <input
              type="text"
              value={form.brukernavn}
              onChange={e => setForm({ ...form, brukernavn: e.target.value })}
              placeholder="ditt.brukernavn"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Passord</label>
            <input
              type="password"
              value={form.passord}
              onChange={e => setForm({ ...form, passord: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          {feil && <p className="error-msg">{feil}</p>}

          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-primary" type="submit" disabled={laster}>
              {laster ? 'Logger inn...' : 'Logg inn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
