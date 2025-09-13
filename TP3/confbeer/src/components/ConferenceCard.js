import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const ConferenceCard = ({ conference, navigation }) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Detalle', { conference })}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image source={conference.image} style={styles.image} />
          <View style={styles.overlay} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{conference.title}</Text>
          <Text style={styles.speaker}>{conference.speaker}</Text>
          <Text style={styles.time}>{conference.time}</Text>
          <Text style={styles.description} numberOfLines={3}>{conference.description}</Text>
        </View>
        <View style={styles.gradientBorder} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1, 
    margin: 8,
  },
  card: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 20,
  },
  speaker: {
    fontSize: 14,
    color: '#BB86FC',
    fontWeight: '600',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#03DAC6',
    marginBottom: 8,
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    color: '#A0A0A0',
    lineHeight: 18,
    fontWeight: '400',
  },
  gradientBorder: {
    height: 3,
    backgroundColor: '#BB86FC',
    width: '40%',
    position: 'absolute',
    bottom: 0,
    left: '30%',
    borderRadius: 2,
  },
});

export default ConferenceCard;