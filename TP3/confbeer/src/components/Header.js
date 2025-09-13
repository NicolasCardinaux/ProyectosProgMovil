import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';

const Header = ({ searchText, setSearchText }) => {
  return (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#BB86FC" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conferencias..."
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
          clearButtonMode="while-editing"
          selectionColor="#BB86FC"
        />
        {searchText.length > 0 && (
          <Icon
            name="times-circle"
            size={18}
            color="#666"
            style={styles.clearIcon}
            onPress={() => setSearchText('')}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#E0E0E0',
  },
  clearIcon: {
    padding: 5,
  },
});

export default Header;