import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import { addFavorite } from '../lib/favoritesStorage';

export default function BookDetailScreen({ route }) {
  const { book } = route.params;
  const volume = book.volumeInfo;

  const bookData = {
    id: book.id,
    title: volume.title,
    description: volume.description || 'Sin descripción',
    year: volume.publishedDate?.substring(0, 4) || 'Desconocido',
    image: volume.imageLinks?.thumbnail || '',
  };

  const handleAddToFavorites = async () => {
    await addFavorite(bookData);
    alert('Libro añadido a favoritos!');
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>{bookData.title}</Text>
      <Image source={{ uri: bookData.image }} style={styles.image} />

      <Text style={styles.label}>Autor(es):</Text>
      <Text style={styles.text}>{volume.authors?.join(', ') || 'Desconocido'}</Text>

      <Text style={styles.label}>Año:</Text>
      <Text style={styles.text}>{bookData.year}</Text>

      <Text style={styles.label}>Descripción:</Text>
      <Text style={styles.text}>{bookData.description}</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Añadir a favoritos" onPress={handleAddToFavorites} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginVertical: 20,
    borderRadius: 10
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15
  },
  text: {
    textAlign: 'left',
    fontSize: 14
  }
});
