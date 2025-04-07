// screens/SettingsScreen.tsx
import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Switch, Alert, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { updateUserName, updateUserTheme } from '../lib/userFunctions'; // Funciones para actualizaciones reales

export default function SettingsScreen() {
  const { user, logout, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.name || '');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || null); // Avatar placeholder

  // Cambiar nombre de usuario
  const handleChangeUsername = async () => {
    if (username !== user?.name) {
      await updateUserName(username); // Actualiza el nombre en Supabase o en el estado global
      setUser({ ...user, name: username });
      Alert.alert('Éxito', `Nombre cambiado a: ${username}`);
    }
  };

  // Cambiar el tema
  const handleToggleTheme = async (value: boolean) => {
    setIsDarkMode(value);
    await updateUserTheme(value); // Guarda el tema en almacenamiento local o Supabase
    Alert.alert('Tema actualizado', value ? 'Modo oscuro activado' : 'Modo claro activado');
  };

  // Eliminar cuenta (simulada)
  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => console.log('Cuenta eliminada') }, // Aquí pondrías la lógica para eliminar la cuenta de Supabase
      ]
    );
  };

  // Función para mostrar avatar (inicial o de la base de datos)
  const renderAvatar = () => {
    if (avatar) {
      return <Image source={{ uri: avatar }} style={styles.avatar} />;
    }
    // Si no hay avatar, mostramos la inicial del nombre
    const initial = user?.name?.charAt(0).toUpperCase() || 'U';
    return <Text style={styles.avatar}>{initial}</Text>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Configuración</Text>

      {/* Avatar de usuario */}
      <View style={styles.avatarContainer}>
        {renderAvatar()}
      </View>

      {/* Nombre de usuario */}
      <Text style={styles.label}>Nombre de usuario</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Escribe tu nombre"
      />
      <Button title="Guardar cambios" onPress={handleChangeUsername} />

      <View style={styles.separator} />

      {/* Tema oscuro */}
      <Text style={styles.label}>Tema oscuro</Text>
      <Switch
        value={isDarkMode}
        onValueChange={handleToggleTheme}
      />

      <View style={styles.separator} />

      {/* Cerrar sesión y eliminar cuenta */}
      <Button title="Cerrar sesión" onPress={logout} color="#888" />
      <Button title="Eliminar cuenta" onPress={handleDeleteAccount} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 8,
    marginTop: 5,
    marginBottom: 10,
  },
  separator: {
    height: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    lineHeight: 80,
    fontSize: 36,
    fontWeight: 'bold',
  },
});
