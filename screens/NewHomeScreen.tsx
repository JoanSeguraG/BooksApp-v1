// ✅ NewHomeScreen.tsx — shows recommended and new release books in two-column layout

import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../lib/types';
import { searchBooks } from '../components/Api';

export default function NewHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const rec = await searchBooks('best seller');
      const recent = await searchBooks('new release');
      setRecommendedBooks(rec.slice(0, 6));
      setNewReleases(recent.slice(0, 6));
    };
    fetchData();
  }, []);

  const renderBookGrid = (title: string, books: any[]) => (
    <View style={{ marginBottom: 30 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.gridContainer}>
        {books.map((book) => {
          const volume = book.volumeInfo;
          return (
            <TouchableOpacity
              key={book.id}
              style={styles.bookCard}
              onPress={() => navigation.navigate('BookDetail', { book: volume })}
            >
              <Image
                source={{ uri: volume.imageLinks?.thumbnail }}
                style={styles.thumbnail}
              />
              <Text numberOfLines={1} style={styles.bookTitle}>{volume.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Bienvenido de nuevo 👋</Text>
      {renderBookGrid('📚 Recomendados', recommendedBooks)}
      {renderBookGrid('🆕 Nuevos lanzamientos', newReleases)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#000',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bookCard: {
    width: '48%',
    marginBottom: 20,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  bookTitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 6,
    textAlign: 'center',
  },
});
