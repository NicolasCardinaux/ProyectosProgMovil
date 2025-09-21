import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../styles/globalStyles';

const ICONS = {
  TransactionInitiated: { name: 'send', color: '#3b82f6' },
  FundsReserved: { name: 'lock', color: '#a855f7' },
  FraudChecked: { name: 'shield' },
  Committed: { name: 'check-circle', color: '#10b981' },
  Reversed: { name: 'alert-triangle', color: '#f97316' },
  Notified: { name: 'bell', color: '#06b6d4' },
};

export const AnimatedTimelineItem = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }).start();
    Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.ease), delay: index * 100, useNativeDriver: true }).start();
  }, [fadeAnim, slideAnim, index]);

  const getIconInfo = () => {
    if (item.type === 'FraudChecked') {
      return { ...ICONS.FraudChecked, color: item.payload.risk === 'LOW' ? '#22c55e' : '#ef4444' };
    }
    return ICONS[item.type] || { name: 'help-circle', color: '#6b7280' };
  };

  const iconInfo = getIconInfo();

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <View style={styles.timelineItem}>
        <View style={[styles.timelineIconContainer, { backgroundColor: `${iconInfo.color}30`, borderColor: '#1A1A1A' }]}>
          <Feather name={iconInfo.name} size={18} color={iconInfo.color} />
        </View>
        <View style={styles.timelineContent}>
          <Text style={styles.timelineTitle}>{item.type.replace(/([A-Z])/g, ' $1').trim()}</Text>
          <Text style={styles.timelineSubtitle}>
            {new Date(item.ts).toLocaleTimeString()}
            {item.payload.risk && ` - Risk: ${item.payload.risk}`}
            {item.payload.reason && ` - ${item.payload.reason}`}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};