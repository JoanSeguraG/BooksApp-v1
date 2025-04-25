import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { addFavorite, isFavorite, removeFavorite } from '../lib/favoritesStorage';
import { Book } from '../types';

type BookDetailRouteProp = RouteProp<{ params: { book: Book } }, 'params'>;

export default function BookDetailScreen() {
  const route = useRoute<BookDetailRouteProp>();
  const { book } = route.params;
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      const fav = await isFavorite(book.id);
      setFavorite(fav);
    };
    checkFavorite();
  }, []);

  const toggleFavorite = async () => {
    if (favorite) {
      await removeFavorite(book.id);
    } else {
      await addFavorite(book);
    }
    setFavorite(!favorite);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: book.cover }} style={styles.image} />
      <Text style={styles.title}>{book.title}</Text>
      <Text>{book.year}</Text>
      <Text style={styles.description}>{book.description}</Text>
      <TouchableOpacity onPress={toggleFavorite} style={styles.button}>
        <Text style={styles.buttonText}>
          {favorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 300,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
  },
});
