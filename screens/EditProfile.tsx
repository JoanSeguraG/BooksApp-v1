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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

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
  const [loadingAvatar, setLoadingAvatar] = useState(false);
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
        avatar_url: avatarUrl,  // También actualizar avatar_url aquí
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

  // Función para seleccionar y subir imagen
  const handleImagePick = async () => {
    try {
      setLoadingAvatar(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        if (!session?.user?.id) {
          Alert.alert('Error', 'No estás autenticado');
          setLoadingAvatar(false);
          return;
        }

        // Convertir URI a blob
        const response = await fetch(file.uri);
        const blob = await response.blob();

        const filePath = `${session.user.id}/${Date.now()}-${file.fileName || 'avatar.jpg'}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, blob, {
            cacheControl: '3600',
            upsert: true,
            contentType: blob.type,
          });

        if (uploadError) {
          console.error('Error al subir imagen:', uploadError.message);
          Alert.alert('Error', 'No se pudo subir la imagen');
          setLoadingAvatar(false);
          return;
        }

        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        const publicUrl = urlData.publicUrl;

        setAvatarUrl(publicUrl);

        // Actualizar avatar_url en la tabla users
        const { error: updateError } = await supabase
          .from('users')
          .update({ avatar_url: publicUrl })
          .eq('id', session.user.id);

        if (updateError) {
          console.error('Error al actualizar avatar en perfil:', updateError.message);
          Alert.alert('Error', 'No se pudo actualizar la imagen de perfil');
        }
      }
    } catch (e) {
      console.error('Error inesperado:', e);
      Alert.alert('Error', 'Ocurrió un error inesperado al seleccionar la imagen');
    } finally {
      setLoadingAvatar(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#e0a43c" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit profile</Text>

      <TouchableOpacity style={styles.avatarContainer} onPress={handleImagePick} disabled={loadingAvatar}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : require('../assets/avatar.jpg')}
          style={styles.avatar}
        />
        <View style={styles.editIcon}>
          <MaterialIcons name={loadingAvatar ? 'hourglass-top' : 'edit'} size={18} color="#fff" />
        </View>
      </TouchableOpacity>

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
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#e0a43c',
    borderRadius: 12,
    padding: 4,
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
