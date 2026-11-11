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

// In-Flight Request Deduplication map to prevent redundant concurrent fetches
const inFlightRequests = new Map<string, Promise<any>>();

// Safe In-Memory Cache for public, idempotent GET catalog endpoints (60s TTL)
interface CacheEntry {
  data: any;
  timestamp: number;
}
const publicDataCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// List of public endpoints safe for short in-memory client caching
const CACHEABLE_PUBLIC_ENDPOINTS = [
  '/banners',
  '/categories',
  '/collections',
  '/homepage/sections',
  '/products/new-arrivals',
  '/products/best-sellers',
];

function isCacheable(endpoint: string, options: RequestInit): boolean {
  const method = (options.method || 'GET').toUpperCase();
  if (method !== 'GET') return false;
  if (options.cache === 'no-store') return false;

  // Never cache user-specific or dynamic transaction endpoints
  if (
    endpoint.includes('/cart') ||
    endpoint.includes('/checkout') ||
    endpoint.includes('/account') ||
    endpoint.includes('/auth') ||
    endpoint.includes('/orders') ||
    endpoint.includes('/coupons')
  ) {
    return false;
  }

  return CACHEABLE_PUBLIC_ENDPOINTS.some((prefix) => endpoint.startsWith(prefix));
}

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ success: boolean; data: T; message?: string; meta?: any }> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${normalizedEndpoint}`;
  const method = (options.method || 'GET').toUpperCase();

  // 1. Check in-memory cache for safe public GET endpoints
  const cacheKey = `${method}:${normalizedEndpoint}`;
  if (isCacheable(normalizedEndpoint, options)) {
    const cached = publicDataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  // 2. In-flight request deduplication for concurrent identical GET requests
  if (method === 'GET' && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

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

  const executeFetch = async () => {
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

      // Cache successful response if eligible
      if (isCacheable(normalizedEndpoint, options)) {
        publicDataCache.set(cacheKey, { data, timestamp: Date.now() });
      }

      // NestJS TransformInterceptor returns { success: true, data: ... }
      return data;
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        message: error?.message || 'Network connection failed',
      };
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  };

  const requestPromise = executeFetch();
  if (method === 'GET') {
    inFlightRequests.set(cacheKey, requestPromise);
  }

  return requestPromise;
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

