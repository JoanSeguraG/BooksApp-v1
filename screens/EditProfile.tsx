import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const EditProfile = ({ navigation }: any) => {
  const { session } = useAuth();

  const [username, setUsername] = useState('');
  const [telefono, setTelefono] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('users')
        .select('username, telefono, birth_date, description, location, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error al cargar datos del usuario:', error.message);
        setErrorMsg('Error al cargar datos del usuario.');
      } else if (data) {
        setUsername(data.username || '');
        setTelefono(data.telefono ? String(data.telefono) : '');
        setBirthDate(data.birth_date ? new Date(data.birth_date) : null);
        setDescription(data.description || '');
        setLocation(data.location || '');
        setAvatarUrl(data.avatar_url || null);
      }
    };

    fetchUserData();
  }, [session]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setBirthDate(selectedDate);
  };

  const handleSaveProfile = async () => {
    setErrorMsg('');
    setLoadingSave(true);

    if (!username || !telefono) {
      setErrorMsg('Por favor, completa todos los campos obligatorios.');
      setLoadingSave(false);
      return;
    }

    try {
      const updates = {
        username,
        telefono: Number(telefono),
        birth_date: birthDate ? birthDate.toISOString().split('T')[0] : null,
        description,
        location,
        avatar_url: avatarUrl,
      };

      const { error } = await supabase
        .from('users')
        .update(updates)
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
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#e0a43c" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit profile</Text>

      <View style={styles.avatarContainer}>
        <Image
          source={require('../assets/avatar.jpg')}
          style={styles.avatar}
        />
      </View>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone number"
        placeholderTextColor="#aaa"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={{ color: birthDate ? '#fff' : '#aaa' }}>
          {birthDate ? birthDate.toLocaleDateString() : 'Birth date'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={birthDate || new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}
      <TextInput
        placeholder="Description"
        placeholderTextColor="#aaa"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />
      <TextInput
        placeholder="Location"
        placeholderTextColor="#aaa"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveProfile}
        disabled={loadingSave}
      >
        <Text style={styles.saveButtonText}>
          {loadingSave ? 'Saving...' : 'Save'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#111',
    flexGrow: 1,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  input: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 14,
  },
  saveButton: {
    backgroundColor: '#e0a43c',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default EditProfile;
