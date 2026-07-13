import type { HostSnapshot, Participant, SessionMode, SessionStatus } from '../../types';

export type HostView = 'setup' | 'lobby' | 'progress' | 'results' | 'ended';

export interface HostState {
  view: HostView;
  selectedMode: SessionMode;
  participants: Participant[];
  sessionId: string | null;
  joinUrl: string | null;
  qrDataUrl: string | null;
  setupError: string | null;
  roundLabel: string;
  timerEndsAt: number | null;
  submitCountLabel: string;
}

export const initialHostState: HostState = {
  view: 'setup',
  selectedMode: 'portrait',
  participants: [],
  sessionId: null,
  joinUrl: null,
  qrDataUrl: null,
  setupError: null,
  roundLabel: '',
  timerEndsAt: null,
  submitCountLabel: '',
};

export type HostAction =
  | { type: 'showSetup' }
  | { type: 'selectMode'; mode: SessionMode }
  | { type: 'setupError'; message: string | null }
  | {
      type: 'sessionCreated';
      sessionId: string;
      joinUrl: string;
      qrDataUrl: string;
      participants: Participant[];
    }
  | { type: 'lobbyUpdate'; participants: Participant[]; status: SessionStatus }
  | { type: 'snapshot'; snapshot: HostSnapshot }
  | { type: 'intermission'; roundIndex: number; totalRounds: number; intermissionEndsAt: number }
  | { type: 'roundStart'; roundIndex: number; totalRounds: number; roundEndsAt: number }
  | { type: 'submissionProgress'; submittedCount: number; totalExpected: number }
  | { type: 'revealWait'; revealEndsAt: number }
  | { type: 'resultsReady' };

export function hostReducer(state: HostState, action: HostAction): HostState {
  switch (action.type) {
    case 'showSetup':
      return { ...state, view: 'setup' };

    case 'selectMode':
      return { ...state, selectedMode: action.mode };

    case 'setupError':
      return { ...state, setupError: action.message };

    case 'sessionCreated':
      return {
        ...state,
        sessionId: action.sessionId,
        joinUrl: action.joinUrl,
        qrDataUrl: action.qrDataUrl,
        participants: action.participants,
        view: 'lobby',
        setupError: null,
      };

    case 'lobbyUpdate':
      return {
        ...state,
        participants: action.participants,
        view: action.status === 'ended' ? 'ended' : state.view,
      };

    case 'snapshot': {
      const snap = action.snapshot;
      const participants = snap.participants ?? state.participants;
      if (snap.status === 'lobby') {
        return { ...state, participants, view: 'lobby' };
      }
      if (snap.status === 'intermission') {
        return {
          ...state,
          participants,
          view: 'progress',
          roundLabel: `잠시 후 라운드 ${snap.currentRoundIndex + 1} / ${snap.totalRounds} 시작`,
          timerEndsAt: snap.intermissionEndsAt,
          submitCountLabel: '',
        };
      }
      if (snap.status === 'drawing') {
        return {
          ...state,
          participants,
          view: 'progress',
          roundLabel: `라운드 ${snap.currentRoundIndex + 1} / ${snap.totalRounds} 진행 중`,
          timerEndsAt: snap.roundEndsAt,
          submitCountLabel: snap.submissionProgress
            ? `${snap.submissionProgress.submittedCount} / ${snap.submissionProgress.totalExpected}명 제출완료`
            : '',
        };
      }
      if (snap.status === 'reveal-wait') {
        return {
          ...state,
          participants,
          view: 'progress',
          roundLabel: '두구두구 🥁 결과를 준비하고 있어요',
          timerEndsAt: snap.revealEndsAt,
          submitCountLabel: '',
        };
      }
      if (snap.status === 'results') {
        return { ...state, participants, view: 'results' };
      }
      return { ...state, participants, view: 'ended' };
    }

    case 'intermission':
      return {
        ...state,
        view: 'progress',
        roundLabel: `잠시 후 라운드 ${action.roundIndex + 1} / ${action.totalRounds} 시작`,
        timerEndsAt: action.intermissionEndsAt,
        submitCountLabel: '',
      };

    case 'roundStart':
      return {
        ...state,
        view: 'progress',
        roundLabel: `라운드 ${action.roundIndex + 1} / ${action.totalRounds} 진행 중`,
        timerEndsAt: action.roundEndsAt,
        submitCountLabel: '',
      };

    case 'submissionProgress':
      return { ...state, submitCountLabel: `${action.submittedCount} / ${action.totalExpected}명 제출완료` };

    case 'revealWait':
      return {
        ...state,
        view: 'progress',
        roundLabel: '두구두구 🥁 결과를 준비하고 있어요',
        timerEndsAt: action.revealEndsAt,
        submitCountLabel: '',
      };

    case 'resultsReady':
      return { ...state, view: 'results' };

    default:
      return state;
  }
}

export const MODE_META: Record<SessionMode, { label: string; icon: string; description: string; hint: string }> = {
  portrait: {
    label: '1:1 초상화',
    icon: '👩‍🤝‍👩',
    description: '단 둘이서 정해진 시간 동안 서로의 얼굴을 그리는 기본 모드예요. 정확히 2명이 필요해요.',
    hint: '정확히 2명 필요 · 3~5분 권장',
  },
  baton: {
    label: '바톤터치',
    icon: '🔄',
    description: '내 얼굴을 그리는 것으로 시작해 캔버스가 다음 사람에게 넘어가며 이어 그리는 협업 모드예요.',
    hint: '2~15명 가능 · 1~2분 권장',
  },
  multi: {
    label: '1:多 초상화',
    icon: '🖼️',
    description: '나를 제외한 모든 참가자를 한 명씩 돌아가며 그리는 모드예요. 참가자 수만큼 라운드가 진행돼요.',
    hint: '3~5명 권장 · 3~5분 권장',
  },
};
