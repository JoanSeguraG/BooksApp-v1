import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, Button, Alert,
  TextInput, TouchableOpacity, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../lib/types'; // Ajusta la ruta según tu estructura
import { addFavorite } from '../lib/favoritesStorage';
import { supabase } from '../lib/supabase';
import { searchBooks } from '../components/Api';


type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [booksByCategory, setBooksByCategory] = useState<Record<string, any[]>>({});
  

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
      const results: Record<string, any[]> = {};
      for (const cat of categories) {
        const data = await searchBooks(cat.query);
        results[cat.title] = data.slice(0, 5);
      }
      setBooksByCategory(results);
    };

    fetchBooksByCategory();
  }, []);

  const handleSearch = () => {
    if (query.trim() !== '') {
      navigation.navigate('SearchResults', { query });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }]  // Asegúrate de que 'Auth' también esté registrado en el AppNavigator
      });
    }
  };

  const handleAddToFavorites = async (bookData: any) => {
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

      {Object.entries(booksByCategory).map(([title, items]) => (
        <View key={title} style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {items.map((item) => {
              const volume = item.volumeInfo;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => navigation.navigate('BookDetail', { book: item })}  // Verifica que 'BookDetail' esté registrado
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

      <View style={{ marginTop: 30 }}>
        <Button title="Ir a Favoritos" onPress={() => navigation.navigate('FavoritesScreen')} />  {/* Verifica que 'Favorites' esté registrado */}
        <Button title="Ir al Perfil" onPress={() => navigation.navigate('Profile')} />  {/* Verifica que 'Profile' esté registrado */}
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
  }
});
