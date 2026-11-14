import { daysUntil } from './dates.js'

export const PRIORITIES = [
  { value: 'rendah', label: 'Rendah' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'tinggi', label: 'Tinggi' },
]

export function priorityLabel(value) {
  return PRIORITIES.find((p) => p.value === value)?.label ?? 'Sedang'
}

export function isOverdue(task) {
  return !task.done && daysUntil(task.dueDate) < 0
}

// Yang belum selesai di atas, diurutkan dari tenggat terdekat.
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    return a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title, 'id')
  })
}

const PRIORITY_RANK = { tinggi: 0, sedang: 1, rendah: 2 }

// Prioritas tertinggi di atas. Kalau prioritas sama, tenggat terdekat didahulukan.
export function sortByPriority(tasks) {
  return [...tasks].sort(
    (a, b) =>
      PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
      a.dueDate.localeCompare(b.dueDate) ||
      a.title.localeCompare(b.title, 'id'),
  )
}

export function summarize(tasks) {
  const open = tasks.filter((t) => !t.done)
  return {
    total: tasks.length,
    open: open.length,
    overdue: open.filter((t) => daysUntil(t.dueDate) < 0).length,
    done: tasks.length - open.length,
  }
}

// Data dari localStorage bisa rusak atau diedit manual, jadi bentuknya dicek sebelum dipakai.
export function sanitizeTasks(value) {
  if (!Array.isArray(value)) return []
  return value
    .filter(
      (t) =>
        t &&
        typeof t.id === 'string' &&
        typeof t.title === 'string' &&
        typeof t.course === 'string' &&
        typeof t.dueDate === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(t.dueDate),
    )
    .map((t) => ({
      id: t.id,
      title: t.title,
      course: t.course,
      dueDate: t.dueDate,
      priority: PRIORITIES.some((p) => p.value === t.priority) ? t.priority : 'sedang',
      note: typeof t.note === 'string' ? t.note : '',
      done: Boolean(t.done),
      updatedAt: typeof t.updatedAt === 'string' ? t.updatedAt : '',
      dirty: Boolean(t.dirty),
    }))
}

export function sanitizeState(value) {
  const deletedIds = Array.isArray(value?.deletedIds) ? value.deletedIds.filter((id) => typeof id === 'string') : []
  return { tasks: sanitizeTasks(value?.tasks), deletedIds }
}

export function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
