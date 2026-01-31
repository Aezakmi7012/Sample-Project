const API_URL = 'http://localhost:5000/api';

const request = async (url, options = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const authAPI = {
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  logout: () => request('/auth/logout', {
    method: 'POST',
  }),
};

export const postAPI = {
  getAll: () => request('/posts'),

  getById: (id) => request(`/posts/${id}`),

  create: (postData) => request('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  }),

  update: (id, postData) => request(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(postData),
  }),

  delete: (id) => request(`/posts/${id}`, {
    method: 'DELETE',
  }),
};
