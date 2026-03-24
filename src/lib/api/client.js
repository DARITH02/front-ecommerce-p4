const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchApi(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMsg = `API Error: ${response.status} ${response.statusText}`;
    try {
      const data = await response.json();
      errorMsg = data.message || data.error || errorMsg;
      if (data.errors) {
        errorMsg = Object.values(data.errors).flat().join(', ');
      }
    } catch (e) {
      // Not JSON
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  products: {
    getAll: (params = '') => fetchApi(`/api/products${params}`),
    getBySlug: (slug) => fetchApi(`/api/products/${slug}`),
    getFeatured: () => fetchApi('/api/products/featured'),
    getLatest: () => fetchApi('/api/products/latest'),
  },
  categories: {
    getAll: () => fetchApi('/api/categories'),
    getBySlug: (slug) => fetchApi(`/api/categories/${slug}`),
  },
  auth: {
    register: (data) => fetchApi('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    login: (credentials) => fetchApi('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    logout: (token) => fetchApi('/api/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }),
    getUser: (token) => fetchApi('/api/user', {
      headers: { Authorization: `Bearer ${token}` },
    }),
    updateProfile: (data, token) => fetchApi('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    }),
  },
  orders: {
    getAll: (token) => fetchApi('/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    }),
    getOne: (orderNumber, token) => fetchApi(`/api/orders/${orderNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    checkout: (data, token) => fetchApi('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  },
  system: {
    getStatus: () => fetchApi('/api/status'),
    getCart: (token) => fetchApi('/api/cart', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  },
};
