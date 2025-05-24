// Definición de tipos para la navegación
export type RootStackParamList = {
    Home: undefined;
    SearchResults: { query: string };
    BookDetail: { book: Book }; // Usamos el tipo Book aquí
    Favorites: undefined;
    Profile: { refresh?: boolean } | undefined;
    EditProfile: undefined;
    Auth: undefined;
  };
  
  // Definición del tipo Book
  export interface VolumeInfo {
    title: string;
    authors: string[];
    description: string;
    imageLinks?: {
      thumbnail: string;
    };
  }
  
  export interface Book {
    id: string;
    volumeInfo: {
      title: string;
      authors: string[];
      description: string;
      imageLinks?: {
        thumbnail: string;
      };
    };
  }
  