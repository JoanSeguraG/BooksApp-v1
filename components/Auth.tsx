import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
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
        password
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        if (!data?.user?.email_confirmed_at) {
          setErrorMsg('Debes verificar tu correo antes de iniciar sesión.');
        } else {
          navigation.navigate('HomeTab'); // ✅ 跳转到底部导航中的首页
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

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
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
      />

      {/* Botón de Sign Up */}
      <Button
        title="¿No tienes una cuenta? Regístrate"
        onPress={() => navigation.navigate('SignUp')}
        containerStyle={styles.signupButtonContainer}
        type="clear"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'center'
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    borderColor: '#ccc'
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    marginLeft: 10
  },
  button: {
    marginTop: 12,
    backgroundColor: '#000'
  },
  signupButtonContainer: {
    marginTop: 20
  }
});

export default Auth;
