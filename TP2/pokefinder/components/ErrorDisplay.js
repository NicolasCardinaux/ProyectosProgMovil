import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>😥</Text>
      <Text style={styles.message}>¡Ups! Algo salió mal</Text>
      <Text style={styles.details}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryText}>Tira para refrescar e intentar de nuevo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1A1A1A',
  },
  icon: {
    fontSize: 60,
    marginBottom: 20,
  },
  message: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EFEFEF',
    textAlign: 'center',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#FFCB05',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  retryText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorDisplay;
