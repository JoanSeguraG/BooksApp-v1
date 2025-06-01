import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';

export default function SignUp() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignUp = async () => {
    setErrorMsg('');

    if (!username || !email || !password || !repeatPassword) {
      setErrorMsg('Todos los campos son obligatorios.');
      return;
    }

    if (password !== repeatPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        const { user } = data;

        const { error: dbError } = await supabase
          .from('users')
          .insert([
            {
              id: user?.id,
              username,
              email
            }
          ]);

        if (dbError) {
          setErrorMsg('Error al guardar los datos en la base de datos.');
          console.error(dbError);
        } else {
          Alert.alert('Cuenta creada', 'Tu cuenta ha sido creada con éxito.');
        }
      }
    } catch (error) {
      setErrorMsg('Error al registrar la cuenta');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón volver atrás */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={26} color="#e0a43c" />
      </TouchableOpacity>

      <Text style={styles.title}>Crear cuenta</Text>

      {/* Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      {/* Inputs con texto blanco */}
      <Input
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Tu nombre de usuario"
        placeholderTextColor="#aaa"
        inputStyle={styles.inputText}
        labelStyle={styles.label}
      />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="email@ejemplo.com"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
        inputStyle={styles.inputText}
        labelStyle={styles.label}
      />
      <Input
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        inputStyle={styles.inputText}
        labelStyle={styles.label}
      />
      <Input
        label="Repetir contraseña"
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        secureTextEntry
        placeholder="Repetir contraseña"
        placeholderTextColor="#aaa"
        inputStyle={styles.inputText}
        labelStyle={styles.label}
      />

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <Button
        title="Sign Up"
        onPress={handleSignUp}
        disabled={loading}
        loading={loading}
        containerStyle={styles.button}
        buttonStyle={{ backgroundColor: '#e0a43c' }}
        titleStyle={{ fontWeight: 'bold' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  inputText: {
    color: '#fff',
  },
  label: {
    color: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    marginLeft: 10,
  },
  button: {
    marginTop: 12,
  },
});
