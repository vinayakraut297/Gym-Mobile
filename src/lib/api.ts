import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Android emulators connect to host's localhost via 10.0.2.2.
// iOS emulators and web resolve normally to localhost.
export const API_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  
  const token = await AsyncStorage.getItem('fitpulse_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(fullUrl, { ...options, headers });
  if (!response.ok) {
     const text = await response.text();
     throw new Error(`API Error: ${response.status} - ${text}`);
  }
  return response.json();
}
