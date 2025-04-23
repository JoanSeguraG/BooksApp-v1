import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Asegúrate de importar correctamente el contexto
import { supabase } from '../lib/supabase'; // Asegúrate de importar correctamente supabase

const EditProfile = ({ navigation }: any) => {
  const { session, loading, error, updateUserProfile } = useAuth(); // Usamos el contexto para obtener la sesión
  const [username, setUsername] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loadingSave, setLoadingSave] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.user_metadata.username || '');
      setTelefono(session.user.user_metadata.telefono || '');
    }
  }, [session]);

  const handleSaveProfile = async () => {
    setErrorMsg('');
    setLoadingSave(true);
  
    if (!username || !telefono) {
      setErrorMsg('Por favor, completa todos los campos.');
      setLoadingSave(false);
      return;
    }
  
    try {
      // Llamamos al método updateUserProfile del contexto
      await updateUserProfile(username, telefono);
      navigation.goBack(); // Volver a la pantalla anterior si la actualización es exitosa
    } catch (error) {
      // Maneja el error si algo salió mal
      setErrorMsg('Error al guardar el perfil.');
      console.error('Error en la actualización de perfil:', error);
    } finally {
      setLoadingSave(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <TextInput
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
        style={styles.input}
      />

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <Button
        title={loadingSave ? 'Guardando...' : 'Guardar Cambios'}
        onPress={handleSaveProfile}
        disabled={loadingSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    marginLeft: 10,
  },
});

export default EditProfile;
