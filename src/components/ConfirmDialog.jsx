import Modal from './Modal.jsx'

export default function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="muted">{message}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" className="btn" onClick={onCancel}>
          Batal
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
