import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../lib/types';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

type BookDetailRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;

export default function BookDetailScreen() {
  const route = useRoute<BookDetailRouteProp>();
  const navigation = useNavigation();
  const { book } = route.params;
  const volume = book.volumeInfo;

  const { session } = useAuth();
  const userId = session?.user.id;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', book.id)
        .maybeSingle();

      if (error) {
        console.error('Error al verificar favorito:', error.message);
        return;
      }

      setIsFavorite(!!data);
    };

    checkFavorite();
  }, [userId, book.id]);

  const toggleFavorite = async () => {
    if (!userId) {
      Alert.alert('Error', 'Debes iniciar sesión para guardar favoritos.');
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('book_id', book.id);

      if (error) {
        console.error('Error al eliminar favorito:', error.message);
        Alert.alert('Error', 'No se pudo quitar de favoritos');
        return;
      }

      setIsFavorite(false);
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          book_id: book.id,
          book_data: book.volumeInfo,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error al guardar favorito:', error.message);
        Alert.alert('Error', 'No se pudo añadir a favoritos');
        return;
      }

      setIsFavorite(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={28} color="#4E5D78" />
      </TouchableOpacity>

      <Image
        source={{ uri: volume.imageLinks?.thumbnail }}
        style={styles.thumbnail}
      />
      <Text style={styles.title}>{volume.title}</Text>
      <Text style={styles.authors}>{volume.authors?.join(', ')}</Text>
      <Text style={styles.description}>{volume.description}</Text>

      <TouchableOpacity style={styles.button} onPress={toggleFavorite}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color="#fff"
        />
        <Text style={styles.buttonText}>
          {isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  thumbnail: {
    width: 150,
    height: 220,
    marginBottom: 20,
    borderRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  authors: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'justify',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4E5D78',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
});
