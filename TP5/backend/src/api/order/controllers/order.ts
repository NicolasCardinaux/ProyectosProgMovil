'use strict';

/**
 * order controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { user } = ctx.state;
      const { items, paymentMethod, shippingAddress } = ctx.request.body.data;

      // Validar que el usuario esté autenticado.
      if (!user) {
        return ctx.unauthorized('Authentication required');
      }

      // Verificar que haya stock para cada producto.
      for (const item of items) {
        const product = await strapi.entityService.findOne('api::product.product', item.productId, {
          fields: ['name', 'stock']
        });

        if (!product || product.stock < item.quantity) {
          return ctx.badRequest(`Stock insuficiente para: ${product?.name || 'ID ' + item.productId}`);
        }
      }

      // Calcular el total de forma segura en el backend.
      let total = 0;
      for (const item of items) {
        const product = await strapi.entityService.findOne('api::product.product', item.productId, {
          fields: ['price', 'discount']
        });

        const finalPrice = product.discount > 0
          ? product.price * (1 - product.discount / 100)
          : product.price;
        total += finalPrice * item.quantity;
      }
      total = parseFloat(total.toFixed(2));

      // Crear la orden en la base de datos.
      const order = await strapi.entityService.create('api::order.order', {
        data: {
          orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          user: user.id,
          items,
          total,
          status: 'pending',
          paymentMethod,
          shippingAddress,
          publishedAt: new Date(),
        },
      });

      // Actualizar el stock y las ventas de los productos.
      for (const item of items) {
        const product = await strapi.entityService.findOne('api::product.product', item.productId, {
          fields: ['stock', 'salesCount']
        });

        if (product) {
          const newStock = product.stock - item.quantity;
          const newSalesCount = (product.salesCount || 0) + item.quantity;

          await strapi.entityService.update('api::product.product', item.productId, {
            data: {
              stock: newStock,
              salesCount: newSalesCount,
            },
          });
        }
      }

      const sanitizedOrder = await this.sanitizeOutput(order, ctx);
      return this.transformResponse(sanitizedOrder);

    } catch (error) {
      strapi.log.error('❌ Error en el controlador order.create:', error);
      ctx.throw(500, error);
    }
  },

  async find(ctx) {
    try {
      const { user } = ctx.state;
      if (!user) {
        return ctx.unauthorized('Authentication required');
      }
      
      // La función 'super.find' de Strapi ya filtra por el usuario autenticado.
      const { data, meta } = await super.find(ctx);
      return { data, meta };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}));