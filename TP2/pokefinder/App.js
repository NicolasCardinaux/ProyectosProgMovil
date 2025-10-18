import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  ActivityIndicator,
} from 'react-native';
import PokemonList from './components/PokemonList';
import SearchBar from './components/SearchBar';
import ErrorDisplay from './components/ErrorDisplay';
import AppHeader from './components/AppHeader';

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=50'; 

// Componente principal de la aplicación PokeFinder.
export default function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);
  const [cache, setCache] = useState({});


  const fetchPokemon = useCallback(async (url, isRefresh = false) => {
    if (!isRefresh && !isRefreshing) setIsLoading(true); 
    setError(null);


    if (cache[url] && !isRefresh) {
      const cachedData = cache[url];
      const existingIds = new Set(allPokemon.map(p => p.id));
      const newPokemon = cachedData.pokemon.filter(p => !existingIds.has(p.id));
      setAllPokemon(prev => [...prev, ...newPokemon]);
      setNextUrl(cachedData.next);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error de conexión.');
      const data = await response.json();


      const processedPokemon = data.results.map(p => {
        const id = p.url.split('/')[p.url.split('/').length - 2];
        return {
          id,
          name: p.name,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        };
      });


      setCache(prevCache => ({...prevCache, [url]: { pokemon: processedPokemon, next: data.next }}));
      setAllPokemon(prev => {
        if (isRefresh) return processedPokemon;
        const combined = [...prev, ...processedPokemon];
        return combined.filter((pokemon, index, self) => index === self.findIndex(p => p.id === pokemon.id));
      });
      setNextUrl(data.next);

    } catch (e) {
      setError(e.message || 'No se pudo cargar los Pokémon.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [cache, allPokemon]); 


  useEffect(() => {
    fetchPokemon(API_URL, true);
  }, [fetchPokemon]); 


  const filteredPokemon = useMemo(() => {
    if (!searchTerm) return allPokemon;
    return allPokemon.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allPokemon]);

  const handleRefresh = () => {
    setIsRefreshing(true);

    fetchPokemon(API_URL, true);
  };


  const handleLoadMore = () => {

    if (nextUrl && !isLoading && !isRefreshing) {
      fetchPokemon(nextUrl);
    }
  };


  const renderContent = () => {
    if (isLoading && !allPokemon.length && !isRefreshing) { 
      return <ActivityIndicator size="large" color="#FFCB05" style={styles.centered}/>;
    }
    if (error && !allPokemon.length) {
      return <ErrorDisplay message={error} onRetry={handleRefresh} />;
    }

    return (
      <PokemonList
        pokemonData={filteredPokemon}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onLoadMore={handleLoadMore}
        isLoadingMore={isLoading && allPokemon.length > 0 && !isRefreshing}
      />
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <AppHeader />
      <View style={styles.searchContainer}>
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />
      </View>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  contentContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});