import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Identity } from '../types';

const KEY = 'portraitParty:identity';

export async function saveIdentity(identity: Identity): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(identity));
}

export async function loadIdentity(): Promise<Identity | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Identity) : null;
  } catch {
    return null;
  }
}

export async function clearIdentity(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
