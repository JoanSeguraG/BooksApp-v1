// navigation/InicioStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewHomeScreen from '../screens/NewHomeScreen';
import BookDetailScreen from '../screens/BookDetailScreen';

const Stack = createNativeStackNavigator();

export default function InicioStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NewHome" component={NewHomeScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
    </Stack.Navigator>
  );
}
