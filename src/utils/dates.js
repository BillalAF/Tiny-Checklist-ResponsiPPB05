const MS_PER_DAY = 86_400_000

const fullFormat = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const monthFormat = new Intl.DateTimeFormat('id-ID', { month: 'short' })

// Tanggal disimpan sebagai "YYYY-MM-DD" dan dibaca sebagai waktu lokal, bukan UTC, agar tidak geser sehari.
export function parseDate(value) {
  const [y, m, d] = String(value).split('-').map(Number)
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}

export function todayString() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function daysUntil(value) {
  const target = parseDate(value)
  const today = parseDate(todayString())
  if (!target || !today) return null
  return Math.round((target - today) / MS_PER_DAY)
}

export function relativeLabel(value) {
  const diff = daysUntil(value)
  if (diff === null) return ''
  if (diff < -1) return `Lewat ${Math.abs(diff)} hari`
  if (diff === -1) return 'Lewat kemarin'
  if (diff === 0) return 'Hari ini'
  if (diff === 1) return 'Besok'
  return `${diff} hari lagi`
}

export function formatFull(value) {
  const date = parseDate(value)
  return date ? fullFormat.format(date) : ''
}

export function dayOfMonth(value) {
  const date = parseDate(value)
  return date ? String(date.getDate()) : '-'
}

export function monthShort(value) {
  const date = parseDate(value)
  return date ? monthFormat.format(date).replace('.', '') : ''
}
