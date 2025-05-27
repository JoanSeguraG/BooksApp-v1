import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../lib/types';
import { supabase } from '../lib/supabase';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const Profile = () => {
  const { session, logout, loading } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [userInfo, setUserInfo] = useState<{
    username?: string;
    email?: string;
    telefono?: string | null;
    birth_date?: string | null;
    description?: string | null;
    location?: string | null;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUserInfo = async () => {
        if (!session?.user?.id) return;

        const { data, error } = await supabase
          .from('users')
          .select('username, email, telefono, birth_date, description, location')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user info:', error.message);
          return;
        }

        setUserInfo(data);
      };

      fetchUserInfo();
    }, [session])
  );

  if (!session) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>No estás autenticado</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#f9a825" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Image
            source={require('../assets/avatar.jpg')}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <MaterialIcons name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.username}>{userInfo?.username || 'Nombre'}</Text>
          <Text style={styles.subtitle}>{userInfo?.description || 'Descripción breve'}</Text>
        </View>

        <View style={styles.infoSection}>
          <InfoRow icon="email" label="Email" value={userInfo?.email} />
          <InfoRow icon="phone" label="Teléfono" value={userInfo?.telefono} />
          <InfoRow icon="calendar-today" label="Nacimiento" value={userInfo?.birth_date} />
          <InfoRow icon="location-on" label="Localización" value={userInfo?.location} />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          disabled={loading}
        >
          <Text style={styles.logoutText}>
            {loading ? 'Cerrando sesión...' : 'CERRAR SESIÓN'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ icon, label, value }: { icon: any; label: string; value?: string | null }) => (
  <View style={styles.infoRow}>
    <MaterialIcons name={icon} size={22} color="#ccc" style={styles.icon} />
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'No disponible'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#111', // más claro que negro puro
    paddingBottom: 40,
  },
  container: {
    padding: 20,
    paddingTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 6,
  },
  username: {
    color: '#f9a825',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
  },
  subtitle: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  infoSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
  },
  value: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
  backgroundColor: '#d44f4f', // rojo suave, no saturado
  paddingVertical: 14,
  paddingHorizontal: 40,
  borderRadius: 25,
  alignItems: 'center',
  alignSelf: 'center',
  width: '100%',
},
logoutText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  textTransform: 'uppercase',
},
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default Profile;
