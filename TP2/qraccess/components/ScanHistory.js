import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { isUrl } from '../App';

const ScanHistory = ({ history, onClearHistory }) => {
  if (!history || history.length === 0) {
    return null;
  }

  const openHistoryItem = async (data) => {
    if (isUrl(data)) {
      try {
        const canOpen = await Linking.canOpenURL(data);
        if (canOpen) {
          await Linking.openURL(data);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo abrir el enlace');
      }
    } else {
      Alert.alert('Contenido', data);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>Historial de Escaneos</Text>
        <TouchableOpacity onPress={onClearHistory}>
          <Text style={styles.clearButtonText}>Limpiar</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.list}>
        {history.map((item, index) => (
          <TouchableOpacity 
            key={`${item.date}-${index}`} 
            style={styles.historyItem}
            onPress={() => openHistoryItem(item.data)}
          >
            <Text style={styles.historyText} numberOfLines={1}>
              {item.data}
            </Text>
            <Text style={styles.historyDate}>
              {new Date(item.date).toLocaleString()}
            </Text>
            {isUrl(item.data) && (
              <Text style={styles.linkIndicator}>🔗 Enlace</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginTop: 20,
    borderColor: '#2f2f2f',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00A8E8',
  },
  list: {
    marginTop: 10,
    width: '100%',
    maxHeight: 200,
  },
  historyItem: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  historyText: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  historyDate: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  linkIndicator: {
    color: '#00A8E8',
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default ScanHistory;