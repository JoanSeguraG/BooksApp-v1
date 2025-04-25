import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getFavorites } from '../lib/favoritesStorage';  // Asegúrate de que el path sea correcto
import { Book } from '../lib/types';  // Asegúrate de que 'Book' esté correctamente definido
import { useNavigation } from '@react-navigation/native';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<Book[]>([]);

  // Cargar los favoritos desde AsyncStorage cuando el componente se monta
  useEffect(() => {
    const fetchFavorites = async () => {
      const storedFavorites = await getFavorites();
      setFavorites(storedFavorites);
    };
    fetchFavorites();
  }, []);

  // Función para renderizar cada libro favorito
  const renderItem = ({ item }: { item: Book }) => {
    return (
      <TouchableOpacity style={styles.bookContainer}>
        <Image
          source={{ uri: item.volumeInfo?.imageLinks?.thumbnail }}
          style={styles.bookImage}
        />
        <Text style={styles.bookTitle}>{item.volumeInfo?.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tus Favoritos</Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bookContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  bookImage: {
    width: 100,
    height: 150,
  },
  bookTitle: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FavoritesScreen;
