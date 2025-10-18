'use strict';

/**
 * product service
 */

import { factories } from '@strapi/strapi';

interface ProductFilters {
  $or?: Array<{ [key: string]: any }>;
  category?: { id: number };
  brand?: { id: number };
  isActive?: boolean;
  publishedAt?: { $notNull: boolean };
}

export default factories.createCoreService('api::product.product', ({ strapi }) => ({
  /**
   * Implementa la lógica para la barra de búsqueda del sitio.
   */
  async search(searchTerm: string) {
    const filters: ProductFilters = {
      $or: [
        { name: { $containsi: searchTerm } },
        { description: { $containsi:searchTerm } },
      ],
      isActive: true,
      publishedAt: { $notNull: true }
    };

    const results = await strapi.entityService.findMany('api::product.product', {
      filters,
      populate: ['images', 'category', 'brand'],
    });
    return results;
  },
  
  /**
   * Filtra y devuelve todos los productos de una categoría.
   */
  async findByCategory(categoryId: number) {
    const filters: ProductFilters = {
      category: { id: categoryId },
      isActive: true,
      publishedAt: { $notNull: true }
    };

    const results = await strapi.entityService.findMany('api::product.product', {
      filters,
      populate: ['images', 'category', 'brand'],
    });
    return results;
  },

  /**
   * Filtra y devuelve todos los productos de una marca.
   */
  async findByBrand(brandId: number) {
    const filters: ProductFilters = {
      brand: { id: brandId },
      isActive: true,
      publishedAt: { $notNull: true }
    };

    const results = await strapi.entityService.findMany('api::product.product', {
      filters,
      populate: ['images', 'category', 'brand'],
    });
    return results;
  },

  /**
   * Busca un producto por su ID y trae toda su información relacionada.
   */
  async findById(id: number) {
    try {
      const product = await strapi.entityService.findOne('api::product.product', id, {
        populate: ['images', 'category', 'brand'],
      });

      return product;
    } catch (error) {
      console.error('Error en servicio findById:', error);
      throw error;
    }
  }
}));