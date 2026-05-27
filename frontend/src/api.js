const API = '/api/v1'

const req = (url, options = {}) =>
  fetch(`${API}${url}`, { credentials: 'include', ...options })

const json = (url, method, body) =>
  req(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json())

export const login         = (data)     => json('/auth/login',  'POST', data)
export const logout        = ()         => req('/auth/logout', { method: 'POST' })

export const hentHendelser = ()         => req('/hendelser').then(r => r.json())
export const hentHendelse  = (id)       => req(`/hendelser/${id}`).then(r => r.json())
export const opprettHendelse = (data)   => json('/hendelser',   'POST', data)
export const oppdaterHendelse = (id, d) => json(`/hendelser/${id}`, 'PUT', d)

export const hentBrukere   = ()         => req('/brukere').then(r => r.json())
export const opprettBruker = (data)     => json('/brukere',     'POST', data)
