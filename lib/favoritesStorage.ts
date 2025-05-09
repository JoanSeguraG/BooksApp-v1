// En lib/favoritesStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites_books';

export async function getFavorites() {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json != null ? JSON.parse(json) : [];
}

export async function addFavorite(book: any) {
  const favorites = await getFavorites();
  const exists = favorites.some((fav: any) => fav.id === book.id);
  if (!exists) {
    const updated = [...favorites, book];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }
}


export async function removeFavorite(bookId: string) {
  const favorites = await getFavorites();
  const updated = favorites.filter((book: any) => book.id !== bookId);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export async function isBookFavorite(bookId: string) {
  const favorites = await getFavorites();
  return favorites.some((book: any) => book.id === bookId);
}