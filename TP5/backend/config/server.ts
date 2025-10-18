export default ({ env }) => ({
  host: env('HOST', '192.168.0.217'), // Cambiar a tu IP
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('PUBLIC_URL', 'http://192.168.0.217:1337'), // Agregar esta línea
});