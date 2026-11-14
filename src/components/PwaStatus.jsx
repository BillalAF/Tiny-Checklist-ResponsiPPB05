import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Download, WifiOff, X } from 'lucide-react'

export default function PwaStatus({ online, install, syncing }) {
  const [readyDismissed, setReadyDismissed] = useState(false)
  const [installDismissed, setInstallDismissed] = useState(false)
  const {
    offlineReady: [offlineReady],
  } = useRegisterSW()

  let content = null
  if (!online) {
    content = (
      <p className="flex items-center gap-2" role="status">
        <WifiOff size={18} aria-hidden="true" />
        {syncing
          ? 'Anda sedang offline. Perubahan disimpan di perangkat dan dikirim saat internet kembali.'
          : 'Anda sedang offline. Semua tugas tetap bisa dilihat dan diubah.'}
      </p>
    )
  } else if (offlineReady && !readyDismissed) {
    content = (
      <>
        <p role="status">Aplikasi siap dipakai tanpa internet.</p>
        <DismissButton onClick={() => setReadyDismissed(true)} />
      </>
    )
  } else if (install.canInstall && !installDismissed) {
    content = (
      <>
        <p>Pasang Tiny Checklist di perangkat agar bisa dibuka seperti aplikasi biasa.</p>
        <div className="flex gap-2">
          <button type="button" className="btn btn-small btn-primary" onClick={install.install}>
            <Download size={16} aria-hidden="true" />
            Pasang aplikasi
          </button>
          <DismissButton onClick={() => setInstallDismissed(true)} />
        </div>
      </>
    )
  }

  if (!content) return null

  return (
    <aside className="card fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-10 mx-auto flex max-w-xl flex-wrap items-center justify-between gap-3 border-ink p-3 md:bottom-4">
      {content}
    </aside>
  )
}

function DismissButton({ onClick }) {
  return (
    <button type="button" className="btn btn-small" onClick={onClick} aria-label="Tutup pemberitahuan">
      <X size={16} aria-hidden="true" />
    </button>
  )
}
