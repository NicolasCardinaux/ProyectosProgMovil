import AsyncStorage from '@react-native-async-storage/async-storage';
import { conferences as initialConferences } from '../data/conferences';

const STORAGE_KEY = '@conferences_data';


export const getConferences = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (jsonValue !== null) {
      console.log("Datos cargados desde AsyncStorage.");
      return JSON.parse(jsonValue);
    } else {
      console.log("No hay datos locales. Inicializando y guardando datos...");
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialConferences));
      return initialConferences;
    }
  } catch (e) {
    console.error("Error al obtener datos de las conferencias", e);
    return initialConferences;
  }
};