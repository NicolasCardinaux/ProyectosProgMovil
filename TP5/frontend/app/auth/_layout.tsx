import { Stack } from 'expo-router';

// Define el grupo de navegación para el flujo de autenticación.
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        presentation: 'modal',
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Iniciar Sesión',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Crear Cuenta',
        }}
      />
    </Stack>
  );
}