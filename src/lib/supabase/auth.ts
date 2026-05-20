import { createClient } from './server'
import { UnauthorizedError } from '../errors'
import type { User, UserRole } from '@/types'

/**
 * Mevcut oturum açmış kullanıcıyı (ve public.users tablosundaki detaylarını) döndürür.
 * Oturum yoksa null döner.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) return null

  const { data: dbUser, error: dbError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (dbError || !dbUser) return null

  return dbUser as User
}

/**
 * Sadece giriş yapmış kullanıcıların erişebilmesini sağlar.
 * Rol kontrolü yapmak için 'allowedRoles' parametresi geçirilebilir.
 * İzin yoksa UnauthorizedError fırlatır (bu hata middleware veya error boundary tarafından yakalanıp yönetilir).
 */
export async function requireAuth(allowedRoles?: UserRole[]): Promise<User> {
  const user = await getCurrentUser()

  if (!user) {
    throw new UnauthorizedError('Bu işlem için giriş yapmanız gerekmektedir.')
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    throw new UnauthorizedError('Bu işlem için yetkiniz bulunmamaktadır.')
  }

  return user
}
