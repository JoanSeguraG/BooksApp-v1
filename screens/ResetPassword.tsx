// screens/ResetPassword.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setErrorMsg('');
    setLoading(true);

    // Aquí deberías obtener el token de la URL (por ejemplo, usando `route.params` o `link`)
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token'); // Obteniendo el token

    if (!accessToken) {
      setErrorMsg('No se pudo recuperar el enlace de restablecimiento.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        alert('Contraseña actualizada con éxito');
      }
    } catch (error) {
      setErrorMsg('Error al actualizar la contraseña');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restablecer contraseña</Text>

      <TextInput
        placeholder="Nueva Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <Button
        title="Actualizar Contraseña"
        onPress={handleResetPassword}
        disabled={loading}
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
    marginBottom: 12
  }
});
