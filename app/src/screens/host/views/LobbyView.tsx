import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import type { Participant, SessionMode } from '../../../types';
import { colors } from '../../../theme';
import { Button } from '../../../components/Button';
import { Text } from '../../../components/AppText';
import { MODE_META } from '../hostReducer';

interface LobbyViewProps {
  qrDataUrl: string | null;
  selectedMode: SessionMode;
  participants: Participant[];
  onStart: () => void;
  onEndSession: () => void;
}

export function LobbyView({ qrDataUrl, selectedMode, participants, onStart, onEndSession }: LobbyViewProps) {
  const isPortrait = selectedMode === 'portrait';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.qrCard}>
        {qrDataUrl ? <Image source={{ uri: qrDataUrl }} style={styles.qrImage} /> : null}
        {isPortrait ? (
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>{MODE_META[selectedMode].label}</Text>
          </View>
        ) : (
          <Text style={styles.modeLabel}>{MODE_META[selectedMode].label}</Text>
        )}
      </View>

      <View style={styles.roster}>
        {participants.map((p) => (
          <View key={p.id} style={styles.rosterRow}>
            <View style={[styles.dot, p.connected && styles.dotConnected]} />
            <Text style={styles.rosterName}>{p.name}</Text>
            <Text style={[styles.statusText, p.connected && styles.statusTextConnected]}>
              {p.connected ? '참여완료' : '대기'}
            </Text>
          </View>
        ))}
      </View>

      <Button title="시작" variant="primary" onPress={onStart} />
      <Button title="세션 종료" variant="ghost" onPress={onEndSession} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  qrCard: {
    alignItems: 'center',
    gap: 12,
    padding: 22,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  qrImage: { width: 180, height: 180, borderRadius: 22 },
  modeLabel: { fontSize: 16, fontWeight: '700', color: colors.ink },
  modeBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.accentGreenTint,
  },
  modeBadgeText: { fontSize: 16, fontWeight: '800', color: colors.accentGreenInk },
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
  dotConnected: { backgroundColor: colors.accentGreenDeep },
  rosterName: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.ink },
  statusText: { fontSize: 13, fontWeight: '700', color: colors.ink, textAlign: 'right' },
  statusTextConnected: { color: colors.accentGreenInk },
});
