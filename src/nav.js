export const NAV = [
  { href: '#/', path: '/', label: 'Beranda' },
  { href: '#/tugas', path: '/tugas', label: 'Tugas' },
  { href: '#/agenda', path: '/agenda', label: 'Agenda' },
  { href: '#/profil', path: '/profil', label: 'Profil' },
]

export function sectionOf(route) {
  if (route === '/') return '/'
  const match = NAV.find((n) => n.path !== '/' && (route === n.path || route.startsWith(`${n.path}/`)))
  return match?.path ?? null
}
