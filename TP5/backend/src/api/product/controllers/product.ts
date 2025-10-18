// backend/src/api/product/controllers/product.ts
'use strict';

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::product.product', ({ strapi }) => ({

  async find(ctx) {
    try {
      const { sort, filters } = ctx.query;

      // Forzamos filtros para mostrar solo productos activos y con stock.
      const baseFilters = {
        isActive: true,
        stock: { $gt: 0 },
        publishedAt: { $notNull: true }
      };

      const mergedFilters = (filters && typeof filters === 'object')
        ? { ...filters, ...baseFilters }
        : baseFilters;

      const query = {
        ...ctx.query,
        // Incluimos relaciones como categoría, marca e imágenes en la consulta.
        populate: {
          category: { fields: ['name'] },
          brand: { fields: ['name'] },
          images: true,
        },
        filters: mergedFilters,
        sort: sort || 'name:asc',
      };

      const { results, pagination } = await strapi.service('api::product.product').find(query);

      // Normalizamos la data y calculamos el precio final en el backend por seguridad.
      const normalized = results.map((product: any) => ({
        id: product.id,
        attributes: {
          name: product.name,
          description: product.description,
          price: product.price,
          discount: product.discount,
          finalPrice:
            product.discount > 0
              ? product.price * (1 - product.discount / 100)
              : product.price,
          stock: product.stock,
          specifications: product.specifications,
          isActive: product.isActive,
          images: product.images,
          category: product.category ? { data: product.category } : { data: null },
          brand: product.brand ? { data: product.brand } : { data: null },
        },
      }));

      return {
        data: normalized,
        meta: { pagination },
      };
    } catch (error) {
      console.error('❌ Error en product.find:', error);
      return ctx.internalServerError('Error interno del servidor');
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;

      // Buscamos un producto por ID, incluyendo también sus relaciones.
      const product = await strapi.entityService.findOne('api::product.product', Number(id), {
        populate: {
          category: { fields: ['name'] },
          brand: { fields: ['name'] },
          images: true,
        },
      });

      // Validamos que el producto exista y se pueda vender (tenga stock).
      if (!product || product.stock <= 0) {
        return ctx.notFound('Producto no encontrado o sin stock');
      }
      
      // Devolvemos el producto con una estructura de datos consistente.
      const normalizedProduct = {
        id: product.id,
        attributes: {
          name: product.name,
          description: product.description,
          price: product.price,
          discount: product.discount,
          finalPrice:
            product.discount > 0
              ? product.price * (1 - product.discount / 100)
              : product.price,
          stock: product.stock,
          specifications: product.specifications,
          isActive: product.isActive,
          // @ts-ignore
          images: product.images || [],
          // @ts-ignore
          category: product.category ? { data: product.category } : { data: null },
          // @ts-ignore
          brand: product.brand ? { data: product.brand } : { data: null },
        },
      };

      return { data: normalizedProduct };
    } catch (error) {
      console.error('❌ Error en findOne:', error);
      return ctx.internalServerError('Error interno del servidor');
    }
  },

}));