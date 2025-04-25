import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import Profile from '../screens/Profile';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import AuthScreen from '../components/Auth'; // Login/Register

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack para la pantalla principal (Home)
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="BookDetail" component={BookDetailScreen} />
    <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
  </Stack.Navigator>
);

const Tabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Inicio" component={HomeStack} />
    <Tab.Screen name="Favoritos" component={FavoritesScreen} />
    <Tab.Screen name="Perfil" component={Profile} />
  </Tab.Navigator>
);

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="HomeTabs" component={Tabs} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
