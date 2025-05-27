import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import { Button } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../lib/types';

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Auth = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        if (!data?.user?.email_confirmed_at) {
          setErrorMsg('Debes verificar tu correo antes de iniciar sesión.');
        } else {
          navigation.navigate('HomeTab');
        }
      }
    } catch (error) {
      setErrorMsg('Error al iniciar sesión');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <Button
        title="Iniciar sesión"
        onPress={handleLogin}
        loading={loading}
        buttonStyle={styles.button}
        titleStyle={{ fontWeight: 'bold' }}
      />

      <Button
        title="¿No tienes una cuenta? Regístrate"
        onPress={() => navigation.navigate('SignUp')}
        containerStyle={styles.signupButtonContainer}
        type="clear"
        titleStyle={{ color: '#f9a825' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#111', // igual que EditProfile
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
    color: '#fff',
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 24,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    backgroundColor: '#1e1e1e', 
    color: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 14,
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#e0a43c', 
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 10,
  },
  signupButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupButtonTitle: {
    color: '#e0a43c',
    fontWeight: 'bold',
  },
});

export default Auth;
