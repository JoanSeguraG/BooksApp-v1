import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Book {
  id: string;
  title: string;
  description: string;
  year: string;
  image: string;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadFavorites = async () => {
      const jsonValue = await AsyncStorage.getItem('favorites');
      if (jsonValue) {
        setFavorites(JSON.parse(jsonValue));
      }
    };
    loadFavorites();
  }, [isFocused]);

  const removeFromFavorites = async (id: string) => {
    const newFavorites = favorites.filter(book => book.id !== id);
    setFavorites(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.year}>{item.year}</Text>
        <TouchableOpacity onPress={() => removeFromFavorites(item.id)} style={styles.removeButton}>
          <Text style={styles.removeText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay libros favoritos aún.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 140,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginVertical: 4,
  },
  year: {
    fontSize: 12,
    color: 'gray',
  },
  removeButton: {
    marginTop: 10,
    padding: 6,
    backgroundColor: '#f55',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  removeText: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
