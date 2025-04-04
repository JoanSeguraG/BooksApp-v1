import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

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
    <View>
      {!session ? (
        <Auth />
      ) : (
        <View>
          <Text>Usuari: {session.user?.email}</Text>
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