import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../lib/types';
import { searchBooks } from '../components/Api';

type SearchResultsScreenRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;
type SearchResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchResults'>;

export default function SearchResultsScreen() {
  const route = useRoute<SearchResultsScreenRouteProp>();
  const navigation = useNavigation<SearchResultsScreenNavigationProp>();

  const query = route?.params?.query || '';
  

  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const results = await searchBooks(query);
      setBooks(results);
    };
    fetchData();
  }, [query]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resultados para: "{query}"</Text>
      {books.map((book) => {
        const volume = book.volumeInfo;
        return (
          <TouchableOpacity
            key={book.id}
            style={styles.bookItem}
            onPress={() => navigation.navigate('BookDetail', { book })}
          >
            <Image
              source={{ uri: volume.imageLinks?.thumbnail }}
              style={styles.thumbnail}
            />
            <Text numberOfLines={1} style={styles.bookTitle}>{volume.title}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  bookItem: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbnail: {
    width: 60,
    height: 90,
    marginRight: 10,
    borderRadius: 4
  },
  bookTitle: {
    fontSize: 16,
    flex: 1
  }
});
