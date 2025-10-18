import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { strapi } from '../../src/api/strapi';
import { useCartStore } from '../../src/hooks/useCartStore';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import {
  Product,
  normalizeProduct,
  getProductBrand,
  getBrandName,
  getProductImages,
  getProductFinalPrice,
  hasDiscount,
} from '../../src/types';
import Colors from '../../src/constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

// Pantalla de detalle de producto con gestión de favoritos y carrito
export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToCart, getItemQuantity } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productId = useMemo(() => parseInt(String(id), 10), [id]);

  // Consulta para obtener datos del producto
  const { data: productResponse, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => strapi.getProduct(productId),
    enabled: !isNaN(productId) && productId > 0,
  });


  const { data: favoritesData } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => strapi.getFavorites(),
    enabled: isAuthenticated && !isNaN(productId),
  });
  

  const addToFavoritesMutation = useMutation({
    mutationFn: (pid: number) => strapi.addToFavorites(pid),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: (pid: number) => strapi.removeFromFavorites(pid),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });


  const isFavorite = useMemo(() => {
    return favoritesData?.data?.some(fav => fav.id === productId) || false;
  }, [favoritesData, productId]);

  const quantityInCart = getItemQuantity(productId);


  const mainImageUrl = useMemo(() => {
    if (!productResponse?.data) return null;
    const images = getProductImages(productResponse.data);
    if (images.length === 0) return null;
    
    const selectedImage = images[selectedImageIndex];
    if (!selectedImage) return null;

    const relativeUrl = selectedImage.attributes?.formats?.large?.url || selectedImage.attributes?.url || selectedImage.url;
    return relativeUrl ? `${process.env.EXPO_PUBLIC_API_URL}${relativeUrl}` : null;
  }, [productResponse, selectedImageIndex]);


  if (isNaN(productId) || productId <= 0) {
    return (
      <View style={styles.centered}>
        <Ionicons name="warning-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>ID de producto inválido</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando producto...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>Error al cargar el producto</Text>
      </View>
    );
  }

  if (!productResponse?.data) {
    return (
      <View style={styles.centered}>
        <Ionicons name="search-outline" size={48} color={Colors.textSecondary} />
        <Text style={styles.errorText}>Producto no encontrado</Text>
      </View>
    );
  }


  const productData = productResponse.data;
  const normalizedProduct = normalizeProduct(productData); 
  const attributes = normalizedProduct.attributes;
  const images = getProductImages(productData);
  const hasDiscountValue = hasDiscount(productData);
  const finalPrice = getProductFinalPrice(productData);
  const productBrand = getProductBrand(productData);
  const brandName = productBrand.data ? getBrandName(productBrand.data) : 'Sin marca';


  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (isFavorite) {
      removeFromFavoritesMutation.mutate(productId);
    } else {
      addToFavoritesMutation.mutate(productId);
    }
  };

  // Agregar producto al carrito con validación de stock
  const handleAddToCart = () => {
    if (attributes.stock === 0) {
      Alert.alert('Sin stock', 'Este producto no está disponible.');
      return;
    }
    addToCart(normalizedProduct, 1);
    Alert.alert('¡Agregado!', 'Producto agregado al carrito', [
      { text: 'Seguir comprando', style: 'cancel' },
      { text: 'Ir al carrito', onPress: () => router.push('/(tabs)/cart') },
    ]);
  };

  // Compra inmediata con validación de autenticación y stock
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      Alert.alert('Iniciar sesión', 'Debes iniciar sesión para comprar.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Iniciar Sesión', onPress: () => router.push('/auth/login') },
      ]);
      return;
    }
    if (attributes.stock === 0) {
      Alert.alert('Sin stock', 'Este producto no está disponible.');
      return;
    }


    if (quantityInCart === 0) {
      addToCart(normalizedProduct, 1);
    }
    

    router.push('/(tabs)/cart');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {}
      <View style={styles.imageSection}>
        {images.length > 0 ? (
          <>
            <Image
              source={{ uri: mainImageUrl || undefined }}
              style={styles.mainImage}
              resizeMode="contain"
            />
            {images.length > 1 && (
              <ScrollView
                horizontal
                style={styles.thumbnailsContainer}
                showsHorizontalScrollIndicator={false}
              >
                {images.map((image, index) => {
                  const relativeUrl = image.attributes?.formats?.thumbnail?.url || image.attributes?.url || image.url;
                  const thumbnailUrl = relativeUrl ? `${process.env.EXPO_PUBLIC_API_URL}${relativeUrl}` : null;
                  return (
                    <TouchableOpacity
                      key={image.id}
                      onPress={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        source={{ uri: thumbnailUrl || undefined }}
                        style={[
                          styles.thumbnail,
                          selectedImageIndex === index && styles.thumbnailSelected,
                        ]}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </>
        ) : (
          <View style={styles.noImage}>
            <Ionicons name="image-outline" size={64} color={Colors.textSecondary} />
            <Text style={styles.noImageText}>Sin imagen</Text>
          </View>
        )}
      </View>

      {}
      <View style={styles.infoSection}>
        <Text style={styles.brand}>{brandName}</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{attributes.name}</Text>
          {isAuthenticated && (
            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={styles.favoriteIcon}
              disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavorite ? Colors.error : Colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
        
        {}
        <View style={styles.priceContainer}>
          {hasDiscountValue && (
            <Text style={styles.originalPrice}>${attributes.price.toFixed(2)}</Text>
          )}
          <Text style={styles.finalPrice}>${finalPrice.toFixed(2)}</Text>
          {hasDiscountValue && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{attributes.discount}%</Text>
            </View>
          )}
        </View>

        <Text style={styles.stock}>
          {attributes.stock > 0 ? `${attributes.stock} disponibles en stock` : 'Agotado'}
        </Text>
        <Text style={styles.description}>{attributes.description}</Text>
        
        {}
        {attributes.specifications && (
          <View style={styles.specsSection}>
            <Text style={styles.specsTitle}>Especificaciones</Text>
            {Object.entries(attributes.specifications).map(([key, value]) => (
              <View key={key} style={styles.specRow}>
                <Text style={styles.specKey}>{key}:</Text>
                <Text style={styles.specValue}>{String(value)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            (attributes.stock === 0 || quantityInCart > 0) && styles.addToCartButtonDisabled,
          ]}
          onPress={handleAddToCart}
          disabled={attributes.stock === 0 || quantityInCart > 0}
        >
          <Ionicons
            name={quantityInCart > 0 ? 'checkmark' : 'cart'}
            size={20}
            color={Colors.card}
          />
          <Text style={styles.addToCartText}>
            {attributes.stock === 0
              ? 'Sin stock'
              : quantityInCart > 0
              ? `Agregado (${quantityInCart})`
              : 'Agregar al Carrito'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buyNowButton, attributes.stock === 0 && styles.buyNowButtonDisabled]}
          onPress={handleBuyNow}
          disabled={attributes.stock === 0}
        >
          <Text style={styles.buyNowText}>
            {attributes.stock === 0 ? 'No disponible' : 'Comprar ahora'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  errorText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  imageSection: {
    backgroundColor: Colors.card,
    padding: 16,
  },
  mainImage: {
    width: screenWidth - 32,
    height: 300,
    borderRadius: 12,
  },
  thumbnailsContainer: {
    marginTop: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailSelected: {
    borderColor: Colors.primary,
  },
  noImage: {
    width: screenWidth - 32,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
  },
  noImageText: {
    marginTop: 8,
    color: Colors.textSecondary,
  },
  infoSection: {
    backgroundColor: Colors.card,
    marginTop: 8,
    padding: 16,
  },
  brand: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    marginRight: 10,
  },
  favoriteIcon: {
    padding: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 18,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  finalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: Colors.card,
    fontSize: 12,
    fontWeight: 'bold',
  },
  stock: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: 20,
  },
  specsSection: {
    marginTop: 8,
  },
  specsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  specKey: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '400',
  },
  actionSection: {
    backgroundColor: Colors.card,
    marginTop: 8,
    padding: 16,
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  addToCartButtonDisabled: {
    backgroundColor: Colors.textSecondary,
  },
  addToCartText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buyNowButton: {
    backgroundColor: Colors.success,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyNowButtonDisabled: {
    backgroundColor: Colors.textSecondary,
  },
  buyNowText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
});