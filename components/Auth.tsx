import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native'; // Asegúrate de importar StyleSheet
import { Button } from '@rneui/themed'; // Asegúrate de que estás importando Button de @rneui/themed
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';

export default function Auth() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');

    // Validación de campos vacíos
    if (!email || !password) {
      setErrorMsg('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);

    try {
      // Intentar iniciar sesión
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        // Verificar si el correo está verificado
        if (!data?.user?.email_confirmed_at) {
          setErrorMsg('Debes verificar tu correo antes de iniciar sesión.');
        } else {
          // Si el correo está verificado, navegar a la pantalla principal
          navigation.navigate('Home');
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
        buttonStyle={styles.button} // Usar buttonStyle en lugar de style
      />

      {/* Botón de Sign Up */}
      <Button
        title="¿No tienes una cuenta? Regístrate"
        onPress={() => navigation.navigate('SignUp')}
        containerStyle={styles.signupButtonContainer} // Usar containerStyle para la posición
      />
    </View>
  );
}

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
    marginBottom: 12
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    marginLeft: 10
  },
  button: {
    marginTop: 12, // Estilo para el botón "Iniciar sesión"
  },
  signupButtonContainer: {
    marginTop: 20, // Estilo para el contenedor del botón "Regístrate"
  }
});