
// Este es un diccionario que mapea los errores técnicos de la API (en inglés)
// a mensajes más amigables y en español para mostrar al usuario.
const errorMessages: { [key: string]: string } = {
  // --- Errores de Login y Registro ---
  'Invalid identifier or password': 'El email o la contraseña son incorrectos.',
  'Email or Username are already taken': 'El email o el nombre de usuario ya están en uso.',
  'This attribute must be unique': 'Este valor ya existe. Por favor, elige otro.',
  
  // --- Errores de Cambio de Contraseña ---
  'The provided current password is invalid': 'La contraseña actual es incorrecta.',
  'New password and confirmation do not match': 'La nueva contraseña y su confirmación no coinciden.',

  // --- Errores de Validación (Formularios) ---
  'password must be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  'email must be a valid email': 'El formato del email no es válido.',
  'username must be at least 3 characters': 'El nombre de usuario debe tener al menos 3 caracteres.',
  
  // --- Errores Generales de la API ---
  'Your account has been blocked by an administrator.': 'Tu cuenta ha sido bloqueada por un administrador.',
  'Forbidden': 'No tienes permiso para realizar esta acción.',
  'Not Found': 'El recurso solicitado no fue encontrado.',
};


export const translateError = (message: string): string => {
  if (errorMessages[message]) {
    return errorMessages[message];
  }

  for (const key in errorMessages) {
    if (message.includes(key)) {
      return errorMessages[key];
    }
  }

  return message;
};