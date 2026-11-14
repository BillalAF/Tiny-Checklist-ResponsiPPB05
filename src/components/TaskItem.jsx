import { Pencil, Trash2 } from 'lucide-react'
import DateTab from './DateTab.jsx'
import { formatFull, relativeLabel } from '../utils/dates.js'
import { isOverdue, priorityLabel } from '../utils/tasks.js'

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task)
  const checkId = `done-${task.id}`

  return (
    <li className="card grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
      <DateTab date={task.dueDate} done={task.done} />

      <div className="min-w-0">
        <h3 className={task.done ? 'line-through-done muted' : ''}>{task.title}</h3>
        <p className="muted text-[0.9375rem]">
          {task.course} · Prioritas {priorityLabel(task.priority).toLowerCase()}
        </p>
        <p className="text-[0.9375rem]">
          <span className={overdue ? 'font-bold text-accent' : 'muted'}>
            {task.done ? 'Selesai' : relativeLabel(task.dueDate)}
          </span>
          <span className="muted"> · {formatFull(task.dueDate)}</span>
        </p>
        {task.note && <p className="mt-1 text-[0.9375rem] break-words">{task.note}</p>}
      </div>

      <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1 sm:justify-end">
        <label htmlFor={checkId} className="flex min-h-[44px] items-center gap-2 pr-2 font-semibold">
          <input
            id={checkId}
            type="checkbox"
            className="h-5 w-5 accent-[var(--ink)]"
            checked={task.done}
            onChange={() => onToggle(task.id)}
          />
          Selesai
        </label>
        <button type="button" className="btn btn-small" onClick={() => onEdit(task)} aria-label={`Ubah tugas ${task.title}`}>
          <Pencil size={16} aria-hidden="true" />
          Ubah
        </button>
        <button type="button" className="btn btn-small btn-danger" onClick={() => onDelete(task)} aria-label={`Hapus tugas ${task.title}`}>
          <Trash2 size={16} aria-hidden="true" />
          Hapus
        </button>
      </div>
    </li>
  )
}
