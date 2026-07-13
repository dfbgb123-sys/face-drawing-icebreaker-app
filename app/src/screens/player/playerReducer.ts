import type {
  Assignment,
  GuessState,
  Participant,
  PlayerSnapshot,
  Portrait,
  SessionMode,
  SessionStatus,
} from '../../types';

export type PlayerView =
  | 'loading'
  | 'none'
  | 'join'
  | 'lobby'
  | 'intermission'
  | 'drawing'
  | 'reveal'
  | 'results'
  | 'ended';

export interface PlayerState {
  view: PlayerView;
  noneMessage: { title: string; body: string } | null;
  sessionId: string | null;
  participantId: string | null;
  clientToken: string | null;
  myName: string | null;
  allParticipants: Participant[];
  pendingAssignment: Assignment | null;
  submittedThisRound: boolean;
  sessionMode: SessionMode | null;
  totalRounds: number;
  currentRoundIndex: number;
  roundEndsAt: number | null;
  intermissionEndsAt: number | null;
  revealEndsAt: number | null;
  portraits: Portrait[];
  portraitIndex: number;
  myDrawing: Portrait | null;
  guessState: Record<number, GuessState>;
}

export const initialPlayerState: PlayerState = {
  view: 'loading',
  noneMessage: null,
  sessionId: null,
  participantId: null,
  clientToken: null,
  myName: null,
  allParticipants: [],
  pendingAssignment: null,
  submittedThisRound: false,
  sessionMode: null,
  totalRounds: 0,
  currentRoundIndex: 0,
  roundEndsAt: null,
  intermissionEndsAt: null,
  revealEndsAt: null,
  portraits: [],
  portraitIndex: 0,
  myDrawing: null,
  guessState: {},
};

export type PlayerAction =
  | { type: 'loading' }
  | { type: 'showNone'; title: string; body: string }
  | { type: 'showJoin'; sessionId: string; mode: SessionMode | null; participants: Participant[] }
  | { type: 'lobbyUpdate'; participants: Participant[]; status: SessionStatus }
  | { type: 'prepRejoin'; sessionId: string; participantId: string; clientToken: string }
  | { type: 'joined'; participantId: string; clientToken: string; name: string }
  | { type: 'applySnapshot'; snapshot: PlayerSnapshot }
  | { type: 'assignment'; assignment: Assignment }
  | { type: 'intermission'; intermissionEndsAt: number }
  | { type: 'roundStart'; roundIndex: number; totalRounds: number; roundEndsAt: number }
  | { type: 'roundEnd' }
  | { type: 'revealWait'; revealEndsAt: number }
  | { type: 'results'; mode: SessionMode | null; portraits: Portrait[]; myDrawing: Portrait | null }
  | { type: 'submitted' }
  | { type: 'portraitIndex'; index: number }
  | { type: 'guessSelected'; roundIndex: number; guessedArtistId: string }
  | {
      type: 'guessRevealed';
      roundIndex: number;
      actualArtistId: string;
      actualArtistName: string;
      correct: boolean;
    };

