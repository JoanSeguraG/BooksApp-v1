import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { supabase } from '../lib/supabase'; // Asegúrate de que esta ruta sea correcta
import { useNavigation } from '@react-navigation/native';

export default function SignUp() {
  console.log('SignUp component rendered');
  
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignUp = async () => {
    setErrorMsg(''); // Resetear el mensaje de error
  
    // Validación de campos
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
      // Intentar registrar al usuario
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username } // Almacenamos el 'username' en los metadatos del usuario
        }
      });
  
      if (error) {
        setErrorMsg(error.message); // Mostrar mensaje de error si lo hay
      } else {
        // Al registrarse con éxito, guardar la información en la tabla 'users'
        const { user } = data;
  
        console.log("Usuario registrado:", user); // Verifica si el usuario fue creado correctamente
  
        // Insertar los datos del usuario en la tabla 'users' en Supabase
        const { error: dbError } = await supabase
          .from('users')
          .insert([
            {
              id: user?.id, // Relacionamos al usuario con su id de autenticación
              username: username,
              email: email
            }
          ]);
  
        if (dbError) {
          setErrorMsg('Error al guardar los datos en la base de datos.');
          console.error(dbError); // Verifica si ocurre un error al insertar
        } else {
          Alert.alert('Cuenta creada', 'Tu cuenta ha sido creada con éxito.');
        }
      }
    } catch (error) {
      setErrorMsg('Error al registrar la cuenta');
      console.error(error); // Verifica cualquier error general
    } finally {
      setLoading(false);
    }
  };  

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      {/* Campos de entrada */}
      <Input
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Tu nombre de usuario"
      />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="email@ejemplo.com"
        autoCapitalize="none"
      />
      <Input
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Contraseña"
      />
      <Input
        label="Repetir contraseña"
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        secureTextEntry
        placeholder="Repetir contraseña"
      />

      {/* Mostrar error si hay alguno */}
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      {/* Botón de registro */}
      <Button
        title="Sign Up"
        onPress={handleSignUp}
        disabled={loading}
        loading={loading}
        containerStyle={styles.button}
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
  errorText: {
    color: 'red',
    marginBottom: 12,
    marginLeft: 10
  },
  button: {
    marginTop: 12
  }
});
