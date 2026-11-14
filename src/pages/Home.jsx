import { relativeLabel, formatFull } from '../utils/dates.js'
import { isOverdue, priorityLabel, sortByPriority, summarize } from '../utils/tasks.js'
import DateTab from '../components/DateTab.jsx'

export default function Home({ store }) {
  const { tasks, error, retryLoad } = store
  const open = sortByPriority(tasks.filter((t) => !t.done))
  const [first, ...rest] = open
  const stats = summarize(tasks)

  return (
    <div className="grid gap-8">
      <header>
        <h1>Tugas Anda</h1>
        <p className="muted mt-1">Tugas ditampilkan menurut waktu dan prioritas</p>
      </header>

      {error && (
        <div className="card border-accent p-4" role="alert">
          <p className="font-semibold text-accent">{error}</p>
          <button type="button" className="btn btn-small mt-3" onClick={retryLoad}>
            Coba baca ulang
          </button>
        </div>
      )}

      {!first ? (
        <section className="card p-6">
          <h2>{stats.total === 0 ? 'Belum ada tugas tercatat' : 'Semua tugas sudah selesai'}</h2>
          <p className="muted mt-2">
            {stats.total === 0
              ? 'Catat tugas pertama beserta prioritas dan tenggatnya, nanti urutannya muncul di sini.'
              : 'Tidak ada tugas yang menunggu. Tambahkan tugas baru jika ada.'}
          </p>
          <a href="#/tugas/baru" className="btn btn-primary mt-5">
            {stats.total === 0 ? 'Catat tugas pertama' : 'Tambah tugas'}
          </a>
        </section>
      ) : (
        <section className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center" aria-labelledby="first-title">
          <DateTab date={first.dueDate} done={false} />
          <div className="min-w-0 flex-1">
            <p className="font-bold">
              Prioritas {priorityLabel(first.priority).toLowerCase()}
              <span className={`font-normal ${isOverdue(first) ? 'font-bold text-accent' : 'muted'}`}>
                {' '}
                · {relativeLabel(first.dueDate)}
              </span>
            </p>
            <h2 id="first-title" className="text-2xl break-words">
              {first.title}
            </h2>
            <p className="muted">
              {first.course} · {formatFull(first.dueDate)}
            </p>
          </div>
          <a href="#/tugas" className="btn">
            Buka daftar tugas
          </a>
        </section>
      )}

      {stats.total > 0 && (
        <section aria-labelledby="summary-title">
          <h2 id="summary-title" className="mb-2">
            Ringkasan
          </h2>
          <p>
            <strong>{stats.open}</strong> belum selesai
            {stats.overdue > 0 && (
              <>
                , <strong className="text-accent">{stats.overdue}</strong> di antaranya lewat tenggat
              </>
            )}
            . <strong>{stats.done}</strong> sudah selesai dari {stats.total} tugas.
          </p>
        </section>
      )}

      {rest.length > 0 && (
        <section aria-labelledby="after-title">
          <h2 id="after-title" className="mb-2">
            Berikutnya ({rest.length})
          </h2>
          <ol className="m-0 list-none p-0">
            {rest.map((t) => (
              <li key={t.id} className="flex items-baseline justify-between gap-4 border-t border-line py-3 first:border-t-0">
                <div className="min-w-0">
                  <p className="break-words font-semibold">{t.title}</p>
                  <p className="muted text-[0.9375rem]">
                    {t.course} · Prioritas {priorityLabel(t.priority).toLowerCase()}
                  </p>
                </div>
                <span className={`shrink-0 text-[0.9375rem] ${isOverdue(t) ? 'font-bold text-accent' : 'muted'}`}>
                  {relativeLabel(t.dueDate)}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
