
export type RootStackParamList = {
    Home: undefined;
    SearchResults: { query: string };
    BookDetail: { book: any }; 
    Favorites: undefined;
    Profile: { refresh?: boolean } | undefined;
    EditProfile: undefined;
    Auth: undefined;
  };
  
  
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
  