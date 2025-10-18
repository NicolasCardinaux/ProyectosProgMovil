import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/globalStyles';
import { AnimatedTimelineItem } from './AnimatedTimelineItem'; 

// Este componente representa una "tarjeta" que muestra una transacción completa
export const TransactionCard = ({ transaction }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Transacción</Text>
    <Text style={styles.cardTxnId}>{transaction.id}</Text> {}
    <View style={styles.timelineContainer}>
      {}
      {transaction.events.map((item, index) => (
        <AnimatedTimelineItem key={item.id || `event-${index}`} item={item} index={index} />
      ))}
    </View>
  </View>
);