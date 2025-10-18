'use strict';

/**
 * product router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::product.product', {
  config: {
    // Hacemos públicas las rutas para ver la lista de productos y el detalle de uno,
    // así cualquiera puede verlos sin necesidad de estar registrado.
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});