import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'; 

// Componente reutilizable para la barra de búsqueda.

const SearchBar = ({ searchTerm, onSearchTermChange }) => {
  return (
    <View style={styles.container}>
      {}
      <Feather name="search" size={20} color="#888" style={styles.icon} />
      {}
      <TextInput
        style={styles.input}
        placeholder="Buscar Pokémon por nombre..." 
        placeholderTextColor="#888" 
        value={searchTerm} 
        onChangeText={onSearchTermChange} 
        autoCapitalize="none" 
        autoCorrect={false} 
        clearButtonMode="always" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    height: '100%',
  },
});

export default SearchBar;