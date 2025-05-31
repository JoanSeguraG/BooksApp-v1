import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Auth from '../components/Auth';
import SignUp from './SignUp';

import HomeScreen from './HomeScreen'; // Used in Buscar tab
import BookDetailScreen from './BookDetailScreen';
import EditProfile from './EditProfile';
import SearchResultsScreen from './SearchResultsScreen';
import InicioStack from './InicioStack';
import FavoritesStack from './FavoritesStack';
import ProfileStack from './ProfileStack';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
    </Stack.Navigator>
  );
}

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FFA726',       // ← 橙色高亮图标
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#202020',
          borderTopWidth: 0,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') iconName = 'home';
          else if (route.name === 'FavoritesTab') iconName = 'heart';
          else if (route.name === 'SearchTab') iconName = 'search';
          else if (route.name === 'ProfileTab') iconName = 'person';

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={InicioStack} options={{ title: 'Inicio' }} />
      <Tab.Screen name="FavoritesTab" component={FavoritesStack} options={{ title: 'Favoritos' }} />
      <Tab.Screen name="SearchTab" component={SearchStack} options={{ title: 'Buscar' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { session, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={BottomTabs} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={Auth} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
