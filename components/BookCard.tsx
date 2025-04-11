import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';

interface Book {
  id: string;
  title: string;
  description: string;
  year: string;
  coverUrl: string;
}

interface Props {
  book: Book;
  onDelete: () => void;
}

export default function BookCard({ book, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: book.coverUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.description}>{book.description}</Text>
        <Text style={styles.year}>{book.year}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Icon name="trash" type="font-awesome" color="#ffcc00" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2f2f2f',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 90,
    borderRadius: 6,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  description: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
  year: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
  },
  deleteButton: {
    paddingLeft: 10,
  },
});