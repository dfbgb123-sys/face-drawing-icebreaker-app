import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Countdown } from '../../../components/Countdown';
import { Button } from '../../../components/Button';
import { colors, fontMono } from '../../../theme';
import type { Participant } from '../../../types';

interface ProgressViewProps {
  roundLabel: string;
  timerEndsAt: number | null;
  submitCountLabel: string;
  participants: Participant[];
  onForceAdvance: () => void;
  onEndSession: () => void;
}

export function ProgressView({
  roundLabel,
  timerEndsAt,
  submitCountLabel,
  participants,
  onForceAdvance,
  onEndSession,
}: ProgressViewProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.roundLabel}>{roundLabel}</Text>
        <Countdown endsAt={timerEndsAt} />
        {submitCountLabel ? <Text style={styles.submitCount}>{submitCountLabel}</Text> : null}
      </View>

      <View style={styles.roster}>
        {participants.map((p) => (
          <View key={p.id} style={styles.rosterRow}>
            <View style={[styles.dot, p.connected && styles.dotConnected]} />
            <Text style={styles.rosterName}>{p.name}</Text>
            <Text style={styles.rosterSeat}>#{p.seatIndex + 1}</Text>
          </View>
        ))}
      </View>

      <Button title="다음 라운드로 넘기기" variant="secondary" onPress={onForceAdvance} />
      <Button title="세션 종료" variant="ghost" onPress={onEndSession} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  card: {
    alignItems: 'center',
    gap: 8,
    padding: 24,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  roundLabel: {
    fontFamily: fontMono,
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkSoft,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  submitCount: { fontSize: 15, color: colors.inkSoft },
  roster: { gap: 8 },
  rosterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.line },
  dotConnected: { backgroundColor: colors.accentViolet },
  rosterName: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.ink },
  rosterSeat: { fontSize: 12, color: colors.inkSoft },
});
