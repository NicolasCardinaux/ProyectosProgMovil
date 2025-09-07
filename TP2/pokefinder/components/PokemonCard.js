import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';

// Función para capitalizar la primera letra
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const PokemonCard = ({ pokemon }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.7}>
      <View style={styles.innerContainer}>
        <Image
          source={{ uri: pokemon.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.nameBadge}>
          <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    backgroundColor: '#2C2C2C',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  nameBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PokemonCard;
