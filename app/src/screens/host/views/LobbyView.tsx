import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Participant, SessionMode } from '../../../types';
import { colors, fontMono } from '../../../theme';
import { MODE_META } from '../hostReducer';

interface LobbyViewProps {
  joinUrl: string | null;
  qrDataUrl: string | null;
  selectedMode: SessionMode;
  participants: Participant[];
  onRemoveParticipant: (participantId: string) => void;
  onStart: () => void;
  onEndSession: () => void;
}

export function LobbyView({
  joinUrl,
  qrDataUrl,
  selectedMode,
  participants,
  onRemoveParticipant,
  onStart,
  onEndSession,
}: LobbyViewProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.qrCard}>
        {qrDataUrl ? <Image source={{ uri: qrDataUrl }} style={styles.qrImage} /> : null}
        {joinUrl ? <Text style={styles.joinUrl}>{joinUrl}</Text> : null}
        <Text style={styles.modeLabel}>선택된 모드: {MODE_META[selectedMode].label}</Text>
        <Text style={styles.hint}>참가자들에게 QR코드를 보여주거나 위 주소를 알려주세요.</Text>
      </View>

      <View style={styles.roster}>
        {participants.map((p) => (
          <View key={p.id} style={styles.rosterRow}>
            <View style={[styles.dot, p.connected && styles.dotConnected]} />
            <Text style={styles.rosterName}>{p.name}</Text>
            <Text style={styles.rosterSeat}>#{p.seatIndex + 1}</Text>
            {!p.claimed ? (
              <TouchableOpacity onPress={() => onRemoveParticipant(p.id)} style={styles.removeBtn}>
                <Text style={styles.removeBtnText}>제외</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.startBtn} onPress={onStart}>
        <Text style={styles.startBtnText}>시작</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.endBtn} onPress={onEndSession}>
        <Text style={styles.endBtnText}>세션 종료</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  qrCard: {
    alignItems: 'center',
    gap: 8,
    padding: 22,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  qrImage: { width: 180, height: 180, borderRadius: 22 },
  joinUrl: {
    fontFamily: fontMono,
    fontSize: 13,
    color: colors.ink,
    backgroundColor: colors.surface2,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  modeLabel: { fontSize: 13, fontWeight: '600', color: colors.ink },
  hint: { fontSize: 12, color: colors.inkSoft, textAlign: 'center' },
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
  removeBtn: { paddingVertical: 4, paddingHorizontal: 4 },
  removeBtnText: { fontSize: 13, fontWeight: '700', color: colors.danger },
  startBtn: {
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  startBtnText: { color: colors.ink, fontSize: 16, fontWeight: '700' },
  endBtn: {
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: colors.ghostBg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  endBtnText: { color: colors.inkSoft, fontSize: 14, fontWeight: '600' },
});
