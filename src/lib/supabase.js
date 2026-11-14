import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Tanpa kedua variabel ini aplikasi tetap jalan, hanya menyimpan data di perangkat.
export const supabase = url && key ? createClient(url, key) : null
export const isConfigured = supabase !== null

// Isi VITE_REQUIRE_LOGIN=false jika di SQL dipakai opsi B (tanpa login).
export const requireLogin = import.meta.env.VITE_REQUIRE_LOGIN !== 'false'
