import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Para obtener la sesión
import { supabase } from '../lib/supabase';

const EditProfile = ({ navigation }: any) => {
  const { session } = useAuth();
  const [username, setUsername] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loadingSave, setLoadingSave] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cargar datos actuales del usuario desde la tabla 'users'
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('users')
        .select('username, telefono')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error al cargar datos del usuario:', error.message);
        setErrorMsg('Error al cargar datos del usuario.');
      } else if (data) {
        setUsername(data.username || '');
        setTelefono(data.telefono ? String(data.telefono) : '');
      }
    };

    fetchUserData();
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
      const { error } = await supabase
        .from('users')
        .update({
          username,
          telefono: Number(telefono),
        })
        .eq('id', session?.user?.id);

      if (error) {
        console.error('Error al actualizar perfil:', error.message);
        setErrorMsg('Error al guardar el perfil.');
      } else {
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error inesperado al actualizar perfil:', error);
      setErrorMsg('Error inesperado al guardar.');
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
