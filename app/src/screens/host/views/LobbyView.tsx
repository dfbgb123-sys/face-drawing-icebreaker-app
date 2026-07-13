import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Participant, SessionMode } from '../../../types';
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
  qrCard: { alignItems: 'center', gap: 6, padding: 16, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd8cf' },
  qrImage: { width: 180, height: 180 },
  joinUrl: { fontSize: 13, color: '#232320' },
  modeLabel: { fontSize: 13, fontWeight: '600', color: '#232320' },
  hint: { fontSize: 12, color: '#9a9488', textAlign: 'center' },
  roster: { gap: 8 },
  rosterRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc' },
  dotConnected: { backgroundColor: '#4caf50' },
  rosterName: { flex: 1, fontSize: 14, color: '#232320' },
  rosterSeat: { fontSize: 12, color: '#9a9488' },
  removeBtn: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#f6e6e0' },
  removeBtnText: { fontSize: 12, color: '#c0392b' },
  startBtn: { paddingVertical: 14, borderRadius: 10, backgroundColor: '#232320', alignItems: 'center' },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  endBtn: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ddd8cf' },
  endBtnText: { color: '#6b6b66', fontSize: 14 },
});
