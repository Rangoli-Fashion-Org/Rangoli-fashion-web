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
  alert(res.message || 'Image upload failed');
  return null;
}

