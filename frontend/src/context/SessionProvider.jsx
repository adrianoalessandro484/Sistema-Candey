import { useState } from 'react'
import { SessionContext } from './sessionContext.js'
import { login } from '../services/authService.js'
import { SESSION_KEY } from '../services/apiConfig.js'

function getSavedSession() {
  const saved = localStorage.getItem(SESSION_KEY)
  if (!saved) return null

  try {
    const session = JSON.parse(saved)
    return session?.token ? session : null
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function SessionProvider({ children }) {
  const [user, setUser] = useState(getSavedSession)

  async function startSession(credentials) {
    const session = await login(credentials)
    setUser(session)
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return session
  }

  function closeSession() {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  return (
    <SessionContext.Provider value={{ user, startSession, closeSession }}>
      {children}
    </SessionContext.Provider>
  )
}
