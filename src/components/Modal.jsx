import { useEffect, useRef } from 'react'

// <dialog> bawaan sudah menangani fokus terkurung dan tombol Escape.
export default function Modal({ open, title, onClose, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="modal fixed inset-0 m-auto"
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current.close()}
    >
      {open && (
        <div className="p-5 sm:p-6">
          <h2 id="modal-title" className="mb-4">
            {title}
          </h2>
          {children}
        </div>
      )}
    </dialog>
  )
}
