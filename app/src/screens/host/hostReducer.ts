import type { HostSnapshot, Participant, SessionMode, SessionStatus } from '../../types';

export type HostView = 'setup' | 'lobby' | 'progress' | 'results' | 'ended';

export interface HostState {
  view: HostView;
  selectedMode: SessionMode;
  participants: Participant[];
  sessionId: string | null;
  qrDataUrl: string | null;
  setupError: string | null;
  roundLabel: string;
  timerEndsAt: number | null;
  submitCountLabel: string;
  revealWait: boolean;
}

export const initialHostState: HostState = {
  view: 'setup',
  selectedMode: 'portrait',
  participants: [],
  sessionId: null,
  qrDataUrl: null,
  setupError: null,
  roundLabel: '',
  timerEndsAt: null,
  submitCountLabel: '',
  revealWait: false,
};

export type HostAction =
  | { type: 'showSetup' }
  | { type: 'selectMode'; mode: SessionMode }
  | { type: 'setupError'; message: string | null }
  | {
      type: 'sessionCreated';
      sessionId: string;
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

function intermissionLabel(roundIndex: number, totalRounds: number): string {
  return totalRounds > 1 ? `잠시 후 라운드 ${roundIndex + 1} / ${totalRounds} 시작` : '잠시 후 시작';
}

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
        return { ...state, participants, view: 'lobby', revealWait: false };
      }
      if (snap.status === 'intermission') {
        return {
          ...state,
          participants,
          view: 'progress',
          roundLabel: intermissionLabel(snap.currentRoundIndex, snap.totalRounds),
          timerEndsAt: snap.intermissionEndsAt,
          submitCountLabel: '',
          revealWait: false,
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
          revealWait: false,
        };
      }
      if (snap.status === 'reveal-wait') {
        return {
          ...state,
          participants,
          view: 'progress',
          roundLabel: '결과를 준비하고 있어요',
          timerEndsAt: snap.revealEndsAt,
          submitCountLabel: '',
          revealWait: true,
        };
      }
      if (snap.status === 'results') {
        return { ...state, participants, view: 'results', revealWait: false };
      }
      return { ...state, participants, view: 'ended', revealWait: false };
    }

    case 'intermission':
      return {
        ...state,
        view: 'progress',
        roundLabel: intermissionLabel(action.roundIndex, action.totalRounds),
        timerEndsAt: action.intermissionEndsAt,
        submitCountLabel: '',
        revealWait: false,
      };

    case 'roundStart':
      return {
        ...state,
        view: 'progress',
        roundLabel: `라운드 ${action.roundIndex + 1} / ${action.totalRounds} 진행 중`,
        timerEndsAt: action.roundEndsAt,
        submitCountLabel: '',
        revealWait: false,
      };

    case 'submissionProgress':
      return { ...state, submitCountLabel: `${action.submittedCount} / ${action.totalExpected}명 제출완료` };

    case 'revealWait':
      return {
        ...state,
        view: 'progress',
        roundLabel: '결과를 준비하고 있어요',
        timerEndsAt: action.revealEndsAt,
        submitCountLabel: '',
        revealWait: true,
      };

    case 'resultsReady':
      return { ...state, view: 'results', revealWait: false };

    default:
      return state;
  }
}

export const MODE_META: Record<SessionMode, { label: string; icon: string; description: string; hint: string }> = {
  portrait: {
    label: '1:1 초상화',
    icon: '👩‍🤝‍👩',
    description:
      '단 둘이서 정해진 시간 동안 서로의 얼굴을 마주 보고 그리는 가장 기본적인 초상화 모드입니다. \n\n타이머가 끝나거나 먼저 저장 버튼을 누르면 내 세션이 종료되고, 상대방도 완료하면 결과 페이지에서 상대가 그린 나의 초상화를 확인할 수 있습니다. \n\n둘만의 시간, 서로의 얼굴을 정면으로 담아보세요.',
    hint: '정확히 2명 필요 · 3~5분 권장',
  },
  baton: {
    label: '바톤터치',
    icon: '🔄',
    description:
      '내 얼굴을 그리는 것으로 시작해 캔버스가 다음 사람에게 넘어가며 이어 그리는 협업 모드예요. \n\n여러 사람이 완성시킨 내 얼굴을 기대해보세요!',
    hint: '2~15명 가능 · 1~2분 권장',
  },
  multi: {
    label: '1:多 초상화',
    icon: '🖼️',
    description:
      '나를 제외한 모든 참가자를 한 명씩 돌아가며 그리는 모드예요. 참가자 수만큼 라운드가 진행돼요. \n\n사람들의 개성을 맘껏 담아보고, \n\n아직 발견하지 못한 내 모습을 기대해보세요!',
    hint: '3~5명 권장 · 3~5분 권장',
  },
};
