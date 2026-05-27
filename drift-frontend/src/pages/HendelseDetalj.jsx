import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from './Layout'
import { hentHendelse } from '../api'

export default function HendelseDetalj() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [hendelse, setHendelse] = useState(null)

  useEffect(() => { hentHendelse(id).then(setHendelse) }, [id])

  if (!hendelse) return <Layout><div className="empty">Laster...</div></Layout>

  return (
    <Layout>
      <a className="back-btn" onClick={() => navigate('/')}>
        &larr; Tilbake til hendelser
      </a>

      <div className="page-header">
        <div>
          <h2>{hendelse.tittel}</h2>
          <p>Opprettet {new Date(hendelse.dato_opprettet).toLocaleString('no-NO')}</p>
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
          <div className="detail-row"><span>Prioritet</span><span className={`badge badge-${hendelse.prioritet}`}>{hendelse.prioritet}</span></div>
          <div className="detail-row"><span>Ansvarlig</span><span>{hendelse.ansvarlig_navn || '—'}</span></div>
          <div className="detail-row"><span>Opprettet av</span><span>{hendelse.opprettet_av_navn || '—'}</span></div>
          {hendelse.dato_losning && (
            <div className="detail-row"><span>Losnet</span><span>{new Date(hendelse.dato_losning).toLocaleString('no-NO')}</span></div>
          )}
        </div>

        <div className="detail-card">
          <h3>Beskrivelse</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {hendelse.beskrivelse || 'Ingen beskrivelse'}
          </p>
          {hendelse.losning && (
            <>
              <h3 style={{ marginTop: '20px' }}>Losning</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{hendelse.losning}</p>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
