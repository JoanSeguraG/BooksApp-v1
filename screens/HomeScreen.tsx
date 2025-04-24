import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, Button, Alert,
  TextInput, TouchableOpacity, ScrollView
} from 'react-native';
import { addFavorite } from '../lib/favoritesStorage';
import { supabase } from '../lib/supabase';
import { searchBooks } from '../components/Api';

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [booksByCategory, setBooksByCategory] = useState({});

  const categories = [
    { title: 'Ficción', query: 'fiction' },
    { title: 'Ciencia ficción', query: 'science fiction' },
    { title: 'Misterio', query: 'mystery' },
    { title: 'Romance', query: 'romance' }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { username } = session.user.user_metadata;
        setUsername(username);
      }
    };
    fetchUser();

    const fetchBooksByCategory = async () => {
      const results = {};
      for (const cat of categories) {
        const data = await searchBooks(cat.query);
        results[cat.title] = data.slice(0, 5);
      }
      setBooksByCategory(results);
    };

    fetchBooksByCategory();
  }, []);

  const handleSearch = async () => {
    const results = await searchBooks(query);
    setBooks(results);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }]
      });
    }
  };

  const handleAddToFavorites = async (bookData) => {
    await addFavorite(bookData);
    alert('Libro añadido a favoritos!');
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>¡Hola, {username}!</Text>

      <TextInput
        placeholder="Buscar libros..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button title="Buscar" onPress={handleSearch} />

      {books.length > 0 && (
        <View style={styles.searchResults}>
          <Text style={styles.sectionTitle}>Resultados:</Text>
          {books.map((item) => {
            const volume = item.volumeInfo;
            const bookData = {
              id: item.id,
              title: volume.title,
              description: volume.description || 'Sin descripción',
              year: volume.publishedDate?.substring(0, 4) || 'Desconocido',
              image: volume.imageLinks?.thumbnail || ''
            };

            return (
              <View key={item.id} style={styles.resultItem}>
                <Image source={{ uri: bookData.image }} style={styles.resultImage} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.title}>{bookData.title}</Text>
                  <Text numberOfLines={2}>{bookData.description}</Text>
                  <Button title="Añadir a favoritos" onPress={() => handleAddToFavorites(bookData)} />
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Libros por categoría */}
      {Object.entries(booksByCategory).map(([title, items]) => (
        <View key={title} style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {items.map((item) => {
              const volume = item.volumeInfo;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => navigation.navigate('BookDetail', { book: item })}
                  style={styles.bookItem}
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
        </View>
      ))}

      {/* Navegación */}
      <View style={{ marginTop: 30 }}>
        <Button title="Ir a Favoritos" onPress={() => navigation.navigate('FavoritesScreen')} />
        <Button title="Ir al Perfil" onPress={() => navigation.navigate('Profile')} />
        <Button title="Cerrar sesión" onPress={handleLogout} color="red" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 6
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10
  },
  bookItem: {
    marginRight: 12,
    width: 100
  },
  thumbnail: {
    width: 100,
    height: 150,
    borderRadius: 6
  },
  bookTitle: {
    fontSize: 12,
    marginTop: 5
  },
  searchResults: {
    marginTop: 20
  },
  resultItem: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center'
  },
  resultImage: {
    width: 60,
    height: 90,
    borderRadius: 4
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  }
});
