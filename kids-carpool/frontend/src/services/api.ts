import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth APIs
export const authAPI = {
  register: async (data: { email: string; password: string; full_name: string; phone: string }) => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await axios.post(`${API_URL}/auth/login`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },

  getMe: async () => {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

// Children APIs
export const childrenAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/children`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  create: async (data: any) => {
    const response = await axios.post(`${API_URL}/children`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${API_URL}/children/${id}`, {
      headers: getAuthHeader()
    });
  }
};

// Schools APIs
export const schoolsAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/schools`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axios.get(`${API_URL}/schools/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await axios.post(`${API_URL}/schools`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

// Rides APIs
export const ridesAPI = {
  getAll: async (params?: { school_id?: number; status?: string }) => {
    const response = await axios.get(`${API_URL}/rides`, {
      params,
      headers: getAuthHeader()
    });
    return response.data;
  },

  getMyRides: async () => {
    const response = await axios.get(`${API_URL}/rides/my-rides`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axios.get(`${API_URL}/rides/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  create: async (data: any) => {
    const response = await axios.post(`${API_URL}/rides`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${API_URL}/rides/${id}`, {
      headers: getAuthHeader()
    });
  }
};

// Ride Requests APIs
export const rideRequestsAPI = {
  create: async (data: any) => {
    const response = await axios.post(`${API_URL}/ride-requests`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getMyRequests: async () => {
    const response = await axios.get(`${API_URL}/ride-requests/my-requests`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getRideRequests: async (rideId: number) => {
    const response = await axios.get(`${API_URL}/rides/${rideId}/requests`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  accept: async (requestId: number) => {
    const response = await axios.put(`${API_URL}/ride-requests/${requestId}/accept`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

// Messages APIs
export const messagesAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/messages`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  send: async (data: { receiver_id: number; content: string }) => {
    const response = await axios.post(`${API_URL}/messages`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};
