// favoritesStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types'; // Asegúrate de que el tipo Book esté bien definido

// Función para obtener los favoritos desde AsyncStorage
export const getFavorites = async (): Promise<Book[]> => {
  try {
    const favorites = await AsyncStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];  // Si no hay favoritos, devuelve un array vacío
  } catch (error) {
    console.error('Error al obtener los favoritos:', error);
    return [];  // Si ocurre un error, también devuelve un array vacío
  }
};

// Función para añadir un libro a los favoritos
export const addFavorite = async (book: Book) => {
  try {
    const currentFavorites = await getFavorites();  // Obtiene los favoritos actuales
    currentFavorites.push(book);  // Añade el nuevo libro a la lista
    await AsyncStorage.setItem('favorites', JSON.stringify(currentFavorites));  // Guarda la lista actualizada en AsyncStorage
  } catch (error) {
    console.error('Error al añadir favorito:', error);
  }
};

// Función para eliminar un libro de los favoritos
export const removeFavorite = async (bookId: string) => {
  try {
    const currentFavorites = await getFavorites();
    const updatedFavorites = currentFavorites.filter((book: Book) => book.id !== bookId);  // Elimina el libro de la lista
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));  // Guarda la lista actualizada
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
  }
};
