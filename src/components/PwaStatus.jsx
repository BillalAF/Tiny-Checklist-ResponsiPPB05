import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Download, WifiOff, X } from 'lucide-react'

export default function PwaStatus({ online, install, syncing }) {
  const [readyDismissed, setReadyDismissed] = useState(false)
  const [installDismissed, setInstallDismissed] = useState(false)
  const [offlineDismissed, setOfflineDismissed] = useState(false)
  const {
    offlineReady: [offlineReady],
  } = useRegisterSW()

  let content = null
  if (!online && !offlineDismissed) {
    content = (
      <div className="relative flex flex-col items-center justify-center text-center gap-3 w-full">
        <button
          type="button"
          className="absolute -right-1 -top-1 p-1 text-muted hover:text-ink"
          onClick={() => setOfflineDismissed(true)}
          aria-label="Tutup pemberitahuan"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-paper border border-ink text-accent">
          <WifiOff size={22} aria-hidden="true" />
        </div>
        <div>
          <p className="font-bold text-ink" role="status">
            Anda sedang offline
          </p>
          <p className="muted text-sm mt-1 max-w-sm">
            {syncing
              ? 'Perubahan disimpan di perangkat dan dikirim saat internet kembali.'
              : 'Semua tugas tetap bisa dilihat dan diubah.'}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-small mt-1"
          onClick={() => setOfflineDismissed(true)}
        >
          Mengerti
        </button>
      </div>
    )
  } else if (offlineReady && !readyDismissed) {
    content = (
      <div className="relative flex flex-col items-center justify-center text-center gap-3 w-full">
        <button
          type="button"
          className="absolute -right-1 -top-1 p-1 text-muted hover:text-ink"
          onClick={() => setReadyDismissed(true)}
          aria-label="Tutup pemberitahuan"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <p className="font-semibold text-ink" role="status">
          Aplikasi siap dipakai tanpa internet.
        </p>
        <button
          type="button"
          className="btn btn-small"
          onClick={() => setReadyDismissed(true)}
        >
          Tutup
        </button>
      </div>
    )
  } else if (install.canInstall && !installDismissed) {
    content = (
      <div className="relative flex flex-col items-center justify-center text-center gap-3 w-full">
        <button
          type="button"
          className="absolute -right-1 -top-1 p-1 text-muted hover:text-ink"
          onClick={() => setInstallDismissed(true)}
          aria-label="Tutup pemberitahuan"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <div>
          <p className="font-bold text-ink">Pasang Aplikasi</p>
          <p className="muted text-sm mt-1 max-w-sm">
            Pasang Tiny Checklist di perangkat Anda agar bisa dibuka seperti aplikasi biasa.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          <button type="button" className="btn btn-small btn-primary" onClick={install.install}>
            <Download size={16} aria-hidden="true" />
            Pasang aplikasi
          </button>
          <button
            type="button"
            className="btn btn-small"
            onClick={() => setInstallDismissed(true)}
          >
            Nanti saja
          </button>
        </div>
      </div>
    )
  }

  if (!content) return null

  return (
    <aside
      className="card fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border-[1.5px] border-ink bg-card p-6 flex flex-col items-center justify-center text-center gap-3 shadow-xl"
      role="status"
    >
      {content}
    </aside>
  )
}
