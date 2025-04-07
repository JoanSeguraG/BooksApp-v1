import 'react-native-url-polyfill/auto';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import Navigation from './components/Navigation';
import { Session } from '@supabase/supabase-js';

function MainApp() {
  const { user, loading } = useAuth(); // Usando el hook de autenticación
  const [newPassword, setNewPassword] = useState('');
  const [showNav, setShowNav] = useState(false);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  async function updatePassword() {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Contrasenya canviada amb èxit!', 'Pots iniciar sessió amb la nova contrasenya.');
      setNewPassword('');
    }
  }

  if (!user) {
    return <Auth />;
  }

  // Verificamos si el correo está verificado
  const isEmailVerified = user.user_metadata?.email_verified;

  if (isEmailVerified) {
    if (showNav) {
      return <Navigation />;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Usuari: {user.email}</Text>
        <TextInput
          style={styles.input}
          placeholder="Nova contrasenya"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Button title="Canviar Contrasenya" onPress={updatePassword} />
        <View style={{ marginTop: 20 }}>
          <Button title="Entrar a l'app" onPress={() => setShowNav(true)} />
        </View>
      </View>
    );
  }

  // Si el correo no está verificado
  return (
    <View style={styles.container}>
      <Text style={styles.text}>El teu correu electrònic no està verificat. Revisa la teva bústia.</Text>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});