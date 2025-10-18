import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import Colors from '../../src/constants/Colors';
import ErrorAlert from '../../src/components/ErrorAlert';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Pantalla de Registro. Al igual que el Login, usa `react-hook-form` para gestionar el formulario y validar todos los campos requeridos.
export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const { control, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);


  const password = watch('password');


  const onSubmit = async (data: RegisterForm) => {
    setErrorMessage(null);
    try {
      await register(data.username, data.email, data.password);
      router.back();
    } catch (error: any) {
      setErrorMessage(error.message || 'No se pudo completar el registro');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.form}>
          {errorMessage && (
            <ErrorAlert
              message={errorMessage}
              onClose={() => setErrorMessage(null)}
            />
          )}

          <Controller
            control={control}
            name="username"
            rules={{
              required: 'El nombre de usuario es requerido',
              minLength: { value: 3, message: 'El usuario debe tener al menos 3 caracteres' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre de Usuario</Text>
                <TextInput
                  style={[styles.input, errors.username && styles.inputError]}
                  placeholder="juanperez"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholderTextColor={Colors.textSecondary}
                />
                {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'El email es requerido',
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email inválido' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholderTextColor={Colors.textSecondary}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'La contraseña es requerida',
              minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={[styles.passwordInputWrapper, errors.password && styles.inputError]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="••••••"
                    secureTextEntry={!isPasswordVisible}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={Colors.textSecondary}
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(prev => !prev)} style={styles.eyeIcon}>
                    <Ionicons name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={24} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
              </View>
            )}
          />

          {}
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Confirma tu contraseña',
              validate: (value) => value === password || 'Las contraseñas no coinciden',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Contraseña</Text>
                <View style={[styles.passwordInputWrapper, errors.confirmPassword && styles.inputError]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="••••••"
                    secureTextEntry={!isConfirmPasswordVisible}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={Colors.textSecondary}
                  />
                  <TouchableOpacity onPress={() => setConfirmPasswordVisible(prev => !prev)} style={styles.eyeIcon}>
                    <Ionicons name={isConfirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={24} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
              </View>
            )}
          />

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.card} />
            ) : (
              <Text style={styles.registerButtonText}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta? <Text style={styles.loginTextBold}>Inicia Sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  form: {
    backgroundColor: Colors.card,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  eyeIcon: {
    padding: 12,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.textSecondary,
  },
  registerButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  loginTextBold: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});