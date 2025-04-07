// lib/userFunctions.ts
import AsyncStorage from '@react-native-async-storage/async-storage'; // Si usas AsyncStorage
import { supabase } from '../lib/supabase'; // Asegúrate de que este import esté correcto

// Actualizar nombre de usuario en Supabase
export const updateUserName = async (newName: string) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser(); 
  if (userError) {
    console.error(userError);
    throw new Error('No se pudo obtener el usuario');
  }

  const { data, error } = await supabase
    .from('users') // Aquí el nombre de la tabla de usuarios en tu base de datos
    .update({ name: newName })
    .eq('id', user.id); // Usamos user.id en lugar de supabase.auth.user().id

  if (error) {
    console.error(error);
    throw new Error('No se pudo actualizar el nombre');
  }
  return data;
};

// Actualizar el tema (puede ir en AsyncStorage o Supabase)
export const updateUserTheme = async (isDarkMode: boolean) => {
  try {
    // Guardar tema en Supabase o AsyncStorage
    await AsyncStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  } catch (error) {
    console.error('Error al actualizar tema:', error);
  }
};
