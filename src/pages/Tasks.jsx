import { useState } from 'react'
import { Plus } from 'lucide-react'
import TaskItem from '../components/TaskItem.jsx'
import TaskForm from '../components/TaskForm.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { navigate } from '../hooks/useRoute.js'
import { sortTasks } from '../utils/tasks.js'

const FILTERS = [
  { value: 'all', label: 'Semua' },
  { value: 'open', label: 'Belum' },
  { value: 'done', label: 'Selesai' },
]

export default function Tasks({ store, creating }) {
  const { tasks, error, retryLoad, addTask, updateTask, toggleTask, deleteTask } = store
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const formOpen = creating || editing !== null
  const closeForm = () => {
    setEditing(null)
    if (creating) navigate('/tugas')
  }

  const handleSubmit = (input) => {
    if (editing) updateTask(editing.id, input)
    else addTask(input)
    closeForm()
  }

  const q = query.trim().toLowerCase()
  const visible = sortTasks(tasks).filter((t) => {
    if (filter === 'open' && t.done) return false
    if (filter === 'done' && !t.done) return false
    return !q || t.title.toLowerCase().includes(q) || t.course.toLowerCase().includes(q)
  })

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1>Tugas</h1>
          <p className="muted mt-1">Tambah, ubah, centang, atau hapus tugas kuliah.</p>
        </div>
        <a href="#/tugas/baru" className="btn btn-primary">
          <Plus size={18} aria-hidden="true" />
          Tambah tugas
        </a>
      </header>

      {error && (
        <div className="card border-accent p-4" role="alert">
          <p className="font-semibold text-accent">{error}</p>
          <button type="button" className="btn btn-small mt-3" onClick={retryLoad}>
            Coba baca ulang
          </button>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="flex flex-wrap items-end gap-4">
          <div className="field min-w-[12rem] flex-1">
            <label htmlFor="search">Cari judul atau mata kuliah</label>
            <input
              id="search"
              type="search"
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik kata kunci"
            />
          </div>
          <div className="field">
            <span className="field-label" id="filter-label">
              Tampilkan
            </span>
            <div className="segmented" role="group" aria-labelledby="filter-label">
              {FILTERS.map((f) => (
                <button key={f.value} type="button" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="muted" role="status">
        {tasks.length > 0 && `${visible.length} dari ${tasks.length} tugas ditampilkan`}
      </p>

      {tasks.length === 0 ? (
        <section className="card p-6">
          <h2>Daftar tugas masih kosong</h2>
          <p className="muted mt-2">Tugas yang Anda catat disimpan di perangkat ini dan tetap ada walau offline.</p>
          <a href="#/tugas/baru" className="btn btn-primary mt-5">
            Catat tugas pertama
          </a>
        </section>
      ) : visible.length === 0 ? (
        <section className="card p-6">
          <h2>Tidak ada tugas yang cocok</h2>
          <p className="muted mt-2">Ubah kata kunci atau pilih tampilan &quot;Semua&quot; untuk melihat seluruh tugas.</p>
          <button
            type="button"
            className="btn mt-5"
            onClick={() => {
              setQuery('')
              setFilter('all')
            }}
          >
            Reset pencarian
          </button>
        </section>
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0">
          {visible.map((t) => (
            <TaskItem key={t.id} task={t} onToggle={toggleTask} onEdit={setEditing} onDelete={setDeleting} />
          ))}
        </ul>
      )}

      <Modal open={formOpen} title={editing ? 'Ubah tugas' : 'Tambah tugas'} onClose={closeForm}>
        <TaskForm key={editing?.id ?? 'new'} task={editing} onSubmit={handleSubmit} onCancel={closeForm} />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Hapus tugas ini?"
        message={deleting ? `"${deleting.title}" akan dihapus permanen dan tidak bisa dikembalikan.` : ''}
        confirmLabel="Hapus tugas"
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          deleteTask(deleting.id)
          setDeleting(null)
        }}
      />
    </div>
  )
}
