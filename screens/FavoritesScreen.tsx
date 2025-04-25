import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getFavorites, removeFavorite } from '../lib/favoritesStorage'; 
import { Book } from '../lib/types'; 
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Book[]>([]);

  const loadFavorites = async () => {
    const data = await getFavorites();
    setFavorites(data as Book[]);
  };

  const handleRemove = async (id: string) => {
    await removeFavorite(id);
    loadFavorites(); 
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.item}>
      {item.volumeInfo.imageLinks?.thumbnail ? (
        <Image
          source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
          style={styles.image}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="book-outline" size={32} color="#ccc" />
        </View>
      )}
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>{item.volumeInfo.title}</Text>
        {item.volumeInfo.authors && (
          <Text numberOfLines={1} style={styles.authors}>
            {item.volumeInfo.authors.join(', ')}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={() => handleRemove(item.id)}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mi Biblioteca</Text>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay libros favoritos aún.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 100,
    borderRadius: 6,
    marginRight: 12,
  },
  placeholderImage: {
    width: 70,
    height: 100,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  authors: {
    color: '#ccc',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});
