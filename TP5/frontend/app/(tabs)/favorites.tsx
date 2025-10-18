import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../src/components/ProductCard';
import { strapi } from '../../src/api/strapi';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import Colors from '../../src/constants/Colors';

// Pantalla que muestra la lista de productos que el usuario ha marcado como favoritos.
export default function FavoritesScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Usamos useQuery para obtener los favoritos. La consulta solo se activa si el usuario está autenticado.
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => strapi.getFavorites(),
    enabled: isAuthenticated,
  });

  // Si el usuario no está logueado, le mostramos una invitación para que inicie sesión.
  if (!isAuthenticated) {
    return (
      <View style={styles.centered}>
        <Ionicons name="heart-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.title}>Inicia sesión</Text>
        <Text style={styles.subtitle}>Para ver tus productos favoritos</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }


  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Ionicons name="heart-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.title}>Cargando favoritos...</Text>
      </View>
    );
  }

  const favoriteProducts = favorites?.data || [];

  // Finalmente, mostramos la lista de productos favoritos en una grilla de dos columnas.
  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={(product) => router.push(`/product/${product.id}`)}
            isFavorite={true} 
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={favoriteProducts.length === 0 ? styles.emptyContainer : styles.productsList}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="heart-outline" size={64} color={Colors.textSecondary} />
            <Text style={styles.title}>No tienes favoritos</Text>
            <Text style={styles.subtitle}>Agrega productos a tus favoritos</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  productsList: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
  },
});