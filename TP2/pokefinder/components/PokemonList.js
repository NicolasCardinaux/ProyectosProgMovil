import React from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import PokemonCard from './PokemonCard';

const PokemonList = ({ pokemonData, onRefresh, isRefreshing, onLoadMore, isLoadingMore }) => {
  // Componente que se muestra cuando la lista está vacía (ej. sin resultados de búsqueda)
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>🤔</Text>
      <Text style={styles.emptyText}>No se encontraron Pokémon.</Text>
      <Text style={styles.emptySubText}>Intenta con otra búsqueda o refresca la lista.</Text>
    </View>
  );
  
  // Componente para el footer (muestra un spinner al cargar más)
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color="#FFCB05" />
      </View>
    );
  };

  return (
    <FlatList
      data={pokemonData}
      renderItem={({ item }) => <PokemonCard pokemon={item} />}
      keyExtractor={item => item.id.toString()}
      numColumns={2} // Muestra los Pokémon en una grilla de 2 columnas
      contentContainerStyle={styles.listContent}
      // Funcionalidad de pull-to-refresh
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      // (Bonus) Paginación
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5} // Llama a onLoadMore cuando estamos a mitad de pantalla del final
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 22,
    color: '#DDD',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  footerLoader: {
    paddingVertical: 20,
  },
});

export default PokemonList;
