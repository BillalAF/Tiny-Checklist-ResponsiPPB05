import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { readJSON, writeJSON } from '../utils/storage.js'
import { newId, sanitizeState } from '../utils/tasks.js'
import { explainError, fromRow, mergeRemote, toRow } from '../utils/sync.js'

const RETRY_MS = 30_000

function load(storageKey) {
  const { value, error } = readJSON(storageKey, null)
  return { state: sanitizeState(value), error }
}

const stamp = () => new Date().toISOString()

// Alur offline-first: UI selalu membaca dan menulis ke penyimpanan lokal.
// Perubahan ditandai dirty, lalu dikirim ke Supabase kapan pun internet tersedia.
export function useTasks({ storageKey, canSync, online }) {
  const [initial] = useState(() => load(storageKey))
  const [state, setState] = useState(initial.state)
  const [error, setError] = useState(initial.error)
  const [syncInfo, setSyncInfo] = useState({ status: 'idle', error: null, lastSyncedAt: null })
  const stateRef = useRef(initial.state)
  const syncingRef = useRef(false)
  const rerunRef = useRef(false)

  const update = useCallback(
    (fn) => {
      const next = fn(stateRef.current)
      stateRef.current = next
      setState(next)
      setError(writeJSON(storageKey, next))
    },
    [storageKey],
  )

  const syncOnce = useCallback(async () => {
    const { tasks, deletedIds } = stateRef.current
    const dirty = tasks.filter((t) => t.dirty)
    const stamps = new Map(dirty.map((t) => [t.id, t.updatedAt]))

    if (dirty.length > 0) {
      const { error: pushError } = await supabase.from('tasks').upsert(dirty.map(toRow))
      if (pushError) throw pushError
    }
    if (deletedIds.length > 0) {
      const { error: deleteError } = await supabase.from('tasks').delete().in('id', deletedIds)
      if (deleteError) throw deleteError
    }
    const { data, error: pullError } = await supabase.from('tasks').select('*')
    if (pullError) throw pullError

    // Ambil keadaan terbaru: pengguna mungkin mengubah data selama permintaan berjalan.
    update((prev) => {
      const remainingDeleted = prev.deletedIds.filter((id) => !deletedIds.includes(id))
      const cleaned = prev.tasks.map((t) =>
        t.dirty && stamps.get(t.id) === t.updatedAt ? { ...t, dirty: false } : t,
      )
      return { tasks: mergeRemote(cleaned, remainingDeleted, (data ?? []).map(fromRow)), deletedIds: remainingDeleted }
    })
  }, [update])

  const sync = useCallback(async () => {
    if (!canSync || !supabase || !navigator.onLine) return
    if (syncingRef.current) {
      rerunRef.current = true
      return
    }
    syncingRef.current = true
    setSyncInfo((s) => ({ ...s, status: 'syncing' }))
    try {
      do {
        rerunRef.current = false
        await syncOnce()
      } while (rerunRef.current)
      setSyncInfo({ status: 'idle', error: null, lastSyncedAt: stamp() })
    } catch (e) {
      setSyncInfo((s) => ({ ...s, status: 'error', error: explainError(e) }))
    } finally {
      syncingRef.current = false
    }
  }, [canSync, syncOnce])

  const pending = state.tasks.filter((t) => t.dirty).length + state.deletedIds.length

  useEffect(() => {
    if (!online) return
    const timer = setTimeout(sync, 0)
    return () => clearTimeout(timer)
  }, [online, sync])

  useEffect(() => {
    if (!canSync || !online || pending === 0) return
    const timer = setInterval(sync, RETRY_MS)
    return () => clearInterval(timer)
  }, [canSync, online, pending, sync])

  const mutate = (fn) => {
    update(fn)
    sync()
  }

  const addTask = (input) =>
    mutate((s) => ({ ...s, tasks: [...s.tasks, { ...input, id: newId(), done: false, dirty: true, updatedAt: stamp() }] }))

  const updateTask = (id, input) =>
    mutate((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...input, dirty: true, updatedAt: stamp() } : t)),
    }))

  const toggleTask = (id) =>
    mutate((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done, dirty: true, updatedAt: stamp() } : t)),
    }))

  const deleteTask = (id) =>
    mutate((s) => ({
      tasks: s.tasks.filter((t) => t.id !== id),
      deletedIds: [...new Set([...s.deletedIds, id])],
    }))

  const clearTasks = () =>
    mutate((s) => ({ tasks: [], deletedIds: [...new Set([...s.deletedIds, ...s.tasks.map((t) => t.id)])] }))

  const retryLoad = () => {
    const reloaded = load(storageKey)
    stateRef.current = reloaded.state
    setState(reloaded.state)
    setError(reloaded.error)
  }

  return {
    tasks: state.tasks,
    error,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearTasks,
    retryLoad,
    sync: { ...syncInfo, canSync, pending, syncNow: sync },
  }
}
