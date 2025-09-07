import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QrGenerator = ({ value, onValueChange }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Generador de QR</Text>
      <View style={styles.qrContainer}>
        <QRCode
          value={value || ' '}
          size={200}
          color="black"
          backgroundColor="white"
        />
      </View>
      <TextInput
        style={styles.input}
        onChangeText={onValueChange}
        value={value}
        placeholder="Ingresa el texto para el QR..."
        placeholderTextColor="#888"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#2f2f2f',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  qrContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    fontSize: 16,
    backgroundColor: '#2C2C2C',
  },
});

export default QrGenerator;