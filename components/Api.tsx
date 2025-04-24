// api/googleBooks.ts

const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';

export async function searchBooks(query: string) {
  try {
    const response = await fetch(`${API_URL}${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

