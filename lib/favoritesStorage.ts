import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from './types'; // 确保你有定义 Book 类型

const FAVORITES_KEY = 'favorites';

export const saveFavorite = async (book: Book) => {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = stored ? JSON.parse(stored) : [];
    const alreadyExists = favorites.some((b: Book) => b.id === book.id);
    if (!alreadyExists) {
      favorites.push(book);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (err) {
    console.error('Error saving favorite', err);
  }
};

export const removeFavorite = async (bookId: string) => {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = stored ? JSON.parse(stored) : [];
    const updated = favorites.filter((b: Book) => b.id !== bookId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error removing favorite', err);
  }
};

export const getFavorites = async (): Promise<Book[]> => {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Error getting favorites', err);
    return [];
  }
};
