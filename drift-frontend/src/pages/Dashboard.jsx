import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from './Layout'
import { hentHendelser } from '../api'

const prioritetLabel = { lav: 'Lav', medium: 'Medium', hoy: 'Hoy', kritisk: 'Kritisk' }
const statusLabel    = { ny: 'Ny', pagaende: 'Pagaende', losnet: 'Losnet', lukket: 'Lukket' }
const typeLabel      = { vannlekkasje: 'Vannlekkasje', brannfare: 'Brannfare', it_feil: 'IT-feil', annet: 'Annet' }

export default function Dashboard() {
  const [hendelser, setHendelser] = useState([])
  const [filtrert,  setFiltrert]  = useState([])
  const [sok,       setSok]       = useState('')
  const [statusFilter,    setStatusFilter]    = useState('')
  const [prioritetFilter, setPrioritetFilter] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    hentHendelser().then(data => {
      if (Array.isArray(data)) { setHendelser(data); setFiltrert(data) }
    })
  }, [])

  useEffect(() => {
    let res = hendelser
    if (sok)             res = res.filter(h => h.tittel.toLowerCase().includes(sok.toLowerCase()) || h.sted?.toLowerCase().includes(sok.toLowerCase()))
    if (statusFilter)    res = res.filter(h => h.status === statusFilter)
    if (prioritetFilter) res = res.filter(h => h.prioritet === prioritetFilter)
    setFiltrert(res)
  }, [sok, statusFilter, prioritetFilter, hendelser])

  const total   = hendelser.length
  const kritisk = hendelser.filter(h => h.prioritet === 'kritisk').length
  const aktive  = hendelser.filter(h => h.status === 'pagaende').length
  const losnete = hendelser.filter(h => h.status === 'losnet').length

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Hendelser</h2>
          <p>Oversikt — kun lesing</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-label">Totalt</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-card kritisk">
          <div className="stat-label">Kritiske</div>
          <div className="stat-value">{kritisk}</div>
        </div>
        <div className="stat-card aktiv">
          <div className="stat-label">Pagaende</div>
          <div className="stat-value">{aktive}</div>
        </div>
        <div className="stat-card losnet">
          <div className="stat-label">Losnet</div>
          <div className="stat-value">{losnete}</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <input
            type="text"
            placeholder="Sok pa tittel eller sted..."
            value={sok}
            onChange={e => setSok(e.target.value)}
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Alle statuser</option>
            <option value="ny">Ny</option>
            <option value="pagaende">Pagaende</option>
            <option value="losnet">Losnet</option>
            <option value="lukket">Lukket</option>
          </select>
          <select value={prioritetFilter} onChange={e => setPrioritetFilter(e.target.value)}>
            <option value="">Alle prioriteter</option>
            <option value="kritisk">Kritisk</option>
            <option value="hoy">Hoy</option>
            <option value="medium">Medium</option>
            <option value="lav">Lav</option>
          </select>
        </div>

        {filtrert.length === 0 ? (
          <div className="empty">Ingen hendelser funnet</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tittel</th>
                <th>Type</th>
                <th>Prioritet</th>
                <th>Status</th>
                <th>Sted</th>
                <th>Ansvarlig</th>
                <th>Dato</th>
              </tr>
            </thead>
            <tbody>
              {filtrert.map(h => (
                <tr key={h.hendelse_id} onClick={() => navigate(`/hendelser/${h.hendelse_id}`)}>
                  <td style={{ fontWeight: 500 }}>{h.tittel}</td>
                  <td>{typeLabel[h.type] || h.type}</td>
                  <td><span className={`badge badge-${h.prioritet}`}>{prioritetLabel[h.prioritet]}</span></td>
                  <td><span className={`badge badge-${h.status}`}>{statusLabel[h.status]}</span></td>
                  <td>{h.sted || '—'}</td>
                  <td>{h.ansvarlig_navn || '—'}</td>
                  <td>{new Date(h.dato_opprettet).toLocaleDateString('no-NO')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}
