import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { isUrl, parsePaymentData } from '../App';

const ScanResult = ({ scannedData }) => {
  if (!scannedData) return null;

  const paymentInfo = parsePaymentData(scannedData.data);
  const isLink = isUrl(scannedData.data);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(scannedData.data);
    Alert.alert('Copiado', '¡El resultado se ha copiado al portapapeles!');
  };

  const openLink = async () => {
    try {
      const canOpen = await Linking.canOpenURL(scannedData.data);
      if (canOpen) {
        await Linking.openURL(scannedData.data);
      } else {
        Alert.alert('Error', 'No se puede abrir este enlace');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir el enlace');
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Último Resultado</Text>
      
      {paymentInfo ? (
        <View style={styles.parsedContainer}>
          {paymentInfo.isValid ? (
            <>
              <Text style={styles.parsedTitle}>✅ Formato de Pago Válido</Text>
              <Text style={styles.resultText}><Text style={styles.bold}>ID:</Text> {paymentInfo.id}</Text>
              <Text style={styles.resultText}><Text style={styles.bold}>Monto:</Text> ${paymentInfo.amount.toFixed(2)} {paymentInfo.currency}</Text>
              <Text style={styles.validText}>Formato de pago verificado correctamente</Text>
            </>
          ) : (
            <>
              <Text style={styles.errorTitle}>❌ Error en Formato de Pago</Text>
              <Text style={styles.resultText}>{scannedData.data}</Text>
              <Text style={styles.errorText}>{paymentInfo.error}</Text>
            </>
          )}
        </View>
      ) : (
        <Text style={styles.resultText}>{scannedData.data}</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
          <Text style={styles.actionButtonText}>Copiar</Text>
        </TouchableOpacity>

        {isLink && (
          <TouchableOpacity style={[styles.actionButton, styles.linkButton]} onPress={openLink}>
            <Text style={styles.actionButtonText}>Abrir Enlace</Text>
          </TouchableOpacity>
        )}
      </View>
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
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 15,
  },
  actionButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  linkButton: {
    backgroundColor: '#00A8E8',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  parsedContainer: {
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
  },
  parsedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 10,
  },
  validText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 5,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 5,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ScanResult;