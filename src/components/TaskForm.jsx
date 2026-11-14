import { useState } from 'react'
import { PRIORITIES } from '../utils/tasks.js'
import { parseDate } from '../utils/dates.js'

const EMPTY = { title: '', course: '', dueDate: '', priority: 'sedang', note: '' }

function validate(values) {
  const errors = {}
  if (!values.title.trim()) errors.title = 'Judul tugas wajib diisi.'
  else if (values.title.trim().length > 80) errors.title = 'Judul maksimal 80 karakter.'
  if (!values.course.trim()) errors.course = 'Mata kuliah wajib diisi.'
  if (!values.dueDate) errors.dueDate = 'Tenggat wajib diisi.'
  else if (!parseDate(values.dueDate)) errors.dueDate = 'Format tanggal tidak valid.'
  return errors
}

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => (task ? { ...EMPTY, ...task } : EMPTY))
  const [errors, setErrors] = useState({})

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    onSubmit({
      title: values.title.trim(),
      course: values.course.trim(),
      dueDate: values.dueDate,
      priority: values.priority,
      note: values.note.trim(),
    })
  }

  const fieldProps = (name) => ({
    id: `task-${name}`,
    value: values[name],
    onChange: set(name),
    className: 'input',
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `task-${name}-error` : undefined,
  })

  const error = (name) =>
    errors[name] && (
      <p id={`task-${name}-error`} className="field-error" role="alert">
        {errors[name]}
      </p>
    )

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <div className="field">
        <label htmlFor="task-title">Judul tugas</label>
        <input {...fieldProps('title')} type="text" placeholder="Contoh: Laporan praktikum modul 5" autoComplete="off" />
        {error('title')}
      </div>

      <div className="field">
        <label htmlFor="task-course">Mata kuliah</label>
        <input {...fieldProps('course')} type="text" placeholder="Nama mata kuliah" autoComplete="off" />
        {error('course')}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="task-dueDate">Tenggat</label>
          <input {...fieldProps('dueDate')} type="date" />
          {error('dueDate')}
        </div>
        <div className="field">
          <label htmlFor="task-priority">Prioritas</label>
          <select {...fieldProps('priority')}>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="task-note">Catatan (opsional)</label>
        <textarea {...fieldProps('note')} rows={3} placeholder="Link, halaman, atau hal yang perlu diingat" />
      </div>

      <div className="mt-2 flex flex-wrap justify-end gap-3">
        <button type="button" className="btn" onClick={onCancel}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary">
          {task ? 'Simpan perubahan' : 'Simpan tugas'}
        </button>
      </div>
    </form>
  )
}
