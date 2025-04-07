import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  image: string;
}

interface Props {
  route: any;
  navigation: any;
}

const userId = 'usuario_ejemplo_123'; // ← Aquí deberías usar el ID real del usuario autenticado

const BookDetailScreen: React.FC<Props> = ({ route }) => {
  const { book }: { book: Book } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkIfFavorite();
  }, []);

  const checkIfFavorite = async () => {
    const { data, error } = await supabase
      .from('favoritos')
      .select('*')
      .eq('user_id', userId)
      .eq('book_id', book.id)
      .single();

    if (data) setIsFavorite(true);
    else setIsFavorite(false);
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      // Eliminar de favoritos
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('user_id', userId)
        .eq('book_id', book.id);

      if (error) Alert.alert('Error al quitar de favoritos');
      else {
        setIsFavorite(false);
        Alert.alert('Eliminado de favoritos');
      }
    } else {
      // Añadir a favoritos
      const { error } = await supabase.from('favoritos').insert([
        {
          user_id: userId,
          book_id: book.id,
        },
      ]);

      if (error) Alert.alert('Error al añadir a favoritos');
      else {
        setIsFavorite(true);
        Alert.alert('Añadido a favoritos');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: book.image }} style={styles.image} />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>Autor: {book.author}</Text>
      <Text style={styles.description}>{book.description}</Text>

      <Button
        title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        onPress={toggleFavorite}
        color={isFavorite ? 'red' : 'green'}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 220,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  author: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'justify',
    marginBottom: 20,
  },
});

export default BookDetailScreen;
