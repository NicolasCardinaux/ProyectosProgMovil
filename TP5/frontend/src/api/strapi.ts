import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
import { Product, Category, Brand, Order, User, AuthResponse, ApiResponse } from '../types';
import { useAuthStore } from '../hooks/useAuthStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:1337';

// Configuración base de axios para comunicación con API Strapi
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: params => qs.stringify(params, { encodeValuesOnly: true }),
});

// Interceptor para agregar token JWT a todas las requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error al obtener el token:', error);
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const { user, logout } = useAuthStore.getState();
      if (user) {
        console.warn('Token inválido o expirado. Cerrando sesión automáticamente.');
        logout();
      }
    }
    return Promise.reject(error);
  }
);

// Objeto principal con todas las funciones de la API
export const strapi = {

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/local', { identifier: email, password });
    return response.data;
  },

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/local/register', { username, email, password });
    return response.data;
  },


  async changePassword(data: { currentPassword: string, password: string, passwordConfirmation: string }): Promise<void> {
    await api.post('/api/auth/change-password', data);
  },

  // --- Gestión de productos favoritos del usuario ---
  async getFavorites(): Promise<ApiResponse<Product[]>> {
    const response = await api.get('/api/users/me', {
      params: {
        populate: {
          favorites: {
            populate: '*',
          },
        },
      },
    });
    return { data: response.data.favorites || [] };
  },


  async addToFavorites(productId: number): Promise<void> {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) throw new Error('Usuario no autenticado.');
    
    const response = await api.get(`/api/users/me?fields[0]=id&populate[favorites][fields][0]=id`);
    const currentFavoriteIds = response.data.favorites.map((p: { id: number }) => p.id);
    
    const newFavoriteIds = Array.from(new Set([...currentFavoriteIds, productId]));

    await api.put(`/api/users/${userId}`, { favorites: newFavoriteIds });
  },


  async removeFromFavorites(productId: number): Promise<void> {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) throw new Error('Usuario no autenticado.');
    
    const response = await api.get(`/api/users/me?fields[0]=id&populate[favorites][fields][0]=id`);
    const currentFavoriteIds = response.data.favorites.map((p: { id: number }) => p.id);

    const newFavoriteIds = currentFavoriteIds.filter((id: number) => id !== productId);

    await api.put(`/api/users/${userId}`, { favorites: newFavoriteIds });
  },


  async getMe(): Promise<User> {
    const response = await api.get('/api/users/me', { params: { populate: '*' } });
    return response.data;
  },


  async updateUser(userId: number, data: { username?: string; email?: string }): Promise<User> {
    const response = await api.put(`/api/users/${userId}`, data);
    return response.data;
  },

  // --- Catálogo de productos con filtros y paginación ---
  async getProducts(params?: any): Promise<ApiResponse<Product[]>> {
    const queryParams = {
      ...params,
      populate: ['images', 'category', 'brand']
    };
    const response = await api.get('/api/products', { 
      params: queryParams 
    });
    return response.data;
  },


  async getProduct(id: number): Promise<ApiResponse<Product>> {
    const response = await api.get(`/api/products/${id}`, { 
      params: { 
        populate: ['images', 'category', 'brand'] 
      } 
    });
    return response.data;
  },
  

  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await api.get('/api/categories', { params: { populate: '*' } });
    return response.data;
  },

  async getBrands(): Promise<ApiResponse<Brand[]>> {
    const response = await api.get('/api/brands', { params: { populate: ['logo'] } });
    return response.data;
  },


  async createOrder(orderData: any): Promise<ApiResponse<Order>> {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  async getOrders(): Promise<ApiResponse<Order[]>> {
    const response = await api.get('/api/orders', { 
      params: { 
        sort: 'createdAt:desc', 
        populate: '*' 
      } 
    });
    return response.data;
  },
};

export default api;