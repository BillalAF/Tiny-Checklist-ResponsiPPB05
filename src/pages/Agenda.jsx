import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import DateTab from '../components/DateTab.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { daysUntil, formatFull, relativeLabel } from '../utils/dates.js'
import { isOverdue, priorityLabel } from '../utils/tasks.js'

export default function Agenda({ store }) {
  const { tasks, deleteTask } = store
  const [selectedTask, setSelectedTask] = useState(null)
  const [deletingTask, setDeletingTask] = useState(null)

  // Hanya tugas yang belum selesai dan sudah melewati tenggat waktu
  const overdueTasks = tasks
    .filter((t) => isOverdue(t))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  // Riwayat tugas yang sudah selesai dalam 7 hari terakhir (selebihnya di-skip)
  const historyDone = tasks
    .filter((t) => {
      if (!t.done) return false
      const targetDate = t.updatedAt ? t.updatedAt.slice(0, 10) : t.dueDate
      const diff = daysUntil(targetDate)
      return diff !== null && diff <= 0 && diff >= -7
    })
    .sort((a, b) => (b.updatedAt || b.dueDate).localeCompare(a.updatedAt || a.dueDate))

  return (
    <div className="grid gap-8">
      <header>
        <h1>Agenda</h1>
        <p className="muted mt-1">
          Daftar tugas yang telah melewati tenggat waktu serta riwayat tugas selesai.
        </p>
      </header>

      {/* Bagian Tugas Terlewat */}
      <section aria-labelledby="overdue-title" className="grid gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 id="overdue-title" className="text-accent flex items-center gap-2">
            Tugas Terlewat ({overdueTasks.length})
          </h2>
          {overdueTasks.length > 0 && (
            <span className="text-xs font-semibold text-accent">Perlu perhatian</span>
          )}
        </div>

        {overdueTasks.length === 0 ? (
          <div className="card p-6">
            <h3 className="text-base font-semibold">Tidak ada tugas yang terlewat</h3>
            <p className="muted mt-2 text-sm">
              Semua tugas Anda masih dalam batas waktu atau sudah diselesaikan.
            </p>
          </div>
        ) : (
          <ul className="m-0 list-none p-0 grid gap-3">
            {overdueTasks.map((t) => (
              <li
                key={t.id}
                className="card grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <DateTab date={t.dueDate} done={false} />

                <div className="min-w-0">
                  <h3 className="break-words">{t.title}</h3>
                  <p className="muted text-[0.9375rem]">
                    {t.course} · Prioritas {priorityLabel(t.priority).toLowerCase()}
                  </p>
                  <p className="text-[0.9375rem]">
                    <span className="font-bold text-accent">{relativeLabel(t.dueDate)}</span>
                    <span className="muted"> · {formatFull(t.dueDate)}</span>
                  </p>
                  {t.note && <p className="mt-1 text-[0.9375rem] break-words text-muted truncate max-w-lg">{t.note}</p>}
                </div>

                {/* Sesuai permintaan: hanya bisa melihat dan menghapus saja */}
                <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1 sm:justify-end">
                  <button
                    type="button"
                    className="btn btn-small"
                    onClick={() => setSelectedTask(t)}
                    aria-label={`Lihat tugas ${t.title}`}
                  >
                    <Eye size={16} aria-hidden="true" />
                    Lihat
                  </button>
                  <button
                    type="button"
                    className="btn btn-small btn-danger"
                    onClick={() => setDeletingTask(t)}
                    aria-label={`Hapus tugas ${t.title}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Card Riwayat Selesai 7 Hari Terakhir */}
      <section className="card p-6 grid gap-4" aria-labelledby="history-title">
        <div>
          <h2 id="history-title" className="text-lg font-bold">
            Riwayat Selesai (7 Hari Terakhir)
          </h2>
          <p className="muted text-sm mt-0.5">
            Tugas yang telah Anda selesaikan dalam rentang seminggu ke belakang.
          </p>
        </div>

        {historyDone.length === 0 ? (
          <p className="muted text-sm">Belum ada tugas yang diselesaikan dalam 7 hari terakhir.</p>
        ) : (
          <ul className="m-0 list-none p-0 divide-y divide-line">
            {historyDone.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="line-through-done muted font-semibold break-words">{t.title}</p>
                  <p className="muted text-[0.875rem]">
                    {t.course} · Selesai · Tenggat {formatFull(t.dueDate)}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-small shrink-0"
                  onClick={() => setSelectedTask(t)}
                  aria-label={`Lihat riwayat tugas ${t.title}`}
                >
                  <Eye size={16} aria-hidden="true" />
                  Lihat
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal Melihat Detail Tugas */}
      <Modal
        open={selectedTask !== null}
        title="Detail Tugas"
        onClose={() => setSelectedTask(null)}
      >
        {selectedTask && (
          <div className="grid gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider muted">Judul</span>
              <h3 className={`text-xl font-bold break-words mt-0.5 ${selectedTask.done ? 'line-through-done muted' : ''}`}>
                {selectedTask.title}
              </h3>
            </div>

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[0.9375rem] border-y border-line py-3">
              <dt className="muted">Mata kuliah</dt>
              <dd className="m-0 font-semibold break-words">{selectedTask.course}</dd>

              <dt className="muted">Tenggat</dt>
              <dd className="m-0 font-semibold">
                {formatFull(selectedTask.dueDate)}{' '}
                <span className={isOverdue(selectedTask) ? 'text-accent font-bold' : 'muted'}>
                  ({relativeLabel(selectedTask.dueDate)})
                </span>
              </dd>

              <dt className="muted">Prioritas</dt>
              <dd className="m-0 font-semibold">{priorityLabel(selectedTask.priority)}</dd>

              <dt className="muted">Status</dt>
              <dd className="m-0 font-semibold">
                {selectedTask.done ? (
                  <span className="text-muted">Sudah selesai</span>
                ) : isOverdue(selectedTask) ? (
                  <span className="text-accent font-bold">Terlewat</span>
                ) : (
                  <span>Belum selesai</span>
                )}
              </dd>
            </dl>

            {selectedTask.note ? (
              <div>
                <span className="text-xs uppercase font-bold tracking-wider muted">Catatan</span>
                <p className="mt-1 text-sm whitespace-pre-wrap break-words">{selectedTask.note}</p>
              </div>
            ) : (
              <p className="text-sm muted italic">Tidak ada catatan untuk tugas ini.</p>
            )}

            <div className="mt-2 flex justify-end gap-3">
              <button type="button" className="btn" onClick={() => setSelectedTask(null)}>
                Tutup
              </button>
              {!selectedTask.done && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    const toDelete = selectedTask
                    setSelectedTask(null)
                    setDeletingTask(toDelete)
                  }}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Hapus Tugas
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmDialog
        open={deletingTask !== null}
        title="Hapus tugas terlewat?"
        message={deletingTask ? `Tugas "${deletingTask.title}" akan dihapus permanen.` : ''}
        confirmLabel="Hapus tugas"
        onCancel={() => setDeletingTask(null)}
        onConfirm={() => {
          if (deletingTask) {
            deleteTask(deletingTask.id)
            setDeletingTask(null)
          }
        }}
      />
    </div>
  )
}
