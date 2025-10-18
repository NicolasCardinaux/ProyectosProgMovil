import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import ConferenceCard from './ConferenceCard';
import { getConferences } from '../services/ConferenceService';

// Componente que carga las conferencias y las muestra en una grilla de dos columnas,
const ConferenceGrid = ({ navigation, searchText }) => {
  const [allConferences, setAllConferences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getConferences();
      setAllConferences(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredConferences = allConferences.filter(conference =>
    conference.title.toLowerCase().includes(searchText.toLowerCase()) ||
    conference.speaker.toLowerCase().includes(searchText.toLowerCase()) ||
    conference.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <ConferenceCard conference={item} navigation={navigation} />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB86FC" />
      </View>
    );
  }

  if (filteredConferences.length === 0 && searchText) {
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsTitle}>No se encontraron resultados</Text>
        <Text style={styles.noResultsText}>Intenta con otras palabras clave</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredConferences}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        key={2} 
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" 
        ListHeaderComponent={
          filteredConferences.length > 0 && (
            <Text style={styles.resultsCount}>
              {filteredConferences.length} conferencia{filteredConferences.length !== 1 ? 's' : ''} encontrada{filteredConferences.length !== 1 ? 's' : ''}
            </Text>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  grid: {
    paddingHorizontal: 8,
    paddingBottom: 30,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noResultsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#BB86FC',
    marginBottom: 10,
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultsCount: {
    color: '#888',
    fontSize: 14,
    marginVertical: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ConferenceGrid;