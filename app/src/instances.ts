// 클라우드에 배포된 서버 인스턴스 목록 (샤딩용).
// 비어 있으면 항상 기본 서버 주소(config.ts의 DEFAULT_API_BASE)를 그대로 사용한다.
// 최종 배포 시(PROGRESS.md 10번 항목) 여러 인스턴스를 별도 서비스로 배포한 뒤,
// 그 주소들을 여기에 채우면 된다.
export const KNOWN_INSTANCES: string[] = [];

export function pickInstance(fallback: string): string {
  if (KNOWN_INSTANCES.length === 0) return fallback;
  const index = Math.floor(Math.random() * KNOWN_INSTANCES.length);
  return KNOWN_INSTANCES[index];
}
