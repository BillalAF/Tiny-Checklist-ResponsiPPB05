import { useSyncExternalStore } from 'react'

function subscribe(callback) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function getSnapshot() {
  return window.location.hash.replace(/^#/, '') || '/'
}

// Hash routing dipilih agar refresh dan tautan langsung tetap jalan di Vercel tanpa aturan rewrite.
export function useRoute() {
  return useSyncExternalStore(subscribe, getSnapshot, () => '/')
}

export function navigate(path) {
  window.location.hash = path
}
