import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../src/components/ProductCard';
import { strapi } from '../../src/api/strapi';
import { Product, Category, Brand, getCategoryName, getBrandName } from '../../src/types';
import Colors from '../../src/constants/Colors';
import { useAuthStore } from '../../src/hooks/useAuthStore';

// Pantalla principal de la tienda con sistema completo de filtros, búsqueda y paginación
export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>('name:asc');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  // Consulta principal para obtener productos con ordenamiento
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['products', selectedSort],
    queryFn: () => strapi.getProducts({ 
      pagination: { pageSize: 50 },
      sort: selectedSort
    }),
  });

  
  const { data: favoritesData } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => strapi.getFavorites(),
    enabled: isAuthenticated,
  });

  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => strapi.getCategories(),
  });


  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: () => strapi.getBrands(),
  });


  const favoriteProductIds = useMemo(() => {
    if (!favoritesData?.data) return new Set<number>();
    return new Set(favoritesData.data.map(p => p.id));
  }, [favoritesData]);

  // Filtrado de productos por categoría, marca y búsqueda
  const filteredProducts = useMemo(() => {
    if (!data?.data) return [];
    let filtered = data.data;

    if (selectedCategory) {
      filtered = filtered.filter(product => {
        const category = product.attributes?.category || product.category;
        const categoryId = (category as any)?.data?.id || (category as any)?.id;
        return categoryId === selectedCategory;
      });
    }

    if (selectedBrand) {
      filtered = filtered.filter(product => {
        const brand = product.attributes?.brand || product.brand;
        const brandId = (brand as any)?.data?.id || (brand as any)?.id;
        return brandId === selectedBrand;
      });
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(product => {
        const name = product.attributes?.name || product.name || '';
        return name.toLowerCase().includes(lowercasedQuery);
      });
    }

    return filtered;
  }, [data?.data, selectedCategory, selectedBrand, searchQuery]);


  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);


  const PRODUCTS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);


  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };


  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard 
      product={item} 
      onPress={handleProductPress}
      isFavorite={favoriteProductIds.has(item.id)}
    />
  );


  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSearchQuery('');
    setSelectedSort('name:asc');
    setShowFiltersModal(false);
  };


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={handlePrevPage} disabled={currentPage === 1} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={28} color={currentPage === 1 ? Colors.textSecondary : Colors.primary} />
        </TouchableOpacity>

        <Text style={styles.paginationText}>
          Página {currentPage} de {totalPages}
        </Text>

        <TouchableOpacity onPress={handleNextPage} disabled={currentPage === totalPages} style={styles.arrowButton}>
          <Ionicons name="chevron-forward" size={28} color={currentPage === totalPages ? Colors.textSecondary : Colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };


  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>Error cargando productos</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFiltersModal(true)}>
          <Ionicons name="filter" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {}
      <Modal visible={showFiltersModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtros y Ordenamiento</Text>
            <TouchableOpacity onPress={() => setShowFiltersModal(false)}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Ordenar por</Text>
              <View style={styles.filterOptions}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[styles.filterOption, selectedSort === option.value && styles.filterOptionActive]}
                    onPress={() => setSelectedSort(option.value)}
                  >
                    <Text style={[styles.filterOptionText, selectedSort === option.value && styles.filterOptionTextActive]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Categoría</Text>
              <View style={styles.filterOptions}>
                {categories?.data?.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.filterOption, selectedCategory === category.id && styles.filterOptionActive]}
                    onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  >
                    <Text style={[styles.filterOptionText, selectedCategory === category.id && styles.filterOptionTextActive]}>
                      {getCategoryName(category)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Marca</Text>
              <View style={styles.filterOptions}>
                {brands?.data?.map((brand) => (
                  <TouchableOpacity
                    key={brand.id}
                    style={[styles.filterOption, selectedBrand === brand.id && styles.filterOptionActive]}
                    onPress={() => setSelectedBrand(selectedBrand === brand.id ? null : brand.id)}
                  >
                    <Text style={[styles.filterOptionText, selectedBrand === brand.id && styles.filterOptionTextActive]}>
                      {getBrandName(brand)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Limpiar todo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyFiltersButton} onPress={() => setShowFiltersModal(false)}>
              <Text style={styles.applyFiltersText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {}
      <FlatList
        data={paginatedProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsList}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>
              {selectedCategory || selectedBrand || searchQuery 
                ? 'No se encontraron productos con los filtros aplicados' 
                : 'No hay productos disponibles'
              }
            </Text>
            {(selectedCategory || selectedBrand || searchQuery) && (
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Limpiar filtros</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ListFooterComponent={renderPagination}
      />
    </View>
  );
}


const SORT_OPTIONS = [
  { key: 'name-asc', label: 'Nombre A-Z', value: 'name:asc' },
  { key: 'name-desc', label: 'Nombre Z-A', value: 'name:desc' },
  { key: 'price-asc', label: 'Precio: Menor a Mayor', value: 'price:asc' },
  { key: 'price-desc', label: 'Precio: Mayor a Menor', value: 'price:desc' },
  { key: 'sales-desc', label: 'Más Vendidos', value: 'salesCount:desc' },
  { key: 'newest', label: 'Más Recientes', value: 'createdAt:desc' },
];


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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 18,
    color: Colors.error,
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: Colors.text,
  },
  filterButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.inputBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterOptionText: {
    color: Colors.text,
  },
  filterOptionTextActive: {
    color: Colors.card,
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearFiltersText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  applyFiltersButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyFiltersText: {
    color: Colors.card,
    fontWeight: '600',
  },
  productsList: {
    padding: 8,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  clearButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 10,
  },
  arrowButton: {
    padding: 8,
  },
  paginationText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});