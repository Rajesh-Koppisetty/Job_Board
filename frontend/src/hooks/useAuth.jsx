import { createContext, useContext, useEffect, useState } from 'react'
import { authApi, userApi } from '@/services/jobService'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const persistAuth = (data) => {
    localStorage.setItem('token', data.token)
    const userData = {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    }
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(data.token)
    setUser(userData)
  }

  const refreshUser = async () => {
    if (!token) return
    const { data } = await userApi.getProfile()
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
  }

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password })
    persistAuth(data)
  }

  const register = async (payload) => {
    const { data } = await authApi.register(payload)
    persistAuth(data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem('user')
      if (stored) setUser(JSON.parse(stored))
      if (token) {
        try {
          await refreshUser()
        } catch {
          logout()
        }
      }
      setLoading(false)
    }
    init()
  }, [token]) // include token dependency as suggested by linter

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isRecruiter: user?.role === 'ROLE_RECRUITER' || user?.role === 'ROLE_ADMIN',
        isAdmin: user?.role === 'ROLE_ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
