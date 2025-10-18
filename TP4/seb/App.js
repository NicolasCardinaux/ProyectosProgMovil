import React, { useState, useMemo, useCallback } from 'react';
import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWebSocket } from './src/hooks/useWebSocket';
import { initiateTransaction as apiInitiateTransaction } from './src/api/transactionService';
import { TransactionCard } from './src/components/TransactionCard';
import { EmptyState } from './src/components/EmptyState';
import { styles } from './src/styles/globalStyles';

// Componente principal de la aplicación que orquesta la UI y la lógica.
export default function App() {
  const [transactions, setTransactions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Callback que se ejecuta cada vez que llega un evento por WebSocket.
  const handleWsMessage = useCallback((event) => {
    setTransactions((prev) => {
      const newTransactions = { ...prev };
      const txnId = event.transactionId;
      if (newTransactions[txnId]) {
        if (!newTransactions[txnId].events.some((e) => e.id === event.id)) {
          newTransactions[txnId].events.push(event);
          newTransactions[txnId].events.sort((a, b) => a.ts - b.ts);
        }
      }
      return newTransactions;
    });
  }, []);


  const wsStatus = useWebSocket(handleWsMessage);


  const handleInitiateTransaction = async () => {
    setIsSubmitting(true);
    try {
      const data = await apiInitiateTransaction();
      setTransactions((prev) => ({
        ...prev,
        [data.transactionId]: { id: data.transactionId, events: [] },
      }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const transactionList = useMemo(() =>
    Object.values(transactions).sort((a, b) => (b.events[0]?.ts || 0) - (a.events[0]?.ts || 0)),
    [transactions]
  );


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timeline de Transacciones</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: wsStatus === 'Connected' ? '#4CAF50' : '#FF9800' },
            ]}
          />
          <Text style={styles.statusText}>{wsStatus}</Text>
        </View>
      </View>

            <FlatList
        data={transactionList}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<EmptyState />}
      />

      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleInitiateTransaction}
          disabled={isSubmitting}
        >
          {isSubmitting ? <ActivityIndicator color="#fff" /> : (
            <>
              <Feather name="zap" size={20} color="#fff" />
              <Text style={styles.buttonText}>Iniciar Transacción</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}