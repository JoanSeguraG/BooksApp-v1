import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      {/* Aquí añadimos el botón para navegar a la pantalla de favoritos */}
      <Button
        title="Ver Favoritos"
        onPress={() => navigation.navigate('Favorites')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;