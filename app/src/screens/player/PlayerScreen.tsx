import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { Alert, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/AppText';
import { useApiBase } from '../../context/ApiBaseContext';
import { resolveUrl } from '../../config';
import { useSocket } from '../../hooks/useSocket';
import { clearIdentity, loadIdentity, saveIdentity } from '../../services/identity';
import { fetchActiveSession, submitDrawing } from '../../services/api';
import type { DrawingCanvasHandle } from '../../components/DrawingCanvas';
import { TopBarExit } from '../../components/TopBarExit';
import { PaperBackground } from '../../components/PaperBackground';
import { colors, fontFamily } from '../../theme';
import type { Assignment, Portrait, SessionStatus } from '../../types';
import { initialPlayerState, playerReducer } from './playerReducer';
import { NoneView } from './views/NoneView';
import { JoinView } from './views/JoinView';
import { LobbyView } from './views/LobbyView';
import { IntermissionView } from './views/IntermissionView';
import { DrawingView } from './views/DrawingView';
import { RevealView } from './views/RevealView';
import { ResultsView } from './views/ResultsView';

interface PlayerScreenProps {
  onExit: () => void;
}

export function PlayerScreen({ onExit }: PlayerScreenProps) {
  const apiBase = useApiBase();
  const socket = useSocket(apiBase);
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const canvasWidth = Math.min(windowWidth - 32, 420);
  // 세로로 긴 캔버스를 쓰되, 헤더/툴바/제출 버튼이 들어갈 공간(약 360dp)을 미리 빼서
  // "제출하기" 버튼이 화면 밖으로 밀려나지 않게 화면 높이 기준 상한을 둔다.
  const canvasHeight = Math.min(Math.round((canvasWidth * 4) / 3), Math.round(windowHeight - 360));

  const loadJoinScreen = useCallback(async () => {
    dispatch({ type: 'loading' });
    const session = await fetchActiveSession(apiBase);
    if (!session || session.status === 'ended') {
      dispatch({ type: 'showNone', title: '아직 세션이 없어요', body: '진행자가 세션을 만들 때까지 기다려주세요.' });
      return;
    }
    if (session.status !== 'lobby') {
      dispatch({ type: 'showNone', title: '이미 게임이 진행 중이에요', body: '이번 게임이 끝날 때까지 기다려주세요.' });
      return;
    }
    dispatch({
      type: 'showJoin',
      sessionId: session.id,
      mode: session.mode,
      participants: session.participants,
    });
  }, [apiBase]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const identity = await loadIdentity();
      if (cancelled) return;
      if (!identity) {
        await loadJoinScreen();
        return;
      }
      dispatch({
        type: 'prepRejoin',
        sessionId: identity.sessionId,
        participantId: identity.participantId,
        clientToken: identity.clientToken,
      });
      socket.emit('player:rejoin', identity, (res: any) => {
        if (cancelled) return;
        if (!res || !res.ok) {
          clearIdentity();
          loadJoinScreen();
          return;
        }
        dispatch({ type: 'applySnapshot', snapshot: res.snapshot });
      });
    })();
    return () => {
      cancelled = true;
    };
    // Runs once per screen mount; loadJoinScreen is stable via apiBase closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onLobbyUpdate = (data: { participants: any[]; status: SessionStatus }) => {
      dispatch({ type: 'lobbyUpdate', participants: data.participants, status: data.status });
    };
    const onAssignment = (data: Assignment) => {
      dispatch({ type: 'assignment', assignment: data });
    };
    const onIntermission = (data: { intermissionEndsAt: number }) => {
      dispatch({ type: 'intermission', intermissionEndsAt: data.intermissionEndsAt });
    };
    const onRoundStart = (data: { roundIndex: number; totalRounds: number; roundEndsAt: number }) => {
      dispatch({ type: 'roundStart', roundIndex: data.roundIndex, totalRounds: data.totalRounds, roundEndsAt: data.roundEndsAt });
    };
    const onRoundEnd = () => dispatch({ type: 'roundEnd' });
    const onRevealWait = (data: { revealEndsAt: number }) => {
      dispatch({ type: 'revealWait', revealEndsAt: data.revealEndsAt });
    };
    const onPortraits = (data: { mode?: any; portraits?: Portrait[]; myDrawing?: Portrait | null }) => {
      dispatch({ type: 'results', mode: data.mode ?? null, portraits: data.portraits || [], myDrawing: data.myDrawing || null });
    };

    socket.on('session:lobby-update', onLobbyUpdate);
    socket.on('round:assignment', onAssignment);
    socket.on('session:intermission', onIntermission);
    socket.on('session:round-start', onRoundStart);
    socket.on('round:end', onRoundEnd);
    socket.on('session:reveal-wait', onRevealWait);
    socket.on('results:your-portraits', onPortraits);

    return () => {
      socket.off('session:lobby-update', onLobbyUpdate);
      socket.off('round:assignment', onAssignment);
      socket.off('session:intermission', onIntermission);
      socket.off('session:round-start', onRoundStart);
      socket.off('round:end', onRoundEnd);
      socket.off('session:reveal-wait', onRevealWait);
      socket.off('results:your-portraits', onPortraits);
    };
  }, [socket]);

  useEffect(() => {
    if (state.view !== 'drawing' || state.submittedThisRound) return;
    const assignment = state.pendingAssignment;
    if (state.sessionMode === 'baton' && assignment?.canvasUrl) {
      canvasRef.current?.loadBackground(resolveUrl(apiBase, assignment.canvasUrl) ?? null);
    } else {
      canvasRef.current?.clear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.view, state.pendingAssignment?.roundIndex, state.submittedThisRound]);

  const joinAsParticipant = useCallback(
    (participantId: string, name: string) => {
      socket.emit('player:join', { participantId }, (res: any) => {
        if (!res || !res.ok) {
          const messages: Record<string, string> = {
            NAME_TAKEN: '다른 사람이 이미 선택한 이름이에요.',
            NO_LOBBY: '이미 시작됐거나 세션이 없어요.',
          };
          Alert.alert('입장하지 못했어요', (res && messages[res.code]) || '다시 시도해주세요.');
          loadJoinScreen();
          return;
        }
        dispatch({ type: 'joined', participantId, clientToken: res.clientToken, name });
        if (state.sessionId) {
          saveIdentity({ sessionId: state.sessionId, participantId, clientToken: res.clientToken });
        }
        dispatch({ type: 'applySnapshot', snapshot: res.snapshot });
      });
    },
    [socket, state.sessionId, loadJoinScreen]
  );

  const backToJoin = useCallback(() => {
    socket.emit('player:leave', {}, () => {});
    clearIdentity();
    loadJoinScreen();
  }, [socket, loadJoinScreen]);

  const doSubmit = useCallback(() => {
    if (
      state.submittedThisRound ||
      !state.pendingAssignment ||
      !state.sessionId ||
      !state.participantId ||
      !state.clientToken
    ) {
      return;
    }
    const assignment = state.pendingAssignment;
    dispatch({ type: 'submitted' });
    const bytes = canvasRef.current?.capturePng();
    if (bytes) {
      submitDrawing(
        apiBase,
        state.sessionId,
        { participantId: state.participantId, clientToken: state.clientToken, roundIndex: assignment.roundIndex },
        bytes
      );
    }
  }, [apiBase, state.submittedThisRound, state.pendingAssignment, state.sessionId, state.participantId, state.clientToken]);

  const goPrevPortrait = useCallback(() => {
    if (!state.portraits.length) return;
    dispatch({ type: 'portraitIndex', index: (state.portraitIndex - 1 + state.portraits.length) % state.portraits.length });
  }, [state.portraits.length, state.portraitIndex]);

  const goNextPortrait = useCallback(() => {
    if (!state.portraits.length) return;
    dispatch({ type: 'portraitIndex', index: (state.portraitIndex + 1) % state.portraits.length });
  }, [state.portraits.length, state.portraitIndex]);

  const selectGuess = useCallback(
    (roundIndex: number, guessedArtistId: string) => {
      dispatch({ type: 'guessSelected', roundIndex, guessedArtistId });
      socket.emit('player:submit-guess', { roundIndex, guessedArtistId }, () => {});
    },
    [socket]
  );

  const requestReveal = useCallback(
    (portrait: Portrait) => {
      socket.emit('player:request-reveal', { roundIndex: portrait.roundIndex }, (res: any) => {
        if (!res || !res.ok) return;
        dispatch({
          type: 'guessRevealed',
          roundIndex: portrait.roundIndex,
          actualArtistId: res.actualArtistId,
          actualArtistName: res.actualArtistName,
          correct: res.correct,
        });
      });
    },
    [socket]
  );

  return (
    <PaperBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <TopBarExit onPress={onExit} />
        </View>
      {state.view === 'loading' ? (
        <View style={styles.centered}>
          <Text style={styles.muted}>불러오는 중...</Text>
        </View>
      ) : null}
      {state.view === 'none' && state.noneMessage ? (
        <NoneView title={state.noneMessage.title} body={state.noneMessage.body} onRetry={loadJoinScreen} />
      ) : null}
      {state.view === 'join' ? <JoinView participants={state.allParticipants} onJoin={joinAsParticipant} /> : null}
      {state.view === 'lobby' ? <LobbyView name={state.myName} onBack={backToJoin} /> : null}
      {state.view === 'intermission' ? (
        <IntermissionView assignment={state.pendingAssignment} intermissionEndsAt={state.intermissionEndsAt} />
      ) : null}
      {state.view === 'drawing' ? (
        <DrawingView
          canvasRef={canvasRef}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          roundIndex={state.currentRoundIndex}
          totalRounds={state.totalRounds}
          roundEndsAt={state.roundEndsAt}
          assignment={state.pendingAssignment}
          sessionMode={state.sessionMode}
          submitted={state.submittedThisRound}
          onSubmit={doSubmit}
        />
      ) : null}
      {state.view === 'reveal' ? <RevealView revealEndsAt={state.revealEndsAt} /> : null}
      {state.view === 'results' ? (
        <ResultsView
          apiBase={apiBase}
          sessionMode={state.sessionMode}
          portraits={state.portraits}
          portraitIndex={state.portraitIndex}
          myDrawing={state.myDrawing}
          allParticipants={state.allParticipants}
          myParticipantId={state.participantId}
          guessState={state.guessState}
          onPrev={goPrevPortrait}
          onNext={goNextPortrait}
          onSelectGuess={selectGuess}
          onRequestReveal={requestReveal}
        />
      ) : null}
      {state.view === 'ended' ? (
        <View style={styles.centered}>
          <Text style={styles.title}>라운드가 종료되었어요</Text>
          <Text style={styles.muted}>즐거운 시간이 되셨기 바랍니다!</Text>
        </View>
      ) : null}
      </SafeAreaView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  topBar: { paddingHorizontal: 8, paddingTop: 4 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  title: { fontFamily: fontFamily.bold, fontSize: 20, fontWeight: '700', color: colors.ink },
  muted: { fontSize: 14, color: colors.inkSoft },
});
