import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Countdown } from '../../../components/Countdown';
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

      <TouchableOpacity style={styles.secondaryBtn} onPress={onForceAdvance}>
        <Text style={styles.secondaryBtnText}>다음 라운드로 넘기기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.endBtn} onPress={onEndSession}>
        <Text style={styles.endBtnText}>세션 종료</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  card: { alignItems: 'center', gap: 8, padding: 20, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd8cf' },
  roundLabel: { fontSize: 15, fontWeight: '600', color: '#232320' },
  submitCount: { fontSize: 13, color: '#6b6b66' },
  roster: { gap: 8 },
  rosterRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc' },
  dotConnected: { backgroundColor: '#4caf50' },
  rosterName: { flex: 1, fontSize: 14, color: '#232320' },
  rosterSeat: { fontSize: 12, color: '#9a9488' },
  secondaryBtn: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#232320' },
  secondaryBtnText: { color: '#232320', fontSize: 14, fontWeight: '600' },
  endBtn: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ddd8cf' },
  endBtnText: { color: '#6b6b66', fontSize: 14 },
});
