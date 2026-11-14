import { useState } from 'react'
import { Download, LogOut, RefreshCw } from 'lucide-react'
import { isConfigured, requireLogin } from '../lib/supabase.js'
import { syncSummary } from '../utils/sync.js'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

const PROFILE = {
  name: 'Billal Ardi Firangga',
  nim: '21120124140128',
  group: '09',
}

const THEMES = [
  { value: 'system', label: 'Ikuti perangkat' },
  { value: 'light', label: 'Terang' },
  { value: 'dark', label: 'Gelap' },
]

export default function Profile({ store, theme, install, online, auth }) {
  const [confirmClear, setConfirmClear] = useState(false)

  // Ambil data user yang sedang login dari Supabase auth
  const user = auth?.session?.user
  const userEmail = user?.email || null
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || PROFILE.name
  const userNim = user?.user_metadata?.nim || PROFILE.nim
  const userGroup = user?.user_metadata?.group || PROFILE.group

  const initials = (userName || userEmail || 'BA')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="grid gap-8">
      <h1>Profil</h1>

      {/* Card Profil Utama (Identitas + Akun Supabase + Sinkronisasi menjadi satu) */}
      <section className="card flex flex-col gap-6 p-6" aria-labelledby="identity-title">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div
            className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-paper font-serif text-3xl font-bold"
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="identity-title" className="sr-only">
              Identitas dan Akun
            </h2>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
              <dt className="muted">Nama</dt>
              <dd className="m-0 font-semibold break-words">{userName}</dd>
              <dt className="muted">NIM</dt>
              <dd className="m-0 font-semibold">{userNim}</dd>
              <dt className="muted">Kelompok</dt>
              <dd className="m-0 font-semibold">{userGroup}</dd>
              <dt className="muted">Akun Sync</dt>
              <dd className="m-0 font-semibold break-all">
                {userEmail ? (
                  <span>{userEmail}</span>
                ) : (
                  <span className="muted font-normal">Belum masuk</span>
                )}
              </dd>
            </dl>
          </div>
        </div>

        {/* Bagian Akun dan Sinkronisasi (Dipindahkan ke sini menjadi satu card) */}
        <div className="border-t border-line pt-5 grid gap-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold">Sinkronisasi Cloud</h3>
            <span className="text-xs font-semibold text-muted">
              {isConfigured ? (auth?.session ? 'Terhubung ke Supabase' : 'Belum masuk') : 'Hanya lokal'}
            </span>
          </div>

          {!isConfigured ? (
            <p className="muted text-sm">
              Supabase belum dikonfigurasi, jadi data hanya tersimpan di perangkat ini. Isi VITE_SUPABASE_URL dan
              VITE_SUPABASE_ANON_KEY untuk mengaktifkan sinkronisasi.
            </p>
          ) : (
            <>
              <p role="status" className="text-sm">
                {syncSummary({ ...store.sync, online })}
              </p>
              {store.sync.error && (
                <p className="field-error text-sm" role="alert">
                  {store.sync.error}
                </p>
              )}
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  className="btn"
                  onClick={store.sync.syncNow}
                  disabled={!online || store.sync.status === 'syncing'}
                >
                  <RefreshCw size={18} aria-hidden="true" />
                  Sinkronkan sekarang
                </button>
                {requireLogin && auth?.session && (
                  <button type="button" className="btn" onClick={auth.signOut}>
                    <LogOut size={18} aria-hidden="true" />
                    Keluar
                  </button>
                )}
              </div>
              {requireLogin && store.sync.pending > 0 && (
                <p className="muted text-xs">
                  Keluar tidak menghapus perubahan yang belum terkirim. Perubahan itu dikirim saat Anda masuk lagi.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="theme-title" className="grid gap-3">
        <h2 id="theme-title">Tampilan</h2>
        <div className="segmented self-start" role="group" aria-labelledby="theme-title">
          {THEMES.map((t) => (
            <button key={t.value} type="button" aria-pressed={theme.mode === t.value} onClick={() => theme.choose(t.value)}>
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="app-title" className="grid gap-3">
        <h2 id="app-title">Aplikasi</h2>
        <p>
          Status koneksi:{' '}
          <strong className={online ? '' : 'text-accent'}>{online ? 'online' : 'offline'}</strong>. Tugas disimpan di
          perangkat ini, jadi tetap bisa dipakai tanpa internet.
        </p>
        {install.installed ? (
          <p className="muted">Tenggat sudah terpasang di perangkat ini.</p>
        ) : install.canInstall ? (
          <button type="button" className="btn btn-primary self-start" onClick={install.install}>
            <Download size={18} aria-hidden="true" />
            Pasang aplikasi
          </button>
        ) : (
          <p className="muted">
            Tombol pasang belum tersedia. Di Chrome atau Edge pakai ikon pasang di address bar, di Safari iPhone pilih
            Bagikan lalu Tambah ke Layar Utama.
          </p>
        )}
      </section>

      <section aria-labelledby="data-title" className="grid gap-3">
        <h2 id="data-title">Data</h2>
        <p className="muted">
          {store.tasks.length === 0
            ? 'Belum ada tugas yang tersimpan.'
            : `${store.tasks.length} tugas tersimpan di perangkat ini.`}
        </p>
        <button
          type="button"
          className="btn btn-danger self-start"
          disabled={store.tasks.length === 0}
          onClick={() => setConfirmClear(true)}
        >
          Hapus semua tugas
        </button>
      </section>

      <ConfirmDialog
        open={confirmClear}
        title="Hapus semua tugas?"
        message={`${store.tasks.length} tugas akan dihapus permanen dan tidak bisa dikembalikan.`}
        confirmLabel="Hapus semua"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          store.clearTasks()
          setConfirmClear(false)
        }}
      />

      <footer className="mt-6 border-t border-line pt-6 text-center text-sm text-muted">
        <p>Tiny Checklist 🐾 · Aplikasi Reminder (untuk prak PPB)</p>
        <p className="mt-1 text-xs">Dibuat oleh Billal Ardi Firangga (21120124140128) <a href="www.instagram.com/ardhyc/">@ardhyc</a></p>
      </footer>
    </div>
  )
}
