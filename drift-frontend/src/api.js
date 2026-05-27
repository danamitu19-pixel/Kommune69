const API = '/api/v1'

const req = (url, options = {}) =>
  fetch(`${API}${url}`, { credentials: 'include', ...options })

export const login        = (data) => req('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
}).then(r => r.json())

export const logout       = () => req('/auth/logout', { method: 'POST' })
export const hentHendelser = ()    => req('/hendelser').then(r => r.json())
export const hentHendelse  = (id)  => req(`/hendelser/${id}`).then(r => r.json())
