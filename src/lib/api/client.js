const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://e-commence-p4.onrender.com';

export async function fetchApi(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
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
};
