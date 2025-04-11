import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITE_BOOKS';

export async function getFavorites() {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveFavorites(favs) {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export async function addFavorite(book) {
  const favs = await getFavorites();
  const exists = favs.some(b => b.id === book.id);
  if (!exists) {
    const updated = [...favs, book];
    await saveFavorites(updated);
  }
}

export async function removeFavorite(bookId) {
  const favs = await getFavorites();
  const updated = favs.filter(b => b.id !== bookId);
  await saveFavorites(updated);
}
