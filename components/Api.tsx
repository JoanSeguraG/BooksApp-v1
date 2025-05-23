// api/Api.tsx

const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';

export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description: string;
    imageLinks?: {
      thumbnail: string;
    };
  };
}

export interface Author {
  id: string;
  name: string;
}

let cachedAuthors: Author[] = [];

export async function searchBooks(query: string): Promise<Book[]> {
  try {
    const response = await fetch(`${API_URL}${encodeURIComponent(query)}`);
    const data = await response.json();
    const items = data.items || [];

    const books: Book[] = items.map((item: any) => ({
      id: item.id,
      volumeInfo: {
        title: item.volumeInfo.title || '',
        authors: item.volumeInfo.authors || [],
        description: item.volumeInfo.description || '',
        imageLinks: item.volumeInfo.imageLinks
  ? {
      thumbnail: item.volumeInfo.imageLinks.thumbnail.replace(/^http:\/\//, 'https://')
    }
  : undefined,
      },
    }));

    
    const authorSet = new Set<string>();
    books.forEach((book) => {
      (book.volumeInfo.authors || []).forEach((authorName) => {
        authorSet.add(authorName);
      });
    });

    cachedAuthors = Array.from(authorSet).map((name, index) => ({
      id: String(index + 1),
      name,
    }));

    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}


export async function getAuthors(): Promise<Author[]> {
  return cachedAuthors;
}
