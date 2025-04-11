import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { Button, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signInError, setSignInError] = useState('');
  
  const navigation = useNavigation(); // Usamos el hook de navegación

  async function signInWithEmail() {
    setSignInError('');

    // Validación de campos vacíos
    if (!email || !password) {
      setSignInError('Please fill out all fields.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setSignInError(error.message);
    } else {
      // Si el inicio de sesión es exitoso, utilizamos reset para que no puedan volver a la pantalla de Auth
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]  // Reemplaza la pila con la pantalla "Home"
      });
    }

    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your email to verify your account!');
    setLoading(false);
  }

  async function resetPassword() {
    if (!email) {
      Alert.alert('Please enter an email address!');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Email sent', 'Please check your email to reset your password.');
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
        <Button
          title="Sign in"
          disabled={loading}
          onPress={signInWithEmail}
          loading={loading}
        />
        {signInError ? <Text style={styles.errorText}>{signInError}</Text> : null}
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={signUpWithEmail}
          loading={loading}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Forgot Password?"
          disabled={loading}
          onPress={resetPassword}
          loading={loading}
        />
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
