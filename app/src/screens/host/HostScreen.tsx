import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/AppText';
import { useApiBase } from '../../context/ApiBaseContext';
import { useSocket } from '../../hooks/useSocket';
import { createSession, CreateSessionError, fetchActiveSession } from '../../services/api';
import { colors, fontFamily } from '../../theme';
import { TopBarExit } from '../../components/TopBarExit';
import { PaperBackground } from '../../components/PaperBackground';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import type { SessionStatus } from '../../types';
import { hostReducer, initialHostState } from './hostReducer';
import { SetupView } from './views/SetupView';
import { LobbyView } from './views/LobbyView';
import { ProgressView } from './views/ProgressView';
import { ResultsView } from './views/ResultsView';
import { loadHostSessionApiBase, saveHostSessionApiBase, clearHostSessionApiBase } from '../../config';
import { pickInstance } from '../../instances';

interface HostScreenProps {
  onExit: () => void;
}

export function HostScreen({ onExit }: HostScreenProps) {
  const defaultApiBase = useApiBase();
  const [hostApiBase, setHostApiBase] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 재시작 복귀라면 저장된 인스턴스를 그대로 쓰고, 새 세션을 만드는 거라면
      // 이 시점에 인스턴스 목록 중 하나를 미리 골라 이 진행자 세션 내내 고정해서 쓴다.
      const stored = await loadHostSessionApiBase();
      const resolved = stored || pickInstance(defaultApiBase);
      if (!cancelled) setHostApiBase(resolved);
    })();
    return () => {
      cancelled = true;
    };
  }, [defaultApiBase]);

  if (!hostApiBase) return null;

  return <HostScreenInner apiBase={hostApiBase} onExit={onExit} />;
}

