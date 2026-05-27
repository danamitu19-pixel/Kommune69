import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kommune69_drift_user')
    return saved ? JSON.parse(saved) : null
  })

  const loggInn = (data) => {
    localStorage.setItem('kommune69_drift_user', JSON.stringify(data))
    setUser(data)
  }

  const loggUt = () => {
    localStorage.removeItem('kommune69_drift_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loggInn, loggUt }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
