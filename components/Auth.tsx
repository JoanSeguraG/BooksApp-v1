import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native'; // Agregamos Text
import { supabase } from '../lib/supabase';
import { Button, Input } from '@rneui/themed';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signInError, setSignInError] = useState(''); // Estado para error

  async function signInWithEmail() {
    setSignInError('');
    
    // Validación de campos vacíos
    if (!email || !password) {
      setSignInError('Has d’omplir tots els camps.');
      return;
    }
  
    setLoading(true);
  
    const { error } = await supabase.auth.signInWithPassword({ email, password });
  
    if (error) {
      if (error.message.toLowerCase().includes('invalid')) {
        setSignInError('Email o contrasenya incorrectes.');
      } else {
        setSignInError(error.message);
      }
    }
  
    setLoading(false);
  }  

  async function signUpWithEmail() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Si us plau, revisa el teu correu per verificar el compte!');
    setLoading(false);
  }

  async function resetPassword() {
    if (!email) {
      Alert.alert('Introdueix un correu electrònic!');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Correu enviat', 'Revisa el teu correu per restablir la contrasenya.');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={signInWithEmail} />
        {signInError ? <Text style={styles.errorText}>{signInError}</Text> : null}
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={signUpWithEmail} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Forgot Password?" disabled={loading} onPress={resetPassword} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    marginLeft: 10,
    fontSize: 14,
  },
});
