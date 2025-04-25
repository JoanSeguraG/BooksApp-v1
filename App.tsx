import 'react-native-url-polyfill/auto';
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './screens/AppNavigator'; 

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