function HostScreenInner({ apiBase, onExit }: { apiBase: string; onExit: () => void }) {
  const socket = useSocket(apiBase);
  const [state, dispatch] = useReducer(hostReducer, initialHostState);
  const [confirmEndVisible, setConfirmEndVisible] = useState(false);

  const hostJoin = useCallback(() => {
    socket.emit('host:join', {}, (res: any) => {
      if (!res || !res.ok) return;
      dispatch({ type: 'snapshot', snapshot: res.snapshot });
    });
  }, [socket]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = await fetchActiveSession(apiBase);
      if (cancelled) return;
      if (!session || session.status === 'ended') {
        dispatch({ type: 'showSetup' });
        return;
      }
      dispatch({ type: 'selectMode', mode: session.mode || 'portrait' });
      hostJoin();
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onLobbyUpdate = (data: { participants: any[]; status: SessionStatus }) => {
      dispatch({ type: 'lobbyUpdate', participants: data.participants, status: data.status });
    };
    const onIntermission = (data: { roundIndex: number; totalRounds: number; intermissionEndsAt: number }) => {
      dispatch({ type: 'intermission', ...data });
    };
    const onRoundStart = (data: { roundIndex: number; totalRounds: number; roundEndsAt: number }) => {
      dispatch({ type: 'roundStart', ...data });
    };
    const onSubmissionProgress = (data: { submittedCount: number; totalExpected: number }) => {
      dispatch({ type: 'submissionProgress', ...data });
    };
    const onRevealWait = (data: { revealEndsAt: number }) => {
      dispatch({ type: 'revealWait', revealEndsAt: data.revealEndsAt });
    };
    const onResultsReady = () => dispatch({ type: 'resultsReady' });

    socket.on('session:lobby-update', onLobbyUpdate);
    socket.on('session:intermission', onIntermission);
    socket.on('session:round-start', onRoundStart);
    socket.on('round:submission-progress', onSubmissionProgress);
    socket.on('session:reveal-wait', onRevealWait);
    socket.on('session:results-ready', onResultsReady);

    return () => {
      socket.off('session:lobby-update', onLobbyUpdate);
      socket.off('session:intermission', onIntermission);
      socket.off('session:round-start', onRoundStart);
      socket.off('round:submission-progress', onSubmissionProgress);
      socket.off('session:reveal-wait', onRevealWait);
      socket.off('session:results-ready', onResultsReady);
    };
  }, [socket]);

  const handleCreate = useCallback(
    async (names: string[], minutes: number) => {
      dispatch({ type: 'setupError', message: null });
      if (state.selectedMode === 'portrait' && names.length !== 2) {
        dispatch({ type: 'setupError', message: '1:1 모드는 참가자가 정확히 2명이어야 해요.' });
        return;
      }
      try {
        const result = await createSession(apiBase, {
          participantNames: names,
          roundLengthMs: Math.round(minutes * 60 * 1000),
          mode: state.selectedMode,
        });
        await saveHostSessionApiBase(apiBase);
        dispatch({
          type: 'sessionCreated',
          sessionId: result.sessionId,
          qrDataUrl: result.qrDataUrl,
          participants: result.participants,
        });
        hostJoin();
      } catch (err) {
        if (err instanceof CreateSessionError) {
          const messages: Record<string, string> = {
            TOO_FEW_PARTICIPANTS: '최소 2명 이상의 이름을 입력해주세요.',
            PORTRAIT_REQUIRES_TWO: '1:1 모드는 참가자가 정확히 2명이어야 해요.',
            BATON_TOO_MANY_PARTICIPANTS: '바톤터치는 최대 15명까지 가능해요.',
            SESSION_ACTIVE: '이미 진행 중인 세션이 있어요. 앱을 재시작하면 이어서 진행할 수 있어요.',
            DUPLICATE_NAMES: `이름이 겹쳐요: ${(err.duplicates || []).join(', ')} — 서로 다른 이름으로 입력해주세요.`,
          };
          dispatch({ type: 'setupError', message: messages[err.code] || err.message });
        } else {
          dispatch({ type: 'setupError', message: '세션을 만들지 못했어요. 서버 연결을 확인해주세요.' });
        }
      }
    },
    [apiBase, state.selectedMode, hostJoin]
  );

  const startSession = useCallback(() => {
    socket.emit('host:start-session', {}, (res: any) => {
      if (!res || !res.ok) {
        const messages: Record<string, string> = {
          TOO_FEW_PARTICIPANTS: '최소 3명이 필요해요.',
          ALREADY_STARTED: '이미 시작된 세션이에요.',
        };
        Alert.alert('시작하지 못했어요', (res && messages[res.code]) || '다시 시도해주세요.');
      }
    });
  }, [socket]);

  const forceAdvance = useCallback(() => {
    socket.emit('host:force-advance', {}, () => {});
  }, [socket]);

  const endSession = useCallback(() => {
    setConfirmEndVisible(true);
  }, []);

  const confirmEndSession = useCallback(() => {
    setConfirmEndVisible(false);
    socket.emit('host:end-session', {}, () => {
      clearHostSessionApiBase();
      dispatch({ type: 'lobbyUpdate', participants: state.participants, status: 'ended' });
    });
  }, [socket, state.participants]);

  return (
    <PaperBackground>
      <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TopBarExit onPress={onExit} />
      </View>
      {state.view === 'setup' ? (
        <SetupView
          selectedMode={state.selectedMode}
          setupError={state.setupError}
          onSelectMode={(mode) => dispatch({ type: 'selectMode', mode })}
          onCreate={handleCreate}
        />
      ) : null}
      {state.view === 'lobby' ? (
        <LobbyView
          qrDataUrl={state.qrDataUrl}
          selectedMode={state.selectedMode}
          participants={state.participants}
          onStart={startSession}
          onEndSession={endSession}
        />
      ) : null}
      {state.view === 'progress' ? (
        <ProgressView
          roundLabel={state.roundLabel}
          timerEndsAt={state.timerEndsAt}
          submitCountLabel={state.submitCountLabel}
          participants={state.participants}
          showForceAdvance={!(state.selectedMode === 'portrait' && state.revealWait)}
          onForceAdvance={forceAdvance}
          onEndSession={endSession}
        />
      ) : null}
      {state.view === 'results' ? <ResultsView onEndSession={endSession} /> : null}
      {state.view === 'ended' ? (
        <View style={styles.centered}>
          <Text style={styles.title}>세션이 종료됐어요</Text>
          <Text style={styles.muted}>
            새 모임을 시작하려면 아래로 돌아가서{'\n'}참가자 명단을 다시 입력하세요.
          </Text>
          <Button
            title="새 세션 만들기"
            variant="primary"
            style={styles.newSessionBtn}
            onPress={() => dispatch({ type: 'showSetup' })}
          />
        </View>
      ) : null}
      <ConfirmDialog
        visible={confirmEndVisible}
        title="드로잉을 마무리할까요?"
        message="그림은 자동 저장되지 않아요."
        confirmLabel="종료"
        destructive
        onConfirm={confirmEndSession}
        onCancel={() => setConfirmEndVisible(false)}
      />
      </SafeAreaView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  topBar: { paddingHorizontal: 8, paddingTop: 4 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  title: { fontFamily: fontFamily.bold, fontSize: 20, fontWeight: '700', color: colors.ink },
  muted: { fontSize: 14, color: colors.inkSoft, textAlign: 'center', lineHeight: 20 },
  newSessionBtn: { marginTop: 8 },
});
