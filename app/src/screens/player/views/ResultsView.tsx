import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { resolveUrl } from '../../../config';
import type { GuessState, Participant, Portrait, SessionMode } from '../../../types';

interface ResultsViewProps {
  apiBase: string;
  sessionMode: SessionMode | null;
  portraits: Portrait[];
  portraitIndex: number;
  myDrawing: Portrait | null;
  allParticipants: Participant[];
  myParticipantId: string | null;
  guessState: Record<number, GuessState>;
  onPrev: () => void;
  onNext: () => void;
  onSelectGuess: (roundIndex: number, guessedArtistId: string) => void;
  onRequestReveal: (portrait: Portrait) => void;
}

function PortraitImage({ apiBase, portrait, emptyText }: { apiBase: string; portrait: Portrait | null; emptyText: string }) {
  if (!portrait || portrait.missing) {
    return (
      <View style={styles.missingBox}>
        <Text style={styles.missingText}>{emptyText}</Text>
      </View>
    );
  }
  const uri = resolveUrl(apiBase, portrait.pngUrl);
  return (
    <View style={styles.imageBox}>
      <Image source={{ uri }} style={styles.image} resizeMode="contain" />
    </View>
  );
}

export function ResultsView({
  apiBase,
  sessionMode,
  portraits,
  portraitIndex,
  myDrawing,
  allParticipants,
  myParticipantId,
  guessState,
  onPrev,
  onNext,
  onSelectGuess,
  onRequestReveal,
}: ResultsViewProps) {
  const isPortraitMode = sessionMode === 'portrait';
  const isBatonMode = sessionMode === 'baton';

  let title = '나를 그린 그림들';
  let intro = '';
  if (isPortraitMode) {
    title = '서로를 그린 그림';
    intro = '내가 그린 그림과 상대가 그려준 그림을 비교해보세요.';
  } else if (isBatonMode) {
    title = '완성된 캔버스들';
    intro = '내 캔버스부터 순서대로 모두의 완성작을 확인해보세요.';
  } else {
    const receivedCount = portraits.filter((p) => !p.missing).length;
    intro = receivedCount > 0 ? `총 ${receivedCount}장을 확인할 수 있어요.` : '아쉽게도 받은 그림이 없어요.';
  }

  const current = portraits[portraitIndex] ?? null;
  const guess = current ? guessState[current.roundIndex] ?? {} : {};

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.icon}>🎨</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.intro}>{intro}</Text>

      {isPortraitMode ? (
        <View style={styles.duoRow}>
          <View style={styles.duoCard}>
            <Text style={styles.duoLabel}>내가 그린 그림</Text>
            <PortraitImage apiBase={apiBase} portrait={myDrawing} emptyText="아직 그림이 없어요." />
          </View>
          <View style={styles.duoCard}>
            <Text style={styles.duoLabel}>상대가 그린 내 그림</Text>
            <PortraitImage apiBase={apiBase} portrait={portraits[0] ?? null} emptyText="상대가 아직 제출하지 않았어요." />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.navRow}>
            <TouchableOpacity onPress={onPrev} style={styles.navBtn}>
              <Text style={styles.navBtnText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.position}>
              {portraits.length ? `${portraitIndex + 1} / ${portraits.length}` : '0 / 0'}
            </Text>
            <TouchableOpacity onPress={onNext} style={styles.navBtn}>
              <Text style={styles.navBtnText}>›</Text>
            </TouchableOpacity>
          </View>
          {current?.ownerName ? (
            <Text style={styles.ownerLabel}>{current.isMine ? '내 캔버스' : `${current.ownerName}님의 캔버스`}</Text>
          ) : null}
          <PortraitImage apiBase={apiBase} portrait={current} emptyText="받은 그림이 없어요." />

          {!isBatonMode && current ? (
            <View style={styles.guessPanel}>
              <Text style={styles.guessPrompt}>누가 그렸을까요?</Text>
              <View style={styles.guessGrid}>
                {allParticipants
                  .filter((p) => p.id !== myParticipantId)
                  .map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.guessOption, guess.guessedArtistId === p.id && styles.guessOptionSelected]}
                      disabled={Boolean(guess.revealed)}
                      onPress={() => onSelectGuess(current.roundIndex, p.id)}
                    >
                      <Text
                        style={[
                          styles.guessOptionText,
                          guess.guessedArtistId === p.id && styles.guessOptionTextSelected,
                        ]}
                      >
                        {p.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
              <TouchableOpacity
                style={[styles.revealBtn, (guess.revealed || current.missing) && styles.revealBtnDisabled]}
                disabled={Boolean(guess.revealed) || current.missing}
                onPress={() => onRequestReveal(current)}
              >
                <Text style={styles.revealBtnText}>정답 보기</Text>
              </TouchableOpacity>
              {guess.revealed ? (
                <View style={[styles.revealResult, guess.correct ? styles.revealCorrect : styles.revealWrong]}>
                  <Text style={styles.revealResultText}>
                    {guess.correct
                      ? `정답이에요! ${guess.actualArtistName}님이 그렸어요.`
                      : `아쉬워요, 실제로는 ${guess.actualArtistName}님이 그렸어요.`}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  icon: { fontSize: 20 },
  title: { fontSize: 20, fontWeight: '700', color: '#232320' },
  intro: { fontSize: 13, color: '#6b6b66', textAlign: 'center' },
  duoRow: { flexDirection: 'row', gap: 12 },
  duoCard: { flex: 1, gap: 6, alignItems: 'center' },
  duoLabel: { fontSize: 13, color: '#6b6b66' },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  navBtn: { padding: 8 },
  navBtnText: { fontSize: 24, color: '#232320' },
  position: { fontSize: 14, color: '#6b6b66' },
  ownerLabel: { fontSize: 14, fontWeight: '600', color: '#232320', textAlign: 'center' },
  imageBox: { width: '100%', aspectRatio: 4 / 3, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff' },
  image: { width: '100%', height: '100%' },
  missingBox: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd8cf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: { color: '#9a9488', fontSize: 13 },
  guessPanel: { marginTop: 8, gap: 8 },
  guessPrompt: { fontSize: 13, color: '#6b6b66' },
  guessGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  guessOption: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd8cf',
    backgroundColor: '#fff',
  },
  guessOptionSelected: { backgroundColor: '#232320' },
  guessOptionText: { fontSize: 13, color: '#232320' },
  guessOptionTextSelected: { color: '#fff' },
  revealBtn: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#232320',
  },
  revealBtnDisabled: { opacity: 0.4 },
  revealBtnText: { fontSize: 14, fontWeight: '600', color: '#232320' },
  revealResult: { padding: 10, borderRadius: 8 },
  revealCorrect: { backgroundColor: '#e4f0e0' },
  revealWrong: { backgroundColor: '#f6e6e0' },
  revealResultText: { fontSize: 13, color: '#232320', textAlign: 'center' },
});
