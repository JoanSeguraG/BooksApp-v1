import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../lib/types'; 

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const Profile = () => {
  const { session, logout, loading } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);

  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
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
