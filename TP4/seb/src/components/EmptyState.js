import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../styles/globalStyles';

export const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Feather name="list" size={48} color="#4b5563" />
    <Text style={styles.emptyText}>Inicia una transacción para ver su ciclo de vida en tiempo real.</Text>
  </View>
);
