import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { logout } from '../api'

export default function Layout({ children }) {
  const { user, loggUt } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    loggUt()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Kommune 69</h1>
          <p>Drift — Varslingssystem</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            <span>&#9632;</span> Hendelser
          </NavLink>
        </nav>

        <div className="sidebar-user">
          <p>{user?.brukernavn}</p>
          <small>{user?.rolle?.replace('_', ' ')}</small>
          <button className="logout-btn" onClick={handleLogout}>Logg ut</button>
        </div>
      </aside>

      <main className="main">
        {children}
      </main>
    </div>
  )
}
