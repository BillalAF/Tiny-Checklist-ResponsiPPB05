export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return { value: fallback, error: null }
    return { value: JSON.parse(raw), error: null }
  } catch {
    return { value: fallback, error: 'Penyimpanan peramban tidak bisa dibaca.' }
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return null
  } catch {
    return 'Perubahan tidak bisa disimpan. Penyimpanan peramban penuh atau dimatikan.'
  }
}

export function readText(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeText(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Preferensi tampilan tidak kritis, jadi gagal simpan boleh diabaikan.
  }
}
