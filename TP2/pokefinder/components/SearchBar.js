import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
// 1. Importamos el componente de íconos
import { Feather } from '@expo/vector-icons';

const SearchBar = ({ searchTerm, onSearchTermChange }) => {
  return (
    <View style={styles.container}>
      {/* 2. Reemplazamos el <Text> con el emoji por un componente de ícono */}
      <Feather name="search" size={20} color="#888" style={styles.icon} />
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

