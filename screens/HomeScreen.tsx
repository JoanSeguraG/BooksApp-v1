import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { addFavorite } from '../lib/favoritesStorage';

export default function HomeScreen({ navigation }) {
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

  return (
    <View style={styles.container}>
      <Image source={{ uri: book.image }} style={styles.image} />
      <Text style={styles.title}>{book.title}</Text>
      <Text>{book.description}</Text>
      <Text>{book.year}</Text>
      <Button title="Añadir a favoritos" onPress={handleAddToFavorites} />
      <View style={{ marginTop: 20 }}>
        <Button title="Ir a Favoritos" onPress={() => navigation.navigate('Favorites')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center'
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