import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_KEY = 'faceIcebreaker:apiBase';

export function normalizeApiBase(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

export async function loadApiBase(): Promise<string | null> {
  return AsyncStorage.getItem(API_BASE_KEY);
}

export async function saveApiBase(url: string): Promise<string> {
  const normalized = normalizeApiBase(url);
  await AsyncStorage.setItem(API_BASE_KEY, normalized);
  return normalized;
}

export async function clearApiBase(): Promise<void> {
  await AsyncStorage.removeItem(API_BASE_KEY);
}

export function resolveUrl(apiBase: string, path: string | undefined | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path) || path.startsWith('data:')) return path;
  return `${apiBase}${path.startsWith('/') ? '' : '/'}${path}`;
}
