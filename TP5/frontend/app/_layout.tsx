import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import Colors from '../src/constants/Colors';


const queryClient = new QueryClient();

// Componente raíz de la aplicación. Aquí se definen los proveedores globales y la estructura de navegación principal.
export default function RootLayout() {
  return (

    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      
      {}
      <Stack screenOptions={{ headerShown: false }}>
        
        {}
        <Stack.Screen name="(tabs)" />
        
        {}
        <Stack.Screen 
          name="auth" 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
        
        {}
        <Stack.Screen 
          name="product/[id]" 
          options={{ 
            presentation: 'card',
            headerShown: true,
            title: 'Detalle del Producto',
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.card,
            headerTitleStyle: { fontWeight: 'bold' },
          }} 
        />
        
        <Stack.Screen
          name="settings" 
          options={{
            title: 'Configuración de Perfil',
            headerShown: true,
            presentation: 'card',
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.card,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <Stack.Screen
          name="checkout" 
          options={{
            title: 'Finalizar Compra',
            headerShown: true,
            presentation: 'card',
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.card,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

      </Stack>
    </QueryClientProvider>
  );
}