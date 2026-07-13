export type SessionMode = 'portrait' | 'baton' | 'multi';

export type SessionStatus =
  | 'lobby'
  | 'intermission'
  | 'drawing'
  | 'reveal-wait'
  | 'results'
  | 'ended';

export interface Participant {
  id: string;
  name: string;
  seatIndex: number;
  claimed: boolean;
  connected: boolean;
}

export interface Assignment {
  roundIndex: number;
  subjectId: string;
  subjectName: string;
  alreadySubmitted?: boolean;
  canvasUrl?: string;
}

export interface Portrait {
  roundIndex: number;
  pngUrl: string;
  missing?: boolean;
  ownerName?: string;
  isMine?: boolean;
}

export interface SubmissionProgress {
  submittedCount: number;
  totalExpected: number;
}

export interface PlayerSnapshot {
  status: SessionStatus;
  mode: SessionMode;
  roundLengthMs: number;
  totalRounds: number;
  currentRoundIndex: number;
  roundEndsAt: number | null;
  intermissionEndsAt: number | null;
  revealEndsAt: number | null;
  currentAssignment?: Assignment | null;
  portraits?: Portrait[];
  myDrawing?: Portrait | null;
}

export interface HostSnapshot {
  status: SessionStatus;
  mode: SessionMode;
  roundLengthMs: number;
  totalRounds: number;
  currentRoundIndex: number;
  roundEndsAt: number | null;
  intermissionEndsAt: number | null;
  revealEndsAt: number | null;
  participants: Participant[];
  submissionProgress?: SubmissionProgress | null;
}

export interface Identity {
  sessionId: string;
  participantId: string;
  clientToken: string;
}

export interface GuessState {
  guessedArtistId?: string;
  revealed?: boolean;
  actualArtistId?: string;
  actualArtistName?: string;
  correct?: boolean;
}

export interface ActiveSessionInfo {
  id: string;
  status: SessionStatus;
  mode: SessionMode;
  roundLengthMs: number;
  totalRounds: number;
  participants: Participant[];
}
