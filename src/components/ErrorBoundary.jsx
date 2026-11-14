import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="mx-auto max-w-xl p-6">
        <h1>Aplikasi mengalami kesalahan</h1>
        <p className="muted mt-3">Data tugas Anda tidak dihapus. Muat ulang halaman untuk mencoba lagi.</p>
        <button type="button" className="btn btn-primary mt-5" onClick={() => window.location.reload()}>
          Muat ulang halaman
        </button>
      </main>
    )
  }
}
