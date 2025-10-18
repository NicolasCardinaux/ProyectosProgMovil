import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import CartListItem from '../../src/components/CartListItem';
import { useCartStore } from '../../src/hooks/useCartStore';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import Colors from '../../src/constants/Colors';

// Pantalla del carrito. Muestra los productos agregados y el total.
export default function CartScreen() {
  const router = useRouter();
  const { items, totalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  // Se encarga de la lógica al presionar el botón de pagar.
  const handleCheckout = () => {
    // Primero, valida si el usuario inició sesión. Si no, le pide que lo haga.
    if (!isAuthenticated) {
      Alert.alert('Iniciar sesión', 'Debes iniciar sesión para realizar una compra', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Iniciar Sesión', onPress: () => router.push('/auth/login') },
      ]);
      return;
    }

    // Luego, valida que el carrito no esté vacío.
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos al carrito antes de comprar');
      return;
    }


    router.push('/checkout');
  };

  // Si el carrito está vacío, mostramos un mensaje para incentivar la compra.
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptyText}>
          Agrega algunos productos increíbles para comenzar
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.shopButtonText}>Ir a la Tienda</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Si hay productos, los mostramos en una lista.
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem item={item} />}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      {}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>
            Ir a Pagar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.text,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: Colors.card,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
});