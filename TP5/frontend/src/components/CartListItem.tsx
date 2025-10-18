import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CartItem as CartItemType, NormalizedProduct } from '../types';
import { useCartStore } from '../hooks/useCartStore';
import {
  getNormalizedProductFinalPrice,
  getNormalizedMainImageUrl,
} from '../types';
import Colors from '../constants/Colors';

interface CartListItemProps {
  item: CartItemType;
}

// Representa cada una de las filas de productos dentro de la pantalla del carrito.
export default function CartListItem({ item }: CartListItemProps) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();
  const router = useRouter();

  const product = item.product as NormalizedProduct;
  const attributes = product.attributes;

  const imageUrl = getNormalizedMainImageUrl(product);
  const finalPrice = getNormalizedProductFinalPrice(product);


  const handleNavigateToProduct = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <View style={styles.container}>
      {}
      <TouchableOpacity style={styles.clickableArea} onPress={handleNavigateToProduct}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            onError={(e) => console.log('❌ Error loading cart image:', e.nativeEvent.error)}
          />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>No img</Text>
          </View>
        )}
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={2}>{attributes.name}</Text>
          <Text style={styles.price}>${finalPrice.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>

      {}
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => decreaseQuantity(product.id)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.quantity}>{item.quantity}</Text>
        
        <TouchableOpacity
          style={[
            styles.quantityButton,
            item.quantity >= attributes.stock && styles.disabledButton 
          ]}
          onPress={() => increaseQuantity(product.id)}
          disabled={item.quantity >= attributes.stock}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(product.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clickableArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  noImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: Colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: Colors.inputBackground,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.border,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
    color: Colors.text,
  },
  removeButton: {
    width: 32,
    height: 32,
    backgroundColor: Colors.error,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.card,
  },
});