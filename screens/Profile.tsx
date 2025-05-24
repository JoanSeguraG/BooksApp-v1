import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../lib/types';
import { supabase } from '../lib/supabase';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const Profile = () => {
  const { session, logout, loading } = useAuth();
  const [userInfo, setUserInfo] = useState<{ username?: string; email?: string; telefono?: string | null } | null>(null);

  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('username, email, telefono')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user info:', error.message);
          return;
        }

        setUserInfo(data);
      } catch (error) {
        console.error('Unexpected error fetching user info:', error);
      }
    };

    fetchUserInfo();
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
          <Text style={styles.text}>Nombre: {userInfo.username || 'No disponible'}</Text>
          <Text style={styles.text}>Email: {userInfo.email || 'No disponible'}</Text>
          <Text style={styles.text}>Teléfono: {userInfo.telefono ?? 'No disponible'}</Text>
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
        <Button title="Editar perfil" onPress={() => navigation.navigate('EditProfile')} />
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
