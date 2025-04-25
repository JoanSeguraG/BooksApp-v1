import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../lib/types';

type BookDetailRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;

export default function BookDetailScreen() {
  const route = useRoute<BookDetailRouteProp>();
  const { book } = route.params;
  const volume = book.volumeInfo;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: volume.imageLinks?.thumbnail }}
        style={styles.thumbnail}
      />
      <Text style={styles.title}>{volume.title}</Text>
      <Text style={styles.authors}>{volume.authors?.join(', ')}</Text>
      <Text style={styles.description}>{volume.description}</Text>
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
    textAlign: 'justify'
  }
});
