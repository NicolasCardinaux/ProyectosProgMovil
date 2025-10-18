import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

interface ErrorAlertProps {
  message: string;
  onClose: () => void;
}

// Componente reutilizable para mostrar alertas de error de forma consistente.
export default function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity
        onPress={onClose}
        style={styles.closeButton}
        accessible={true}
        accessibilityLabel="Cerrar alerta de error"
        accessibilityRole="button"
      >
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.error,
    padding: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 12,
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Colors.error}80`,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    maxWidth: '95%',
    alignSelf: 'center',
  },
  message: {
    color: Colors.card,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: `${Colors.card}10`,
  },
  closeButtonText: {
    color: Colors.card,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'center',
  },
});