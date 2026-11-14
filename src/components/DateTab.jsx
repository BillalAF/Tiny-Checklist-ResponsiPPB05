import { dayOfMonth, daysUntil, monthShort } from '../utils/dates.js'

// Warna aksen hanya menandai tenggat yang sudah lewat atau jatuh hari ini.
export default function DateTab({ date, done }) {
  const urgent = !done && daysUntil(date) <= 0
  return (
    <div className="date-tab" data-urgent={urgent} data-done={done} aria-hidden="true">
      <strong>{dayOfMonth(date)}</strong>
      <span>{monthShort(date)}</span>
    </div>
  )
}
