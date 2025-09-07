import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';

// Importar componentes
import QrGenerator from './components/QrGenerator';
import ScanResult from './components/ScanResult';
import ScanHistory from './components/ScanHistory';

const HISTORY_KEY = 'scan_history';
const MAX_HISTORY_ITEMS = 20;

// Monedas válidas para validación
const VALID_CURRENCIES = ['ARS', 'USD', 'EUR', 'BRL', 'CLP', 'MXN', 'COP', 'PEN'];

// Función para verificar si es un enlace válido
export const isUrl = (text) => {
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// Función mejorada para parsear y validar datos de pago
export const parsePaymentData = (data) => {
  if (typeof data !== 'string' || !data.startsWith('PAY:')) {
    return null;
  }
  
  const parts = data.substring(4).split('|');
  if (parts.length !== 3) {
    return null;
  }

  const [id, amount, currency] = parts;
  
  // Validaciones
  if (!id || id.trim() === '') {
    return { isValid: false, error: 'ID no válido' };
  }
  
  // Validar que el monto sea numérico
  const amountNumber = parseFloat(amount);
  if (isNaN(amountNumber) || amountNumber <= 0) {
    return { isValid: false, error: 'Monto no válido' };
  }
  
  // Validar que la moneda sea válida
  if (!VALID_CURRENCIES.includes(currency.toUpperCase())) {
    return { isValid: false, error: `Moneda no válida. Use: ${VALID_CURRENCIES.join(', ')}` };
  }

  return {
    isValid: true,
    id: id.trim(),
    amount: amountNumber,
    currency: currency.toUpperCase(),
    rawAmount: amount
  };
};

// Componente principal
export default function App() {
  const [qrValue, setQrValue] = useState('https://expo.dev');
  const [scannedData, setScannedData] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  // Cargar historial
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(HISTORY_KEY);
        if (storedHistory !== null) {
          setScanHistory(JSON.parse(storedHistory));
        }
      } catch (e) {
        console.error('Failed to load scan history.', e);
      }
    };
    loadHistory();
  }, []);

  const handleShowScanner = async () => {
    setIsRequestingPermission(true);
    
    if (!permission?.granted) {
      const permissionResult = await requestPermission();
      
      if (permissionResult.granted) {
        setScannerVisible(true);
      } else {
        Alert.alert(
          'Permiso denegado',
          'Para escanear códigos QR necesitamos acceso a tu cámara. ¿Quieres abrir la configuración para habilitarlo?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Abrir Configuración', 
              onPress: () => Linking.openSettings() 
            }
          ]
        );
      }
    } else {
      setScannerVisible(true);
    }
    
    setIsRequestingPermission(false);
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScannerVisible(false);
    setScannedData({ type: 'QR_CODE', data });

    // Redirección automática si es un enlace
    if (isUrl(data)) {
      Alert.alert(
        'Enlace detectado',
        '¿Quieres abrir este enlace?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Abrir', 
            onPress: async () => {
              try {
                await Linking.openURL(data);
              } catch (error) {
                Alert.alert('Error', 'No se pudo abrir el enlace');
              }
            }
          }
        ]
      );
    }

    try {
      const newScan = { 
        data, 
        date: new Date().toISOString(),
        type: isUrl(data) ? 'link' : parsePaymentData(data) ? 'payment' : 'text'
      };
      
      const updatedHistory = [newScan, ...scanHistory].slice(0, MAX_HISTORY_ITEMS);
      setScanHistory(updatedHistory);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save scan to history.', e);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que quieres borrar todo el historial de escaneos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Borrar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(HISTORY_KEY);
              setScanHistory([]);
              Alert.alert('Éxito', 'El historial de escaneos ha sido borrado.');
            } catch (e) {
              Alert.alert('Error', 'No se pudo borrar el historial.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Acceso por QR</Text>
        
        <QrGenerator value={qrValue} onValueChange={setQrValue} />

        <TouchableOpacity 
          style={[styles.scanButton, isRequestingPermission && styles.scanButtonDisabled]} 
          onPress={handleShowScanner}
          disabled={isRequestingPermission}
        >
          {isRequestingPermission ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.scanButtonText}>Escanear Código QR</Text>
          )}
        </TouchableOpacity>

        {scannedData && <ScanResult scannedData={scannedData} />}
        
        <ScanHistory history={scanHistory} onClearHistory={clearHistory} />
      </ScrollView>

      <Modal visible={isScannerVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {permission?.granted ? (
            <>
              <CameraView
                style={StyleSheet.absoluteFill}
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
              />
              
              {/* Overlay oscuro con marco transparente */}
              <View style={styles.scannerOverlay}>
                <View style={styles.scannerFrameContainer}>
                  <View style={styles.scannerFrame} />
                  <View style={styles.cornerTopLeft} />
                  <View style={styles.cornerTopRight} />
                  <View style={styles.cornerBottomLeft} />
                  <View style={styles.cornerBottomRight} />
                  
                  {/* Línea animada de escaneo */}
                  <View style={styles.scanLine} />
                </View>
                
                <Text style={styles.scannerText}>Enfoca el código QR dentro del marco</Text>
              </View>
            </>
          ) : (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionTitle}>Permisos de cámara</Text>
              <Text style={styles.permissionText}>
                {permission === null 
                  ? 'Solicitando permiso de cámara...' 
                  : 'Acceso a la cámara denegado. Por favor habilita los permisos en configuración.'
                }
              </Text>
              {permission?.status === 'denied' && (
                <TouchableOpacity 
                  style={styles.settingsButton}
                  onPress={() => Linking.openSettings()}
                >
                  <Text style={styles.settingsButtonText}>Abrir Configuración</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setScannerVisible(false)}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#00A8E8',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  scanButtonDisabled: {
    backgroundColor: '#007BFF',
    opacity: 0.7,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  settingsButton: {
    backgroundColor: '#00A8E8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scannerFrameContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00A8E8',
    backgroundColor: 'transparent',
    borderRadius: 10,
    position: 'absolute',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00A8E8',
    borderTopLeftRadius: 10,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00A8E8',
    borderTopRightRadius: 10,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00A8E8',
    borderBottomLeftRadius: 10,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00A8E8',
    borderBottomRightRadius: 10,
  },
  scanLine: {
    width: 200,
    height: 2,
    backgroundColor: '#00A8E8',
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -1 }],
  },
  scannerText: {
    color: 'white',
    fontSize: 16,
    marginTop: 30,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});