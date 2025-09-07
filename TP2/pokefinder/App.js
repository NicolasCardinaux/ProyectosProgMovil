import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  ActivityIndicator,
} from 'react-native';

// Importamos los componentes
import PokemonList from './components/PokemonList';
import SearchBar from './components/SearchBar';
import ErrorDisplay from './components/ErrorDisplay';
import AppHeader from './components/AppHeader';

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=50';

export default function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);
  const [cache, setCache] = useState({});

  const fetchPokemon = useCallback(async (url, isRefresh = false) => {
    // Si no es un refresh, mostramos el spinner principal
    if (!isRefresh) {
      setIsLoading(true);
    }
    setError(null);

    // Revisamos el cache (solo para paginación, no para refresh)
    if (cache[url] && !isRefresh) {
      const cachedData = cache[url];
      
      // Lógica mejorada para añadir Pokémon desde caché sin duplicados
      setAllPokemon(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newPokemon = cachedData.pokemon.filter(p => !existingIds.has(p.id));
        return [...prev, ...newPokemon];
      });

      setNextUrl(cachedData.next);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error de conexión con el servidor.');
      }
      const data = await response.json();

      const processedPokemon = data.results.map(p => {
        const id = p.url.split('/')[p.url.split('/').length - 2];
        return {
          id,
          name: p.name,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        };
      });

      // Guardamos en cache
      setCache(prevCache => ({...prevCache, [url]: { pokemon: processedPokemon, next: data.next }}));
      
      // Lógica mejorada para actualizar el estado, previniendo duplicados (soluciona el warning de las keys)
      setAllPokemon(prev => {
        if (isRefresh) {
          return processedPokemon; // Si es refresh, reemplaza toda la lista
        }
        // Si no es refresh (paginación), combina las listas y filtra para tener items únicos
        const combined = [...prev, ...processedPokemon];
        const uniquePokemon = combined.filter((pokemon, index, self) =>
          index === self.findIndex((p) => (
            p.id === pokemon.id
          ))
        );
        return uniquePokemon;
      });
      setNextUrl(data.next);

    } catch (e) {
      setError(e.message || 'No se pudo cargar los Pokémon. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [cache]);

  // useEffect para la carga inicial
  useEffect(() => {
    fetchPokemon(API_URL, true); // La carga inicial la tratamos como un refresh para poblar la lista
  }, [fetchPokemon]);

  // Memoización del filtrado
  const filteredPokemon = useMemo(() => {
    if (!searchTerm) {
      return allPokemon;
    }
    return allPokemon.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allPokemon]);

  // Handler para el pull-to-refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    // CORRECCIÓN: No limpiamos el array aquí, fetchPokemon se encarga de reemplazarlo
    fetchPokemon(API_URL, true);
  };
  
  // Handler para la paginación
  const handleLoadMore = () => {
    if (nextUrl && !isLoading) {
      fetchPokemon(nextUrl);
    }
  };

  // Lógica de renderizado
  const renderContent = () => {
    if (isLoading && !allPokemon.length) {
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
        isLoadingMore={isLoading && allPokemon.length > 0}
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