import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../lib/types';
import { addFavorite, removeFavorite, isBookFavorite } from '../lib/favoritesStorage';
import { Ionicons } from '@expo/vector-icons';

type BookDetailRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;

export default function BookDetailScreen() {
  const route = useRoute<BookDetailRouteProp>();
  const { book } = route.params;
  const volume = book.volumeInfo;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      const fav = await isBookFavorite(book.id);
      setIsFavorite(fav);
    };
    checkFavorite();
  }, [book.id]);

  const toggleFavorite = async () => {
    if (isFavorite) {
      await removeFavorite(book.id);
    } else {
      await addFavorite(book);
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: volume.imageLinks?.thumbnail }}
        style={styles.thumbnail}
      />
      <Text style={styles.title}>{volume.title}</Text>
      <Text style={styles.authors}>{volume.authors?.join(', ')}</Text>
      <Text style={styles.description}>{volume.description}</Text>

      <TouchableOpacity style={styles.button} onPress={toggleFavorite}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color="#fff"
        />
        <Text style={styles.buttonText}>
          {isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center'
  },
  thumbnail: {
    width: 150,
    height: 220,
    marginBottom: 20,
    borderRadius: 6
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  authors: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10
  },
  description: {
    fontSize: 14,
    textAlign: 'justify',
    marginBottom: 20
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4E5D78',
    padding: 10,
    borderRadius: 8,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16
  }
});
