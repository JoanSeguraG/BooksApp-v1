import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { Book } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../lib/types';

export default function FavoritesScreen() {
  const { session } = useAuth();
  const isFocused = useIsFocused();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id || !isFocused) return;

    const fetchFavorites = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching favorites:', error.message);
        setLoading(false);
        return;
      }

      const books = (data ?? []).map((fav: any) => {
        let bookData;
        try {
          bookData =
            typeof fav.book_data === 'string'
              ? JSON.parse(fav.book_data)
              : fav.book_data;
        } catch (e) {
          console.warn('Error parsing book_data:', e);
          bookData = {};
        }

        return {
          id: fav.book_id,
          volumeInfo: {
            title: bookData?.title || 'Sin título',
            authors: bookData?.authors || [],
            description: bookData?.description || '',
            imageLinks: bookData?.imageLinks || undefined,
          },
        };
      });

      setFavorites(books);
      setLoading(false);
    };

    fetchFavorites();
  }, [session, isFocused]);

  const handleRemove = async (bookId: string) => {
    if (!session?.user?.id) return;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', session.user.id)
      .eq('book_id', bookId);

    if (error) {
      console.error('Error removing favorite:', error.message);
      return;
    }

    setFavorites((prev) => prev.filter((book) => book.id !== bookId));
  };

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#FFA726" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay libros favoritos aún.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity onPress={() => navigation.navigate('BookDetail', { book: item })}>
      <View style={styles.item}>
        {item.volumeInfo.imageLinks?.thumbnail ? (
          <Image
            source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="book-outline" size={32} color="#ccc" />
          </View>
        )}
        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.title}>
            {item.volumeInfo.title}
          </Text>
          {item.volumeInfo.authors && (
            <Text numberOfLines={1} style={styles.authors}>
              {item.volumeInfo.authors.join(', ')}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={() => handleRemove(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#FFA726" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mi Biblioteca</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  header: {
    fontSize: 24,
    color: '#FFA726',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 100,
    borderRadius: 6,
    marginRight: 12,
  },
  placeholderImage: {
    width: 70,
    height: 100,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  authors: {
    color: '#ccc',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});