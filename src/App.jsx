import { Suspense, lazy, useEffect } from 'react'
import PwaStatus from './components/PwaStatus.jsx'
import { isConfigured, requireLogin } from './lib/supabase.js'
import { syncSummary } from './utils/sync.js'
import { useAuth } from './hooks/useAuth.js'
import { useRoute } from './hooks/useRoute.js'
import { useTasks } from './hooks/useTasks.js'
import { useTheme } from './hooks/useTheme.js'
import { useInstall, useOnline } from './hooks/usePwa.js'

const Home = lazy(() => import('./pages/Home.jsx'))
const Tasks = lazy(() => import('./pages/Tasks.jsx'))
const Agenda = lazy(() => import('./pages/Agenda.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))

const NAV = [
  { href: '#/', path: '/', label: 'Beranda' },
  { href: '#/tugas', path: '/tugas', label: 'Tugas' },
  { href: '#/agenda', path: '/agenda', label: 'Agenda' },
  { href: '#/profil', path: '/profil', label: 'Profil' },
]

function sectionOf(route) {
  if (route === '/') return '/'
  const match = NAV.find((n) => n.path !== '/' && (route === n.path || route.startsWith(`${n.path}/`)))
  return match?.path ?? null
}

export default function App() {
  const auth = useAuth()

  if (auth.loading) return <p className="muted p-6" role="status">Memuat...</p>
  if (isConfigured && requireLogin && !auth.session) {
    return (
      <Suspense fallback={<p className="muted p-6" role="status">Memuat...</p>}>
        <Login auth={auth} />
      </Suspense>
    )
  }
  // key memastikan data lokal dibaca ulang ketika pengguna berganti akun.
  return <Shell key={auth.session?.user.id ?? 'lokal'} auth={auth} />
}

function Shell({ auth }) {
  const route = useRoute()
  const theme = useTheme()
  const install = useInstall()
  const online = useOnline()
  const userId = auth.session?.user.id ?? 'lokal'
  const store = useTasks({ storageKey: `tenggat:tasks:${userId}`, canSync: isConfigured, online })
  const section = sectionOf(route)
  const current = NAV.find((n) => n.path === section)

  useEffect(() => {
    document.title = current ? `${current.label} | 🐾` : 'Tidak ditemukan | Tiny Checklist'
    window.scrollTo(0, 0)
  }, [current])

  let page = <NotFound />
  if (section === '/' && route === '/') page = <Home store={store} />
  else if (section === '/tugas' && (route === '/tugas' || route === '/tugas/baru'))
    page = <Tasks store={store} creating={route === '/tugas/baru'} />
  else if (section === '/agenda' && route === '/agenda') page = <Agenda store={store} />
  else if (section === '/profil' && route === '/profil')
    page = <Profile store={store} theme={theme} install={install} online={online} auth={auth} />

  return (
    <>
      <a href="#konten" className="skip-link" onClick={(e) => {
        e.preventDefault()
        document.getElementById('konten')?.focus()
      }}>
        Lewati ke konten
      </a>

      <header className="border-ink bg-[#a656f5]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <a href="#/" className="font-mono text-3xl font-bold text-ink">
            Tiny Checklist 🐾
          </a>
          <nav className="shell-nav" aria-label="Navigasi utama">
            {NAV.map((n) => (
              <a key={n.path} href={n.href} className="nav-link" aria-current={section === n.path ? 'page' : undefined}>
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="konten" tabIndex={-1} className="mx-auto max-w-3xl px-4 py-8">
        <Suspense fallback={<p className="muted" role="status">Memuat halaman...</p>}>{page}</Suspense>
      </main>

      <footer className="mx-auto max-w-3xl px-4 pb-28 pt-4 text-[0.9375rem] md:pb-10">
        <p className="muted" role="status">
          {syncSummary({ ...store.sync, online })}
        </p>
      </footer>

      <PwaStatus online={online} install={install} syncing={isConfigured} />
    </>
  )
}
