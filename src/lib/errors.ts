// ─── Global Error Handling ───────────────────────────────────────────────────
// Merkezi hata yönetimi. Tüm service ve query hataları buradan geçer.

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.') {
    super(message, 'NETWORK_ERROR', 0)
    this.name = 'NetworkError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Bu işlem için yetkiniz bulunmuyor.') {
    super(message, 'UNAUTHORIZED', 401)
    this.name = 'UnauthorizedError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Kayıt') {
    super(`${resource} bulunamadı.`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 422)
    this.name = 'ValidationError'
  }
}

// Supabase error → AppError dönüşümü
export function parseSupabaseError(error: unknown): AppError {
  if (error instanceof AppError) return error
  
  const e = error as { message?: string; code?: string; status?: number }
  
  if (e?.status === 401 || e?.code === 'PGRST301') {
    return new UnauthorizedError()
  }
  if (e?.status === 404) {
    return new NotFoundError()
  }
  if (e?.message?.includes('network') || e?.message?.includes('fetch')) {
    return new NetworkError()
  }
  
  return new AppError(
    e?.message ?? 'Beklenmeyen bir hata oluştu.',
    e?.code,
    e?.status
  )
}

// React Query için global error handler
export function handleQueryError(error: unknown): string {
  if (error instanceof AppError) return error.message
  if (error instanceof Error) return error.message
  return 'Beklenmeyen bir hata oluştu.'
}
