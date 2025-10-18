const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Este archivo de configuración de Metro nos permite definir "alias" de rutas.
config.resolver.extraNodeModules = {
  '@': `${__dirname}/app`,
};

module.exports = config;