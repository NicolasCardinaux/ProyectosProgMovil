import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { strapi } from '../api/strapi';
import { translateError } from '../utils/errorTranslator';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUserInStore: (user: User) => void;
}

// Este archivo define nuestro `store` de autenticación usando Zustand.
// Es el "cerebro" que maneja el estado global del usuario: si está logueado, quién es, etc.
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Función para iniciar sesión. Llama a la API y, si es exitoso,
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await strapi.login(email, password);
          await AsyncStorage.setItem('jwt', response.jwt);
          set({
            user: response.user,
            token: response.jwt,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false });
          const originalMessage = error.response?.data?.error?.message || 'Error al iniciar sesión';
          const translatedMessage = translateError(originalMessage);
          throw new Error(translatedMessage);
        }
      },
      
      // Función para registrar un nuevo usuario. Llama a la API y, si tiene éxito,
      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await strapi.register(username, email, password);
          await AsyncStorage.setItem('jwt', response.jwt);
          set({
            user: response.user,
            token: response.jwt,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false });
          const originalMessage = error.response?.data?.error?.message || 'Error al registrar usuario';
          const translatedMessage = translateError(originalMessage);
          throw new Error(translatedMessage);
        }
      },
      
      // Limpia los datos del usuario del estado y del almacenamiento del dispositivo para cerrar la sesión.
      logout: () => {
        AsyncStorage.removeItem('jwt');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Actualiza los datos del usuario en el estado (ej: después de editar el perfil)
      updateUserInStore: (updatedUser: User) => {
        set((state) => ({
          user: { ...state.user, ...updatedUser }
        }));
      },
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);