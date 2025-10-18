// Tipos base de Strapi
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Tipos para relaciones
export interface StrapiImage {
  id: number;
  attributes?: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: any;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
  };

  name?: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: any;
  hash?: string;
  ext?: string;
  mime?: string;
  size?: number;
  url?: string;
  previewUrl?: string | null;
  provider?: string;
  provider_metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}


interface BaseEntity {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// Entidades principales 
export interface Product extends BaseEntity {
  attributes?: {
    name: string;
    description: string;
    price: number;
    discount: number;
    finalPrice?: number;
    stock: number;
    specifications: Record<string, any> | null;
    isActive: boolean;
    images: {
      data: StrapiImage[];
    } | null;
    category: {
      data: Category;
    };
    brand: {
      data: Brand;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };

  name?: string;
  description?: string;
  price?: number;
  discount?: number;
  finalPrice?: number;
  stock?: number;
  specifications?: Record<string, any> | null;
  isActive?: boolean;
  images?: {
    data: StrapiImage[];
  } | StrapiImage[] | null;
  category?: {
    data: Category;
  } | Category;
  brand?: {
    data: Brand;
  } | Brand;
}

export interface Category extends BaseEntity {
  attributes?: {
    name: string;
    slug: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };

  name?: string;
  slug?: string;
  description?: string;
}

export interface Brand extends BaseEntity {
  attributes?: {
    name: string;
    description: string;
    logo: {
      data: StrapiImage | null;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };

  name?: string;
  description?: string;
  logo?: {
    data: StrapiImage | null;
  } | StrapiImage | null;
}

export interface Order extends BaseEntity {
  attributes?: {
    orderNumber: string;
    items: Array<{
      productId: number;
      quantity: number;
      price: number;
    }>;
    total: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: string;
    shippingAddress: Record<string, any>;
    user: {
      data: User;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };

  orderNumber?: string;
  items?: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
  total?: number;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  shippingAddress?: Record<string, any>;
  user?: {
    data: User;
  } | User;
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  favorites?: {
    data: Product[];
  };
}

// Tipos para el frontend 
export interface CartItem {
  product: NormalizedProduct;
  quantity: number;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}


export type ApiResponse<T> = StrapiResponse<T>;


export interface ProductWithAttributes extends Product {
  attributes: NonNullable<Product['attributes']>;
}

export interface CategoryWithAttributes extends Category {
  attributes: NonNullable<Category['attributes']>;
}

export interface BrandWithAttributes extends Brand {
  attributes: NonNullable<Brand['attributes']>;
}


export interface NormalizedProduct extends Omit<Product, 'attributes'> {
  attributes: {
    name: string;
    description: string;
    price: number;
    discount: number;
    finalPrice: number;
    stock: number;
    specifications: Record<string, any> | null;
    isActive: boolean;
    images: { data: StrapiImage[] };
    category: { data: Category | null };
    brand: { data: Brand | null };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}


export function hasProductAttributes(product: Product): product is ProductWithAttributes {
  return product.attributes !== undefined &&
           product.attributes !== null &&
           typeof product.attributes.name === 'string';
}

export function hasCategoryAttributes(category: Category): category is CategoryWithAttributes {
  return category.attributes !== undefined &&
           category.attributes !== null &&
           typeof category.attributes.name === 'string';
}

export function hasBrandAttributes(brand: Brand): brand is BrandWithAttributes {
  return brand.attributes !== undefined &&
           brand.attributes !== null &&
           typeof brand.attributes.name === 'string';
}


export function getProductName(product: Product): string {
  if (hasProductAttributes(product)) {
    return product.attributes.name;
  }
  return product.name || 'Producto sin nombre';
}

export function getCategoryName(category: Category): string {
  if (hasCategoryAttributes(category)) {
    return category.attributes.name;
  }
  return category.name || 'Sin nombre';
}

export function getBrandName(brand: Brand): string {
  if (!brand) return 'Sin marca';

  if (hasBrandAttributes(brand)) {
    return brand.attributes.name || 'Sin marca';
  }

  return brand.name || 'Sin marca';
}


export function getProductCategoryId(product: Product): number | undefined {

  if (product.attributes?.category?.data?.id) {
    return product.attributes.category.data.id;
  }

  else if (product.category && typeof product.category === 'object' && 'id' in product.category) {
    return (product.category as Category).id;
  }

  else if (product.category && typeof product.category === 'object' && 'data' in product.category) {
    return (product.category as { data: Category }).data?.id;
  }
  return undefined;
}


export function getProductBrandId(product: Product): number | undefined {

  if (product.attributes?.brand?.data?.id) {
    return product.attributes.brand.data.id;
  }

  else if (product.brand && typeof product.brand === 'object' && 'id' in product.brand) {
    return (product.brand as Brand).id;
  }

  else if (product.brand && typeof product.brand === 'object' && 'data' in product.brand) {
    return (product.brand as { data: Brand }).data?.id;
  }
  return undefined;
}

export function getProductImages(product: Product): StrapiImage[] {
  console.log('🔍 Buscando imágenes en producto...');


  if (hasProductAttributes(product)) {
    if (Array.isArray(product.attributes.images)) {
      console.log('✅ Imágenes encontradas en attributes (array):', product.attributes.images.length);
      return product.attributes.images;
    }
    const images = product.attributes.images?.data || [];
    console.log('✅ Imágenes encontradas en attributes.data:', images.length);
    return images;
  }


  if (Array.isArray(product.images)) {
    console.log('✅ Imágenes encontradas en array plano:', product.images.length);
    return product.images;
  }


  if (product.images && (product.images as any).data) {
    const images = (product.images as any).data;
    console.log('✅ Imágenes encontradas en images.data:', images.length);
    return images;
  }


  if (product.attributes && Array.isArray((product.attributes as any).images)) {
    const images = (product.attributes as any).images;
    console.log('✅ Imágenes encontradas en attributes.images array:', images.length);
    return images;
  }

  console.log('❌ No se encontraron imágenes');
  return [];
}



export function getMainImageUrl(product: Product): string | null {
  const images = getProductImages(product);
  console.log('🔍 getMainImageUrl - Total images found:', images.length);

  if (images.length === 0) {
    console.log('❌ No hay imágenes para el producto:', product.id);
    return null;
  }

  const mainImage = images[0];
  console.log('🖼️ Main image object:', {
    id: mainImage.id,
    hasAttributes: !!mainImage.attributes,
    url: mainImage.attributes?.url || mainImage.url
  });


  let imageUrl = mainImage.attributes?.url || mainImage.url;

  if (!imageUrl) {
    console.log('❌ No se pudo encontrar URL en la imagen');
    return null;
  }

  console.log('🔗 URL cruda encontrada:', imageUrl);


  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    console.log('✅ URL absoluta, retornando:', imageUrl);
    return imageUrl;
  }


