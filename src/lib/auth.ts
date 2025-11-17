import { supabase } from './supabase'
import type { User } from './supabase'

// Hash simples para senha (em produção, use bcrypt no backend)
function hashPassword(password: string): string {
  // Nota: Esta é uma implementação simplificada
  // Em produção, use bcrypt ou similar no backend
  return btoa(password)
}

function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  planType: 'basic' | 'premium'
): Promise<{ success: boolean; user?: User; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Serviço temporariamente indisponível' }
  }

  try {
    // Verificar se email já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (existingUser) {
      return { success: false, error: 'Este email já está cadastrado' }
    }

    // Criar novo usuário
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        name,
        password_hash: hashPassword(password),
        plan_type: planType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: 'Erro ao criar conta. Tente novamente.' }
    }

    return { success: true, user: newUser }
  } catch (error) {
    return { success: false, error: 'Erro ao criar conta. Tente novamente.' }
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Serviço temporariamente indisponível' }
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return { success: false, error: 'Email ou senha incorretos' }
    }

    if (!verifyPassword(password, user.password_hash)) {
      return { success: false, error: 'Email ou senha incorretos' }
    }

    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Erro ao fazer login. Tente novamente.' }
  }
}

export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Serviço temporariamente indisponível' }
  }

  try {
    // Verificar se usuário existe
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (!user) {
      // Por segurança, não revelar se email existe ou não
      return { success: true }
    }

    // Gerar token único
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Expira em 1 hora

    // Salvar token no banco
    await supabase
      .from('password_resets')
      .insert({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
        used: false,
        created_at: new Date().toISOString()
      })

    // TODO: Enviar email com link de recuperação
    // Link seria: /auth/reset-password?token=${token}
    console.log('Token de recuperação:', token)

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro ao solicitar recuperação. Tente novamente.' }
  }
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Serviço temporariamente indisponível' }
  }

  try {
    // Buscar token válido
    const { data: resetToken } = await supabase
      .from('password_resets')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (!resetToken) {
      return { success: false, error: 'Token inválido ou expirado' }
    }

    // Verificar se token expirou
    if (new Date(resetToken.expires_at) < new Date()) {
      return { success: false, error: 'Token expirado' }
    }

    // Atualizar senha
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: hashPassword(newPassword),
        updated_at: new Date().toISOString()
      })
      .eq('id', resetToken.user_id)

    if (updateError) {
      return { success: false, error: 'Erro ao atualizar senha' }
    }

    // Marcar token como usado
    await supabase
      .from('password_resets')
      .update({ used: true })
      .eq('id', resetToken.id)

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro ao redefinir senha. Tente novamente.' }
  }
}

export async function updateUserWeight(
  userId: string,
  weight: number
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Serviço temporariamente indisponível' }
  }

  try {
    // Atualizar peso do usuário
    await supabase
      .from('users')
      .update({
        weight,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    // Adicionar ao histórico
    await supabase
      .from('weight_history')
      .insert({
        user_id: userId,
        weight,
        date: new Date().toISOString(),
        created_at: new Date().toISOString()
      })

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro ao atualizar peso' }
  }
}

export async function getUserWeightHistory(
  userId: string
): Promise<Array<{ date: string; weight: number }>> {
  if (!supabase) {
    return []
  }

  try {
    const { data } = await supabase
      .from('weight_history')
      .select('date, weight')
      .eq('user_id', userId)
      .order('date', { ascending: true })

    return data || []
  } catch (error) {
    return []
  }
}
