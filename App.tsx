import 'react-native-url-polyfill/auto';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import { useState } from 'react';
import { supabase } from './lib/supabase';

function MainApp() {
  const { user, loading } = useAuth();
  const [newPassword, setNewPassword] = useState('');

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

  return (
    <View style={{ padding: 20 }}>
      {!user ? (
        <Auth />
      ) : (
        <View>
          <Text>Usuari: {user.email}</Text>
          <TextInput
            placeholder="Nova contrasenya"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Button title="Canviar Contrasenya" onPress={updatePassword} />
        </View>
      )}
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
