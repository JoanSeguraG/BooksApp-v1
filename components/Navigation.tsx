import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SignUp from '../screens/SignUp'; // Asegúrate de importar SignUp

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoritos' }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Registrarse' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
