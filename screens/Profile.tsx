import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Asegúrate de que la ruta es correcta
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const { session, logout, loading } = useAuth(); // Obtener la sesión del usuario y el método de logout
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigation = useNavigation(); // Usamos la navegación para redirigir a la pantalla de edición

  useEffect(() => {
    // Al cargar el componente, obtenemos la información del usuario de la sesión
    if (session?.user) {
      setUserInfo(session.user);
    }
  }, [session]);

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No estás autenticado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      
      {userInfo ? (
        <>
          <Text style={styles.text}>Nombre: {userInfo?.username}</Text>
          <Text style={styles.text}>Email: {userInfo?.email}</Text>
        </>
      ) : (
        <Text style={styles.text}>Cargando información del usuario...</Text>
      )}

      <Button
        title={loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
        onPress={logout}
        disabled={loading}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Edit profile" onPress={() => navigation.navigate('EditProfile')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Profile;
