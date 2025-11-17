import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Criar cliente apenas se as variáveis existirem
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Tipos do banco de dados
export interface User {
  id: string
  email: string
  name: string
  password_hash: string
  plan_type: 'basic' | 'premium'
  weight?: number
  height?: number
  target_weight?: number
  current_medication?: string
  current_dosage?: string
  start_date?: string
  created_at: string
  updated_at: string
}

export interface WeightHistory {
  id: string
  user_id: string
  weight: number
  date: string
  created_at: string
}

export interface PasswordReset {
  id: string
  user_id: string
  token: string
  expires_at: string
  used: boolean
  created_at: string
}
