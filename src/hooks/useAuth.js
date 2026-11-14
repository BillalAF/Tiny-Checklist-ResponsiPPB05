import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export function useAuth() {
  const [state, setState] = useState({ session: null, loading: supabase !== null })

  useEffect(() => {
    if (!supabase) return
    // Sesi dibaca dari penyimpanan peramban, jadi tetap terbaca saat offline.
    supabase.auth.getSession().then(({ data }) => setState({ session: data.session, loading: false }))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setState({ session, loading: false }))
    return () => subscription.unsubscribe()
  }, [])

  return {
    session: state.session,
    loading: state.loading,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signOut: () => supabase.auth.signOut(),
  }
}
