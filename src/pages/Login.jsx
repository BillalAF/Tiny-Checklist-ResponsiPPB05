import { useState } from 'react'

function explain(error) {
  const message = String(error?.message ?? error)
  if (/invalid login credentials/i.test(message)) return 'Email atau kata sandi salah.'
  if (/already registered/i.test(message)) return 'Email ini sudah terdaftar. Silakan masuk.'
  if (/email not confirmed/i.test(message)) return 'Email belum diverifikasi. Cek kotak masuk Anda.'
  if (/fetch|network/i.test(message)) return 'Tidak ada koneksi internet. Masuk pertama kali butuh internet.'
  if (/password/i.test(message)) return 'Kata sandi minimal 6 karakter.'
  return message
}

export default function Login({ auth }) {
  const [mode, setMode] = useState('masuk')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const signingUp = mode === 'daftar'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    if (!email.trim() || !password) {
      setError('Email dan kata sandi wajib diisi.')
      return
    }
    setBusy(true)
    try {
      const { data, error: authError } = signingUp
        ? await auth.signUp(email.trim(), password)
        : await auth.signIn(email.trim(), password)
      if (authError) setError(explain(authError))
      else if (signingUp && !data.session) {
        setNotice('Akun dibuat. Buka email Anda untuk verifikasi, lalu masuk.')
        setMode('masuk')
      }
    } catch (err) {
      setError(explain(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-md content-center gap-6 px-4 py-10">
      <div>
        <p className="font-serif text-2xl font-mono">Tiny Checklist 🐾</p> 
        <h1 className="mt-4">{signingUp ? 'Buat akun' : 'Masuk'}</h1>
        <p className="muted mt-1">Akun dipakai agar tugas Anda tersimpan di server dan terpisah dari pengguna lain.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="card grid gap-4 p-6">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="password">Kata sandi</label>
          <input
            id="password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={signingUp ? 'new-password' : 'current-password'}
          />
        </div>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        {notice && <p role="status">{notice}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Memproses...' : signingUp ? 'Buat akun' : 'Masuk'}
        </button>
      </form>

      <button
        type="button"
        className="btn self-start"
        onClick={() => {
          setMode(signingUp ? 'masuk' : 'daftar')
          setError('')
          setNotice('')
        }}
      >
        {signingUp ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
      </button>
    </main>
  )
}
