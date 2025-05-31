// ✅ NewHomeScreen.tsx — shows recommended and new release books in fixed 4x5 layout with user info

import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../lib/types';
import { searchBooks } from '../components/Api';
import { supabase } from '../lib/supabase';

export default function NewHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const rec = await searchBooks('best seller');
      const recent = await searchBooks('new release');
      setRecommendedBooks(rec.slice(0, 12)); // 4 columns x 3 rows
      setNewReleases(recent.slice(0, 12)); // 4 columns x 3 rows

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (user) {
        const { data } = await supabase.from('users').select('username').eq('id', user.id).single();
        if (data?.username) setUsername(data.username);
      }
    };
    fetchData();
  }, []);

  const renderBookGrid = (title: string, books: any[]) => (
    <View style={{ marginBottom: 30, backgroundColor: '#000' }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.gridContainer}>
        {books.map((book) => {
          const volume = book.volumeInfo;
          return (
            <TouchableOpacity
              key={book.id}
              style={styles.bookCard}
              onPress={() => navigation.navigate('BookDetail', { book })}
            >
              <Image
                source={{ uri: volume.imageLinks?.thumbnail }}
                style={styles.thumbnail}
              />
              <Text numberOfLines={1} style={styles.bookTitle}>{volume.title}</Text>
              {volume.authors && (
                <Text numberOfLines={1} style={styles.bookAuthor}>{volume.authors[0]}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.header}>Bienvenido, <Text style={styles.highlight}>{username}</Text> 👋</Text>
          <Image source={require('../assets/avatar.jpg')} style={styles.avatar} />
        </View>
        {renderBookGrid(' Recomendados', recommendedBooks)}
        {renderBookGrid(' Nuevos lanzamientos', newReleases)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 60,
    backgroundColor: '#000000',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  highlight: {
    color: '#FFA726',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginTop: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  bookCard: {
    width: 100,
    marginRight: 12,
    marginBottom: 20,
  },
  thumbnail: {
    width: 100,
    height: 150,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  bookTitle: {
    fontSize: 12,
    marginTop: 5,
    color: '#fff',
    textAlign: 'center',
  },
  bookAuthor: {
    fontSize: 10,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 2,
  },
});