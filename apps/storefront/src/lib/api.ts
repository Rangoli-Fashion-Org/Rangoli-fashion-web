const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('rf_token');
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('rf_token', token);
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('rf_token');
}

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ success: boolean; data: T; message?: string; meta?: any }> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Dual auth: Attach Bearer token header if available to ensure requests never fail if cookies are blocked
  if (!headers.has('Authorization')) {
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // NestJS can return message as an array of validation strings
      const errorMsg = Array.isArray(data?.message)
        ? data.message.join('. ')
        : data?.message || `Request failed with status ${res.status}`;

      return {
        success: false,
        data: null as any,
        message: errorMsg,
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

