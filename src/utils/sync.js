// Kolom database memakai snake_case, objek di aplikasi memakai camelCase.
export function toRow(task) {
  return {
    id: task.id,
    title: task.title,
    course: task.course,
    due_date: task.dueDate,
    priority: task.priority,
    note: task.note,
    done: task.done,
  }
}

export function fromRow(row) {
  return {
    id: row.id,
    title: row.title,
    course: row.course,
    dueDate: row.due_date,
    priority: row.priority,
    note: row.note ?? '',
    done: Boolean(row.done),
    updatedAt: row.updated_at ?? '',
    dirty: false,
  }
}

// Perubahan lokal yang belum terkirim selalu menang. Tugas bersih mengikuti server,
// dan tugas bersih yang sudah tidak ada di server berarti dihapus dari perangkat lain.
export function mergeRemote(tasks, deletedIds, remote) {
  const remoteById = new Map(remote.map((t) => [t.id, t]))
  const localIds = new Set(tasks.map((t) => t.id))
  const deleted = new Set(deletedIds)
  const merged = []

  for (const task of tasks) {
    if (task.dirty) merged.push(task)
    else if (remoteById.has(task.id)) merged.push(remoteById.get(task.id))
  }
  for (const task of remote) {
    if (!localIds.has(task.id) && !deleted.has(task.id)) merged.push(task)
  }
  return merged
}

export function explainError(error) {
  const message = String(error?.message ?? error)
  if (/schema cache|does not exist/i.test(message))
    return 'Tabel tasks belum ada di Supabase. Jalankan tenggat-schema.sql di SQL Editor.'
  if (/row-level security/i.test(message))
    return 'Ditolak kebijakan keamanan Supabase. Cek apakah opsi A atau B di SQL sesuai dengan VITE_REQUIRE_LOGIN.'
  if (/JWT|expired/i.test(message)) return 'Sesi login habis. Keluar lalu masuk lagi.'
  if (/fetch|network/i.test(message)) return 'Tidak bisa terhubung ke server. Akan dicoba lagi otomatis.'
  return message
}

export function syncSummary({ canSync, online, status, pending, lastSyncedAt }) {
  if (!canSync) return 'Tugas disimpan di perangkat ini. Dibuat untuk praktikum PPB.'
  if (!online) {
    return pending > 0
      ? `Offline. ${pending} perubahan menunggu dikirim saat internet kembali.`
      : 'Offline. Data tersimpan di perangkat.'
  }
  if (status === 'syncing') return 'Menyinkronkan...'
  if (status === 'error') return `${pending} perubahan belum terkirim.`
  if (pending > 0) return `${pending} perubahan menunggu dikirim.`
  if (lastSyncedAt) {
    const time = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(lastSyncedAt))
    return `Tersinkron pukul ${time}.`
  }
  return 'Belum disinkronkan.'
}