export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'loading':
      return { ...state, view: 'loading' };

    case 'showNone':
      return { ...state, view: 'none', noneMessage: { title: action.title, body: action.body } };

    case 'showJoin':
      return {
        ...state,
        view: 'join',
        sessionId: action.sessionId,
        sessionMode: action.mode,
        allParticipants: action.participants,
      };

    case 'lobbyUpdate': {
      let myName = state.myName;
      if (!myName && state.participantId) {
        const mine = action.participants.find((p) => p.id === state.participantId);
        if (mine) myName = mine.name;
      }
      return {
        ...state,
        allParticipants: action.participants,
        myName,
        view: action.status === 'ended' ? 'ended' : state.view,
      };
    }

    case 'prepRejoin':
      return {
        ...state,
        sessionId: action.sessionId,
        participantId: action.participantId,
        clientToken: action.clientToken,
      };

    case 'joined':
      return {
        ...state,
        participantId: action.participantId,
        clientToken: action.clientToken,
        myName: action.name,
      };

    case 'applySnapshot': {
      const snap = action.snapshot;
      const mode = snap.mode ?? state.sessionMode;
      if (snap.status === 'lobby') {
        return { ...state, sessionMode: mode, view: 'lobby' };
      }
      if (snap.status === 'intermission') {
        return {
          ...state,
          sessionMode: mode,
          pendingAssignment: snap.currentAssignment ?? null,
          intermissionEndsAt: snap.intermissionEndsAt,
          currentRoundIndex: snap.currentRoundIndex,
          totalRounds: snap.totalRounds,
          view: 'intermission',
        };
      }
      if (snap.status === 'drawing') {
        const assignment = snap.currentAssignment ?? null;
        return {
          ...state,
          sessionMode: mode,
          pendingAssignment: assignment,
          submittedThisRound: assignment?.alreadySubmitted ?? false,
          currentRoundIndex: snap.currentRoundIndex,
          totalRounds: snap.totalRounds,
          roundEndsAt: snap.roundEndsAt,
          view: 'drawing',
        };
      }
      if (snap.status === 'reveal-wait') {
        return { ...state, sessionMode: mode, revealEndsAt: snap.revealEndsAt, view: 'reveal' };
      }
      if (snap.status === 'results') {
        return {
          ...state,
          sessionMode: mode,
          portraits: snap.portraits ?? [],
          myDrawing: snap.myDrawing ?? null,
          portraitIndex: 0,
          view: 'results',
        };
      }
      return { ...state, sessionMode: mode, view: 'ended' };
    }

    case 'assignment':
      return { ...state, pendingAssignment: action.assignment };

    case 'intermission':
      return { ...state, intermissionEndsAt: action.intermissionEndsAt, view: 'intermission' };

    case 'roundStart': {
      const assignment = state.pendingAssignment;
      return {
        ...state,
        currentRoundIndex: action.roundIndex,
        totalRounds: action.totalRounds,
        roundEndsAt: action.roundEndsAt,
        submittedThisRound: assignment?.alreadySubmitted ?? false,
        view: 'drawing',
      };
    }

    case 'roundEnd':
      return { ...state, submittedThisRound: true };

    case 'revealWait':
      return { ...state, revealEndsAt: action.revealEndsAt, view: 'reveal' };

    case 'results':
      return {
        ...state,
        sessionMode: action.mode ?? state.sessionMode,
        portraits: action.portraits,
        myDrawing: action.myDrawing,
        portraitIndex: 0,
        view: 'results',
      };

    case 'submitted':
      return { ...state, submittedThisRound: true };

    case 'portraitIndex':
      return { ...state, portraitIndex: action.index };

    case 'guessSelected':
      return {
        ...state,
        guessState: {
          ...state.guessState,
          [action.roundIndex]: {
            ...state.guessState[action.roundIndex],
            guessedArtistId: action.guessedArtistId,
          },
        },
      };

    case 'guessRevealed':
      return {
        ...state,
        guessState: {
          ...state.guessState,
          [action.roundIndex]: {
            ...state.guessState[action.roundIndex],
            revealed: true,
            actualArtistId: action.actualArtistId,
            actualArtistName: action.actualArtistName,
            correct: action.correct,
          },
        },
      };

    default:
      return state;
  }
}

export function subjectPromptText(assignment: Assignment | null, mode: SessionMode | null): string {
  if (!assignment) return '';
  if (mode === 'baton') {
    return assignment.canvasUrl
      ? `${assignment.subjectName}님의 캔버스를 이어 그려주세요`
      : `${assignment.subjectName}님, 첫 라운드예요! 본인의 얼굴을 그려주세요`;
  }
  return `${assignment.subjectName}님을 그려주세요`;
}
