import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import EditProfile from '../screens/EditProfile';


const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ title: 'Resultados' }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Detalles del libro' }} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
}
