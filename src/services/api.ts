const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const responseText = await response.text();
  console.log('📡 Raw response:', responseText.substring(0, 200));
  
  if (!response.ok) {
    let error;
    try {
      error = JSON.parse(responseText);
    } catch {
      error = { error: 'Request failed', status: response.status };
    }
    console.error('❌ API Error:', error);
    throw new Error(error.error || error.message || `Request failed with status ${response.status}`);
  }
  
  try {
    return JSON.parse(responseText);
  } catch (e) {
    console.error('❌ Failed to parse JSON:', e);
    throw new Error('Invalid JSON response from server');
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (filters?: { year?: string; month?: string; managerId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.year && filters.year !== 'all') params.append('year', filters.year);
    if (filters?.month && filters.month !== 'all') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = monthNames.indexOf(filters.month) + 1;
      if (monthIndex > 0) params.append('month', monthIndex.toString());
    }
    if (filters?.managerId) params.append('managerId', filters.managerId);

    const response = await fetch(`${API_BASE_URL}/import/dashboard-stats?${params}`);
    return handleResponse(response);
  },
};

// Import API
export const importAPI = {
  uploadTourFiles: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/import/tourfiles`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  uploadHotels: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/import/hotels`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  uploadGuides: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/import/guides`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  getTourFiles: async (filters?: { year?: string; month?: string; managerId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year);
    if (filters?.month) params.append('month', filters.month);
    if (filters?.managerId) params.append('managerId', filters.managerId);

    const response = await fetch(`${API_BASE_URL}/import/tourfiles?${params}`);
    return handleResponse(response);
  },

  getTourFileById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/tourfiles/${id}`);
    return handleResponse(response);
  },

  updateTourFile: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/tourfiles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getHotels: async () => {
    const response = await fetch(`${API_BASE_URL}/import/hotels`);
    return handleResponse(response);
  },

  getGuides: async () => {
    const response = await fetch(`${API_BASE_URL}/import/guides`);
    return handleResponse(response);
  },
};

// Tour Files API (separate from imports - for manual tour files)
export const tourFileAPI = {
  getAll: async (filters?: { status?: string; managerId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.managerId) params.append('managerId', filters.managerId);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tourfiles?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const token = localStorage.getItem('token');
    console.log('🔐 Token exists:', !!token);
    console.log('🌐 Fetching tour file:', id);
    console.log('🌐 Full URL:', `${API_BASE_URL}/tourfiles/${id}`);
    
    const response = await fetch(`${API_BASE_URL}/tourfiles/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    return handleResponse(response);
  },

  create: async (data: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tourfiles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id: string, data: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tourfiles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tourfiles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (name: string, email: string, password: string, role: string = 'MANAGER') => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    return handleResponse(response);
  },
};

// Customers API
export const customersAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/customers`);
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`);
    return handleResponse(response);
  },

  create: async (customer: any) => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    return handleResponse(response);
  },

  update: async (id: string, customer: any) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    return handleResponse(response);
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
    return handleResponse(response);
  },

  create: async (booking: any) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    return handleResponse(response);
  },
};

export default {
  dashboard: dashboardAPI,
  import: importAPI,
  auth: authAPI,
  customers: customersAPI,
  bookings: bookingsAPI,
  tourFile: tourFileAPI,
};
