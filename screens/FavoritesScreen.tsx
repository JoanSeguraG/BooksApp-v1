import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const mockBooks = [
  { id: '1', title: 'El libro perdido', author: 'A. Autor' },
  { id: '2', title: 'La sombra del lector', author: 'B. Escritora' },
  { id: '3', title: 'Tiempos de tinta', author: 'C. Narrador' },
];

const FavoritesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Libros Favoritos</Text>
      <FlatList
        data={mockBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>por {item.author}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  bookItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  bookTitle: {
    fontSize: 18,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
});