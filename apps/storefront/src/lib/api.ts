const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ success: boolean; data: T; message?: string; meta?: any }> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        data: null as any,
        message: data?.message || `Request failed with status ${res.status}`,
      };
    }

    // NestJS TransformInterceptor returns { success: true, data: ... }
    return data;
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error?.message || 'Network connection failed',
    };
  }
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem('rf_session_id');
  if (!sessionId) {
    sessionId = `sess_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
    localStorage.setItem('rf_session_id', sessionId);
  }
  return sessionId;
}
