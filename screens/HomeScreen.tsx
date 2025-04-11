import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert } from 'react-native';
import { addFavorite } from '../lib/favoritesStorage';
import { supabase } from '../lib/supabase';

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { username } = session.user.user_metadata;
        setUsername(username);
      }
    };
    fetchUser();
  }, []);

  const book = {
    id: '1',
    title: 'Al final del túnel',
    description: 'Un thriller lleno de misterio.',
    year: '2024',
    image: 'https://m.media-amazon.com/images/I/51WtxZzGh+L.jpg'
  };

  const handleAddToFavorites = async () => {
    await addFavorite(book);
    alert('Libro añadido a favoritos!');
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

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>¡Hola, {username}!</Text>

      <Image source={{ uri: book.image }} style={styles.image} />
      <Text style={styles.title}>{book.title}</Text>
      <Text>{book.description}</Text>
      <Text>{book.year}</Text>

      <Button title="Añadir a favoritos" onPress={handleAddToFavorites} />

      <View style={{ marginTop: 20 }}>
        <Button title="Ir a Favoritos" onPress={() => navigation.navigate('Favorites')} />
      </View>

      {/* Agregar el botón para navegar al perfil */}
      <View style={{ marginTop: 20 }}>
        <Button title="Ir al Perfil" onPress={() => navigation.navigate('Profile')} />
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Cerrar sesión" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center'
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  image: {
    width: 120,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5
  }
});
