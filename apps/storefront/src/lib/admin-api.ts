const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function fetchAdminApi<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ success: boolean; data: T; message?: string; meta?: any }> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('rf_admin_token') : null;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
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

    return data;
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      message: error?.message || 'Network connection failed',
    };
  }
}

export async function uploadMedia(file: File, folder = 'rangoli-fashions'): Promise<{ url: string; publicId: string } | null> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetchAdminApi<{ url: string; publicId: string }>('/upload', {
    method: 'POST',
    body: formData,
  });

  if (res.success && res.data) {
    return res.data;
  }

  const isAuthError =
    res.message?.toLowerCase().includes('authentication') ||
    res.message?.toLowerCase().includes('unauthorized') ||
    res.message?.includes('401');

  if (isAuthError) {
    alert('Your admin session has expired. Please sign in to the Admin Console to upload images.');
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    return null;
  }

  alert(res.message || 'Image upload failed');
  return null;
}

