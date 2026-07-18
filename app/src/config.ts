import AsyncStorage from '@react-native-async-storage/async-storage';

// 개발 중에는 adb reverse tcp:3000 tcp:3000 으로 로컬 서버를 그대로 사용하고,
// 실제 배포 시에는 이 값을 배포된 서버 주소로 바꾸면 된다 (또는 여러 인스턴스를
// 쓰는 경우 instances.ts의 KNOWN_INSTANCES를 채우면 이 값은 fallback으로만 쓰인다).
export const DEFAULT_API_BASE = 'http://localhost:3000';

export function resolveUrl(apiBase: string, path: string | undefined | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path) || path.startsWith('data:')) return path;
  return `${apiBase}${path.startsWith('/') ? '' : '/'}${path}`;
}

// 진행자가 만든 세션이 어느 인스턴스(샤드)에 있는지 기억해두는 용도.
// 앱이 재시작돼도 같은 인스턴스로 다시 붙을 수 있도록 apiBase와 별도로 저장한다.
const HOST_SESSION_API_BASE_KEY = 'faceIcebreaker:hostSessionApiBase';

export async function loadHostSessionApiBase(): Promise<string | null> {
  return AsyncStorage.getItem(HOST_SESSION_API_BASE_KEY);
}

export async function saveHostSessionApiBase(url: string): Promise<void> {
  await AsyncStorage.setItem(HOST_SESSION_API_BASE_KEY, url);
}

export async function clearHostSessionApiBase(): Promise<void> {
  await AsyncStorage.removeItem(HOST_SESSION_API_BASE_KEY);
}
