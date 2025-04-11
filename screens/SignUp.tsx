import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase'; // Asegúrate de tener esta ruta configurada correctamente

const SignUp = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = async () => {
    if (password !== repeatPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert('Error al registrarse', error.message);
        setLoading(false);
      } else {
        // Se puede agregar la lógica para actualizar el nombre de usuario después del registro
        const { error: updateError } = await supabase
          .from('users')
          .upsert([{ id: user?.id, username }]);

        if (updateError) {
          Alert.alert('Error al guardar el nombre de usuario', updateError.message);
        } else {
          Alert.alert('Registro exitoso', '¡Tu cuenta ha sido creada!');
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Hubo un problema al crear tu cuenta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crea tu cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Repetir contraseña"
        secureTextEntry
        value={repeatPassword}
        onChangeText={setRepeatPassword}
      />

      <Button
        title={loading ? 'Registrando...' : 'Registrarse'}
        onPress={handleSignUp}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default SignUp;