  if (imageUrl.startsWith('/uploads')) {
    const fullUrl = `${process.env.EXPO_PUBLIC_API_URL}${imageUrl}`;
    console.log('🔗 URL construida con /uploads:', fullUrl);
    return fullUrl;
  }


  const fullUrl = `${process.env.EXPO_PUBLIC_API_URL}/uploads/${imageUrl}`;
  console.log('🔗 URL final construida:', fullUrl);
  return fullUrl;
}


export function getProductFinalPrice(product: Product): number {
  if (hasProductAttributes(product)) {
    return product.attributes.finalPrice || product.attributes.price || 0;
  }
  return product.finalPrice || product.price || 0;
}


export function getNormalizedProductFinalPrice(product: NormalizedProduct): number {
  return product.attributes.finalPrice || product.attributes.price || 0;
}


export function getNormalizedProductImages(product: NormalizedProduct): StrapiImage[] {
  console.log('🔍 getNormalizedProductImages - Product:', {
    id: product.id,
    hasImages: !!product.attributes.images,
    imagesType: typeof product.attributes.images,
    imagesData: product.attributes.images?.data
  });

 
  if (product.attributes.images && (product.attributes.images as any).data) {
    const images = (product.attributes.images as any).data;
    console.log('✅ Imágenes encontradas en images.data:', images.length);
    return images;
  }


  if (Array.isArray(product.attributes.images)) {
    console.log('✅ Imágenes encontradas en images array:', product.attributes.images.length);
    return product.attributes.images;
  }


  console.log('❌ No se encontraron imágenes en normalized product');
  return [];
}


export function getNormalizedMainImageUrl(product: NormalizedProduct): string | null {
  const images = getNormalizedProductImages(product);

  if (images.length === 0) {
    return null;
  }

  const mainImage = images[0];
  let imageUrl = mainImage.attributes?.url || mainImage.url;

  if (!imageUrl) {
    return null;
  }


  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }


  if (imageUrl.startsWith('/uploads')) {
    return `${process.env.EXPO_PUBLIC_API_URL}${imageUrl}`;
  }


