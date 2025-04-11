// Profile.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Profile = () => {
  const { session } = useAuth();  // Obtener la sesión desde el contexto
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (session) {
      const fetchUserData = async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('username, email, telefono')
            .eq('id', session.user?.id)  // Utilizando el id del usuario
            .single();

          if (error) {
            console.error(error);
          } else {
            setUserData(data);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      };

      fetchUserData();
    }
  }, [session]);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando datos del perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.info}>{userData.username}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{userData.email}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.info}>{userData.telefono}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    fontSize: 16,
    marginTop: 5,
    color: '#555',
  },
});

export default Profile;
