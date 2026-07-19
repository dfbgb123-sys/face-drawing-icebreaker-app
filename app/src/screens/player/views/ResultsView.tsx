import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { resolveUrl } from '../../../config';
import { colors, fontMono } from '../../../theme';
import { Button } from '../../../components/Button';
import { Text } from '../../../components/AppText';
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
    title = '마주본 얼굴';
    intro = '서로의 초상화를 비교해보세요';
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
        <View style={styles.duoColumn}>
          <View style={[styles.duoCard, styles.duoCardHighlight]}>
            <Text style={styles.duoLabel}>상대가 그린 내 그림</Text>
            <PortraitImage apiBase={apiBase} portrait={portraits[0] ?? null} emptyText="상대가 아직 제출하지 않았어요." />
          </View>
          <View style={styles.duoCard}>
            <Text style={styles.duoLabel}>내가 그린 그림</Text>
            <PortraitImage apiBase={apiBase} portrait={myDrawing} emptyText="아직 그림이 없어요." />
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
              <Button
                title="정답 보기"
                variant="secondary"
                style={styles.revealBtn}
                disabled={Boolean(guess.revealed) || current.missing}
                onPress={() => onRequestReveal(current)}
              />
              {guess.revealed ? (
                <View style={[styles.revealResult, guess.correct ? styles.revealCorrect : styles.revealWrong]}>
                  <Text
                    style={[
                      styles.revealResultText,
                      guess.correct ? styles.revealResultTextCorrect : styles.revealResultTextWrong,
                    ]}
                  >
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
  title: { fontSize: 20, fontWeight: '700', color: colors.ink },
  intro: { fontSize: 13, color: colors.inkSoft, textAlign: 'center' },
  duoColumn: { gap: 12 },
  duoCard: {
    gap: 8,
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  duoCardHighlight: {
    backgroundColor: colors.accentGreenTint,
    borderColor: colors.accentGreenDeep,
    borderWidth: 1.5,
  },
  duoLabel: { fontSize: 13, fontWeight: '700', color: colors.inkSoft, textAlign: 'center' },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  navBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  navBtnText: { fontSize: 18, fontWeight: '700', color: colors.ink },
  position: { fontFamily: fontMono, fontSize: 13, color: colors.inkSoft },
  ownerLabel: { fontSize: 14, fontWeight: '700', color: colors.inkSoft, textAlign: 'center' },
  imageBox: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  image: { width: '100%', height: '100%' },
  missingBox: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: { color: colors.inkSoft, fontSize: 13 },
  guessPanel: {
    marginTop: 8,
    gap: 8,
    padding: 18,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  guessPrompt: { fontSize: 13, color: colors.inkSoft },
  guessGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  guessOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  guessOptionSelected: { borderColor: colors.accentGreenDeep, backgroundColor: colors.accentGreenTint },
  guessOptionText: { fontSize: 13, color: colors.ink, fontWeight: '700' },
  guessOptionTextSelected: { color: colors.accentGreenInk },
  revealBtn: { alignSelf: 'center', marginTop: 8 },
  revealResult: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  revealCorrect: {},
  revealWrong: {},
  revealResultText: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  revealResultTextCorrect: { color: colors.accentGreenInk },
  revealResultTextWrong: { color: colors.danger },
});
