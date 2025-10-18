import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Product, normalizeProduct, getBrandName } from '../types';
import { useCartStore } from '../hooks/useCartStore';
import { useAuthStore } from '../hooks/useAuthStore';
import { strapi } from '../api/strapi';
import Colors from '../constants/Colors';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  isFavorite?: boolean;
}

// Componentes: la "tarjeta" reutilizable que muestra cada producto en la grilla de la tienda.
export default function ProductCard({ product, onPress, isFavorite = false }: ProductCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { addToCart, getItemQuantity } = useCartStore();

  const addToFavoritesMutation = useMutation({
    mutationFn: (productId: number) => strapi.addToFavorites(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error("Error al añadir a favoritos:", error);
    }
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: (productId: number) => strapi.removeFromFavorites(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error("Error al quitar de favoritos:", error);
    }
  });

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isFavorite) {
      removeFromFavoritesMutation.mutate(product.id);
    } else {
      addToFavoritesMutation.mutate(product.id);
    }
  };


  const normalizedProduct = normalizeProduct(product);
  const attributes = normalizedProduct.attributes;

  if (!attributes.name) {
    return (
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.errorText}>Producto no disponible</Text>
        </View>
      </View>
    );
  }
  

  const quantityInCart = getItemQuantity(product.id);


  const handleAddToCart = () => {
    if (attributes.stock > 0) {
      addToCart(product, 1);
    }
  };

  const hasDiscountValue = attributes.discount > 0;
  const finalPrice = attributes.finalPrice;

  const imageUrl = (() => {
    const images = attributes.images?.data || [];
    if (images.length === 0) return null;
    const relativeUrl = images[0].attributes?.url || images[0].url;
    const cleanRelativeUrl = relativeUrl?.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
    return relativeUrl ? `${process.env.EXPO_PUBLIC_API_URL}${cleanRelativeUrl}` : null;
  })();
  
  let brandName = 'Sin marca';
  if (attributes.brand && attributes.brand.data) {
    brandName = getBrandName(attributes.brand.data);
  }

  const productName = attributes.name;
  const stock = attributes.stock;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
          disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? Colors.error : Colors.textSecondary}
          />
        </TouchableOpacity>

        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>No image</Text>
          </View>
        )}
        {hasDiscountValue && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{attributes.discount}%</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.brand} numberOfLines={1}>{brandName}</Text>
        <Text style={styles.name} numberOfLines={2}>{productName}</Text>
        
        <View style={styles.priceContainer}>
          {hasDiscountValue && (
            <Text style={styles.originalPrice}>${attributes.price.toFixed(2)}</Text>
          )}
          <Text style={styles.finalPrice}>${finalPrice.toFixed(2)}</Text>
        </View>

        <Text style={styles.stock}>
          {stock > 0 ? `${stock} en stock` : 'Sin stock'}
        </Text>

        <TouchableOpacity
          style={[styles.addButton, stock === 0 && styles.disabledButton]}
          onPress={handleAddToCart}
          disabled={stock === 0}
        >
          <Text style={styles.addButtonText}>
            {stock === 0 ? 'Sin stock' :
              quantityInCart > 0 ? `Agregado (${quantityInCart})` : 'Agregar'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    minWidth: 160,
    maxWidth: 180,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.inputBackground,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
  },
  noImageText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: Colors.card,
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  brand: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text,
    height: 40,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  finalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  stock: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.textSecondary,
  },
  addButtonText: {
    color: Colors.card,
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    textAlign: 'center',
    padding: 8,
  },
});