  return `${process.env.EXPO_PUBLIC_API_URL}/uploads${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
}


export function getNormalizedProductBrand(product: NormalizedProduct): { data: Brand | null } {
  return product.attributes.brand || { data: null };
}


export function normalizeProduct(product: Product): NormalizedProduct {
  console.log('🔄 Normalizando producto ID:', product.id);
  console.log('📦 Estructura original:', {
    hasAttributes: !!product.attributes,
    images: product.images,
    attributesImages: product.attributes?.images
  });


  if (hasProductAttributes(product)) {
    const attrs = product.attributes;
    const finalPrice = attrs.finalPrice ||
                       (attrs.discount > 0
                         ? attrs.price * (1 - attrs.discount / 100)
                         : attrs.price);


    let imagesData: { data: StrapiImage[] };

    if (Array.isArray(attrs.images)) {

      imagesData = { data: attrs.images };
    } else if (attrs.images && (attrs.images as any).data) {

      imagesData = attrs.images as { data: StrapiImage[] };
    } else {

      imagesData = { data: [] };
    }

    console.log('✅ Producto normalizado (con attributes):', {
      id: product.id,
      imagesCount: imagesData.data.length
    });

    return {
      id: product.id,
      documentId: product.documentId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      publishedAt: product.publishedAt,
      attributes: {
        name: attrs.name,
        description: attrs.description,
        price: attrs.price,
        discount: attrs.discount,
        finalPrice: parseFloat(finalPrice.toFixed(2)),
        stock: attrs.stock,
        specifications: attrs.specifications,
        isActive: attrs.isActive,
        images: imagesData, 
        category: attrs.category,
        brand: attrs.brand,
        createdAt: attrs.createdAt,
        updatedAt: attrs.updatedAt,
        publishedAt: attrs.publishedAt,
      }
    };
  }


  const finalPrice = product.finalPrice ||
                     (product.discount && product.discount > 0
                       ? (product.price || 0) * (1 - (product.discount || 0) / 100)
                       : product.price || 0);


  let imagesData: { data: StrapiImage[] };
  if (Array.isArray(product.images)) {
    imagesData = { data: product.images };
  } else if (product.images && (product.images as any).data) {
    imagesData = product.images as { data: StrapiImage[] };
  } else {
    imagesData = { data: [] };
  }


  let categoryData: { data: Category | null };
  if ((product.category as any)?.data) {
    categoryData = product.category as { data: Category };
  } else if (product.category) {
    categoryData = { data: product.category as Category };
  } else {
    categoryData = { data: null };
  }

  let brandData: { data: Brand | null };
  if ((product.brand as any)?.data) {
    brandData = product.brand as { data: Brand };
  } else if (product.brand) {
    brandData = { data: product.brand as Brand };
  } else {
    brandData = { data: null };
  }

  console.log('✅ Producto normalizado (sin attributes):', {
    id: product.id,
    imagesCount: imagesData.data.length
  });

  return {
    id: product.id,
    documentId: product.documentId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    publishedAt: product.publishedAt,
    attributes: {
      name: product.name || 'Producto sin nombre',
      description: product.description || '',
      price: product.price || 0,
      discount: product.discount || 0,
      finalPrice: parseFloat(finalPrice.toFixed(2)),
      stock: product.stock || 0,
      specifications: product.specifications || null,
      isActive: product.isActive !== undefined ? product.isActive : true,
      images: imagesData,
      category: categoryData,
      brand: brandData,
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
      publishedAt: product.publishedAt || new Date().toISOString(),
    }
  };
}


export function hasStock(product: Product): boolean {
  if (hasProductAttributes(product)) {
    return product.attributes.stock > 0;
  }
  return (product.stock || 0) > 0;
}


export function hasDiscount(product: Product): boolean {
  if (hasProductAttributes(product)) {
    return product.attributes.discount > 0;
  }
  return (product.discount || 0) > 0;
}


export function getProductBrand(product: Product): { data: Brand | null } {
  if (!product) return { data: null };

  if (hasProductAttributes(product)) {
    return product.attributes.brand || { data: null };
  }

  if (product.brand && typeof product.brand === 'object' && 'data' in product.brand) {
    return product.brand;
  }

  return { data: product.brand || null };
}


export function getProductCategory(product: Product): { data: Category | null } {
  if (hasProductAttributes(product)) {
    return product.attributes.category || { data: null };
  }
  if (product.category && 'data' in product.category) {
    return product.category;
  }
  return { data: product.category || null };
}

export function getProductSpecifications(product: Product): Record<string, any> | null {
  if (hasProductAttributes(product)) {
    return product.attributes.specifications || null;
  }
  return product.specifications || null;
}