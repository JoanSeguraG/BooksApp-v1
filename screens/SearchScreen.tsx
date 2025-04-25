// screens/SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Book } from '../types';
import { addFavorite, removeFavorite, getFavorites } from '../lib/favoritesStorage';
import { Ionicons } from '@expo/vector-icons';

const dummyBooks: Book[] = [
  {
    id: '1',
    title: 'El infinito en un junco',
    description: 'Historia de los libros y cómo cambiaron el mundo.',
    year: '2019',
    cover: 'https://covers.openlibrary.org/b/id/10523365-L.jpg',
  },
  {
    id: '2',
    title: 'Dune',
    description: 'La clásica novela de ciencia ficción de Frank Herbert.',
    year: '1965',
    cover: 'https://covers.openlibrary.org/b/id/11161902-L.jpg',
  },
  // Puedes añadir más aquí
];

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [books, setBooks] = useState<Book[]>(dummyBooks);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const favs = await getFavorites();
      setFavorites(favs);
    };
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (bookId: string) => {
    if (favorites.includes(bookId)) {
      await removeFavorite(bookId);
    } else {
      const book = books.find(b => b.id === bookId);
      if (book) await addFavorite(book);
    }

    const updated = await getFavorites();
    setFavorites(updated);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderBook = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={{
        padding: 12,
        margin: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={() => navigation.navigate('BookDetail', { book: item })}
    >
      <Image
        source={{ uri: item.cover }}
        style={{ width: 60, height: 90, borderRadius: 8, marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
        <Text numberOfLines={2}>{item.description}</Text>
        <Text style={{ color: '#888', marginTop: 4 }}>{item.year}</Text>
      </View>
      <TouchableOpacity onPress={() => handleToggleFavorite(item.id)}>
        <Ionicons
          name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
          size={24}
          color="tomato"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Buscar libros..."
        value={searchText}
        onChangeText={setSearchText}
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          marginBottom: 16,
        }}
      />
      <FlatList
        data={filteredBooks}
        keyExtractor={item => item.id}
        renderItem={renderBook}
        ListEmptyComponent={<Text>No se encontraron libros.</Text>}
      />
    </View>
  );
};

export default SearchScreen;