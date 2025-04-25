import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getFavorites, removeFavorite } from '../lib/favoritesStorage';
import { Book } from '../types';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Book[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const favs = await getFavorites();
      setFavorites(favs);
    };
    fetchFavorites();
  }, []);

  const handleRemove = async (bookId: string) => {
    await removeFavorite(bookId);
    const updatedFavorites = await getFavorites();
    setFavorites(updatedFavorites);
  };

  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.cover }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>{item.year}</Text>
        <Text numberOfLines={2}>{item.description}</Text>
        <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.button}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 100,
    height: 150,
  },
  info: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f44336',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});