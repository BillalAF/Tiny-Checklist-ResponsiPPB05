import { useEffect, useState } from 'react'
import { readText, writeText } from '../utils/storage.js'

const KEY = 'tenggat:theme'
const MODES = ['system', 'light', 'dark']

function applyTheme(mode) {
  const root = document.documentElement
  if (mode === 'system') delete root.dataset.theme
  else root.dataset.theme = mode
  const paper = getComputedStyle(root).getPropertyValue('--paper').trim()
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', paper)
}

export function useTheme() {
  const [mode, setMode] = useState(() => {
    const saved = readText(KEY)
    return MODES.includes(saved) ? saved : 'system'
  })

  useEffect(() => {
    applyTheme(mode)
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => mode === 'system' && applyTheme('system')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [mode])

  const choose = (next) => {
    writeText(KEY, next)
    setMode(next)
  }

  return { mode, choose }
}
