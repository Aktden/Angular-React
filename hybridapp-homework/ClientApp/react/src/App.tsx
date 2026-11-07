import { useEffect, useState, type FormEvent } from 'react'
import { apiRequest, type AuthResponse, type DemoResponse } from './api'
import './App.css'

export default function App() {
  const [username, setUsername] = useState('demo')
  const [password, setPassword] = useState('')
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiRequest<AuthResponse>('/auth/me')
      .then((user) => {
        setCurrentUser(user.username)
        return apiRequest<DemoResponse>('/demo/message')
      })
      .then((result) => setMessage(result.message))
      .catch(() => setCurrentUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')

    try {
      const user = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, rememberMe: true }),
      })
      setCurrentUser(user.username)
      const result = await apiRequest<DemoResponse>('/demo/message')
      setMessage(result.message)
      setPassword('')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось выполнить вход.')
      setCurrentUser(null)
    } finally {
      setBusy(false)
    }
  }

  async function handleLogout() {
    setBusy(true)
    setError('')
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST' })
      setCurrentUser(null)
      setMessage('')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось выйти.')
    } finally {
      setBusy(false)
    }
  }

  async function refreshSession() {
    setError('')
    try {
      const user = await apiRequest<AuthResponse>('/auth/me')
      setCurrentUser(user.username)
      const result = await apiRequest<DemoResponse>('/demo/message')
      setMessage(result.message)
    } catch (requestError) {
      setCurrentUser(null)
      setMessage('')
      setError(requestError instanceof Error ? requestError.message : 'Сессия не найдена.')
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="HybridApp home">
          <span className="brand-mark">H</span>
          <span>HybridApp</span>
        </a>
        <span className="client-label">React client</span>
      </header>

      <section className="hero">
        <p className="eyebrow">ONE BACKEND · TWO FRONTENDS</p>
        <h1>Единая платформа.<br /><span>Два клиента.</span></h1>
        <p className="hero-copy">
          React и Angular обращаются к одному ASP.NET Core API и используют общую cookie-авторизацию
          при размещении на одном домене.
        </p>
        <div className="route-pills">
          <span>/ — React</span>
          <a href="/angular/">/angular/ — Angular ↗</a>
          <span>/api — ASP.NET Core</span>
        </div>
      </section>

      <section className="auth-card" aria-labelledby="auth-title">
        <div className="card-heading">
          <div>
            <p className="eyebrow">AUTHENTICATION</p>
            <h2 id="auth-title">Проверка общей сессии</h2>
          </div>
          <span className={`status-dot ${currentUser ? 'is-online' : ''}`} />
        </div>

        {loading ? (
          <p className="muted">Проверяем сессию…</p>
        ) : currentUser ? (
          <div className="signed-in">
            <p className="muted">Вы вошли как</p>
            <strong className="user-name">{currentUser}</strong>
            <p className="api-message">{message || 'Авторизация подтверждена сервером.'}</p>
            <div className="button-row">
              <button className="button button-secondary" type="button" onClick={refreshSession} disabled={busy}>
                Проверить сессию
              </button>
              <button className="button button-primary" type="button" onClick={handleLogout} disabled={busy}>
                {busy ? 'Подождите…' : 'Выйти'}
              </button>
            </div>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleLogin}>
            <label>
              Логин
              <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
            </label>
            <label>
              Пароль
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required />
            </label>
            {error && <p className="error-message" role="alert">{error}</p>}
            <button className="button button-primary submit-button" type="submit" disabled={busy}>
              {busy ? 'Выполняется вход…' : 'Войти'}
            </button>
            <p className="form-hint">Демо-доступ: <code>demo</code> / <code>Demo123!</code></p>
          </form>
        )}
        {currentUser && error && <p className="error-message" role="alert">{error}</p>}
      </section>

      <footer className="page-footer">
        <span>ASP.NET Core Web API</span>
        <span>CookieAuthentication · HttpOnly · SameSite=Lax</span>
      </footer>
    </main>
  )
}
