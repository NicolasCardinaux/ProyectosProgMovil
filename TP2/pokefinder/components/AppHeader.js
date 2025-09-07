import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AppHeader = () => {
  return (
    <View style={styles.header}>
      <Image 
        source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png' }} 
        style={styles.logo}
      />
      <Text style={styles.title}>PokeFinder</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#262626',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default AppHeader;
