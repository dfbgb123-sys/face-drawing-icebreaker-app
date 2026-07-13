import type { ActiveSessionInfo, Participant, SessionMode } from '../types';

export interface ActiveSessionResponse {
  session: ActiveSessionInfo | null;
}

export async function fetchActiveSession(apiBase: string): Promise<ActiveSessionInfo | null> {
  const res = await fetch(`${apiBase}/api/sessions/active`);
  const data = (await res.json()) as ActiveSessionResponse;
  return data.session ?? null;
}

export interface CreateSessionPayload {
  participantNames: string[];
  roundLengthMs: number;
  mode: SessionMode;
}

export interface CreateSessionResult {
  sessionId: string;
  joinUrl: string;
  qrDataUrl: string;
  participants: Participant[];
  roundLengthMs: number;
  totalRounds: number;
  mode: SessionMode;
}

export class CreateSessionError extends Error {
  code: string;
  duplicates?: string[];
  constructor(code: string, message: string, duplicates?: string[]) {
    super(message);
    this.code = code;
    this.duplicates = duplicates;
  }
}

export async function createSession(
  apiBase: string,
  payload: CreateSessionPayload
): Promise<CreateSessionResult> {
  const res = await fetch(`${apiBase}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new CreateSessionError(data.code || 'UNKNOWN', data.message || '세션을 만들지 못했어요.', data.duplicates);
  }
  return data as CreateSessionResult;
}

export interface SubmitDrawingParams {
  participantId: string;
  clientToken: string;
  roundIndex: number;
}

export async function submitDrawing(
  apiBase: string,
  sessionId: string,
  params: SubmitDrawingParams,
  pngBytes: Uint8Array
): Promise<void> {
  const url =
    `${apiBase}/api/sessions/${sessionId}/drawings` +
    `?participantId=${encodeURIComponent(params.participantId)}` +
    `&clientToken=${encodeURIComponent(params.clientToken)}` +
    `&roundIndex=${params.roundIndex}`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'image/png' },
      body: pngBytes,
    });
  } catch {
    // Best-effort submit, mirrors the web client's fire-and-forget behavior.
  }
}
