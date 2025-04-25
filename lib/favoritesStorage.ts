import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types';

const FAVORITES_KEY = 'FAVORITE_BOOKS';

export const getFavorites = async (): Promise<Book[]> => {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveFavorites = async (favorites: Book[]): Promise<void> => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const addFavorite = async (book: Book): Promise<void> => {
  const favorites = await getFavorites();
  const exists = favorites.some(fav => fav.id === book.id);
  if (!exists) {
    await saveFavorites([...favorites, book]);
  }
};

export const removeFavorite = async (id: string): Promise<void> => {
  const favorites = await getFavorites();
  const updated = favorites.filter(book => book.id !== id);
  await saveFavorites(updated);
};

export const isFavorite = async (id: string): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.some(book => book.id === id);
};
