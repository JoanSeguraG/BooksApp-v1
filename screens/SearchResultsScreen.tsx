import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { searchBooks } from '../components/Api'; // Asegúrate de tener esta función de búsqueda

const SearchResultsScreen = ({ route }) => {
  const { query } = route.params; // Asegúrate de que query se recibe correctamente

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const results = await searchBooks(query);
      setBooks(results);
    };
    fetchBooks();
  }, [query]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados de búsqueda para "{query}"</Text>
      <ScrollView>
        {books.map((book) => (
          <View key={book.id} style={styles.bookItem}>
            <Text>{book.volumeInfo.title}</Text>
            {/* Aquí puedes mostrar más detalles sobre el libro */}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bookItem: {
    marginVertical: 10,
  },
});

export default SearchResultsScreen;
