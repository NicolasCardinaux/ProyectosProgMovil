import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../src/hooks/useAuthStore';
import { strapi } from '../src/api/strapi';
import Colors from '../src/constants/Colors';
import { translateError } from '../src/utils/errorTranslator';

// Tipos para cada formulario
interface ProfileForm {
  username: string;
  email: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, updateUserInStore, logout } = useAuthStore();
  
  const [isProfileLoading, setProfileLoading] = useState(false);
  const [isPasswordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [isCurrentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Formulario para Perfil
  const { control: profileControl, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm<ProfileForm>({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  // Formulario para Contraseña
  const { control: passwordControl, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, watch, reset: resetPasswordForm } = useForm<PasswordForm>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data: ProfileForm) => {
    if (!user) return;
    setProfileLoading(true);
    setProfileError(null);

    try {
      const updatedUser = await strapi.updateUser(user.id, data);
      updateUserInStore(updatedUser);
      Alert.alert('Éxito', 'Tu perfil ha sido actualizado.');
    } catch (error: any) {
      const message = translateError(error.response?.data?.error?.message || 'No se pudo actualizar el perfil.');
      setProfileError(message);
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setPasswordLoading(true);
    setPasswordError(null);

    try {
      await strapi.changePassword({
        currentPassword: data.currentPassword,
        password: data.newPassword,
        passwordConfirmation: data.confirmPassword,
      });

      Alert.alert('Éxito', 'Tu contraseña ha sido cambiada. Por favor, inicia sesión de nuevo.', [
        { text: 'OK', onPress: () => {
            logout();
            router.replace('/(tabs)');
        }},
      ]);
      resetPasswordForm();
    } catch (error: any) {
      const message = translateError(error.response?.data?.error?.message || 'No se pudo cambiar la contraseña.');
      setPasswordError(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {}
        <View style={styles.formSection}>
          <Text style={styles.title}>Información del Perfil</Text>
          {profileError && <Text style={styles.apiErrorText}>{profileError}</Text>}
          
          <Controller
            control={profileControl}
            name="username"
            rules={{ required: 'El nombre de usuario es requerido' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre de Usuario</Text>
                <TextInput style={[styles.input, profileErrors.username && styles.inputError]} onBlur={onBlur} onChangeText={onChange} value={value} autoCapitalize="none" />
                {profileErrors.username && <Text style={styles.errorText}>{profileErrors.username.message}</Text>}
              </View>
            )}
          />
          
          <Controller
            control={profileControl}
            name="email"
            rules={{ required: 'El email es requerido', pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' }}}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={[styles.input, profileErrors.email && styles.inputError]} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="email-address" autoCapitalize="none" />
                {profileErrors.email && <Text style={styles.errorText}>{profileErrors.email.message}</Text>}
              </View>
            )}
          />
          
          <TouchableOpacity style={[styles.button, isProfileLoading && styles.buttonDisabled]} onPress={handleProfileSubmit(onProfileSubmit)} disabled={isProfileLoading}>
            {isProfileLoading ? <ActivityIndicator color={Colors.card} /> : <Text style={styles.buttonText}>Guardar Perfil</Text>}
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.formSection}>
          <Text style={styles.title}>Cambiar Contraseña</Text>
          {passwordError && <Text style={styles.apiErrorText}>{passwordError}</Text>}

          <Controller
            control={passwordControl}
            name="currentPassword"
            rules={{ required: 'La contraseña actual es requerida' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña Actual</Text>
                <View style={[styles.passwordInputWrapper, passwordErrors.currentPassword && styles.inputError]}>
                  <TextInput style={styles.passwordInput} onBlur={onBlur} onChangeText={onChange} value={value} secureTextEntry={!isCurrentPasswordVisible} />
                  <TouchableOpacity onPress={() => setCurrentPasswordVisible(prev => !prev)} style={styles.eyeIcon}>
                    {}
                    <Ionicons name={isCurrentPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={24} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                {passwordErrors.currentPassword && <Text style={styles.errorText}>{passwordErrors.currentPassword.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={passwordControl}
            name="newPassword"
            rules={{ required: 'La nueva contraseña es requerida', minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nueva Contraseña</Text>
                <View style={[styles.passwordInputWrapper, passwordErrors.newPassword && styles.inputError]}>
                  <TextInput style={styles.passwordInput} onBlur={onBlur} onChangeText={onChange} value={value} secureTextEntry={!isNewPasswordVisible} />
                  <TouchableOpacity onPress={() => setNewPasswordVisible(prev => !prev)} style={styles.eyeIcon}>
                    {}
                    <Ionicons name={isNewPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={24} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                {passwordErrors.newPassword && <Text style={styles.errorText}>{passwordErrors.newPassword.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={passwordControl}
            name="confirmPassword"
            rules={{ required: 'Confirma tu nueva contraseña', validate: value => value === newPassword || 'Las contraseñas no coinciden' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
                <View style={[styles.passwordInputWrapper, passwordErrors.confirmPassword && styles.inputError]}>
                    <TextInput style={styles.passwordInput} onBlur={onBlur} onChangeText={onChange} value={value} secureTextEntry={!isConfirmPasswordVisible} />
                    <TouchableOpacity onPress={() => setConfirmPasswordVisible(prev => !prev)} style={styles.eyeIcon}>
                        {}
                        <Ionicons name={isConfirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={24} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                {passwordErrors.confirmPassword && <Text style={styles.errorText}>{passwordErrors.confirmPassword.message}</Text>}
              </View>
            )}
          />
          
          <TouchableOpacity style={[styles.button, isPasswordLoading && styles.buttonDisabled]} onPress={handlePasswordSubmit(onPasswordSubmit)} disabled={isPasswordLoading}>
            {isPasswordLoading ? <ActivityIndicator color={Colors.card} /> : <Text style={styles.buttonText}>Cambiar Contraseña</Text>}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  formSection: {
    backgroundColor: Colors.card,
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: Colors.text,
  },
  inputContainer: { marginBottom: 16 },
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
    borderColor: Colors.error 
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  apiErrorText: {
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { backgroundColor: Colors.textSecondary },
  buttonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
