import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  ScrollView, StyleSheet, TextInput
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../lib/types';
import { searchBooks } from '../components/Api';
import { Ionicons } from '@expo/vector-icons';

type SearchResultsScreenRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;
type SearchResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchResults'>;

export default function SearchResultsScreen() {
  const route = useRoute<SearchResultsScreenRouteProp>();
  const navigation = useNavigation<SearchResultsScreenNavigationProp>();

  const initialQuery = route?.params?.query || '';
  const [query, setQuery] = useState(initialQuery);
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const results = await searchBooks(query);
      setBooks(results);
    };
    fetchData();
  }, [query]);

  const handleSearch = () => {
    if (query.trim() !== '') {
      navigation.navigate('SearchResults', { query });
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000' }} contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FFA726" />
      </TouchableOpacity>

      <TextInput
        placeholder="Buscar libros..."
        placeholderTextColor="#aaa"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Buscar</Text>
      </TouchableOpacity>

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
    padding: 20,
    paddingBottom: 40
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFA726',
    padding: 8,
    marginBottom: 10,
    borderRadius: 6,
    color: '#fff'
  },
  searchButton: {
    backgroundColor: '#FFA726',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20
  },
  searchButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff'
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
    flex: 1,
    color: '#fff'
  }
});
