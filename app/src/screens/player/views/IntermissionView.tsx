import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Countdown } from '../../../components/Countdown';
import type { Assignment } from '../../../types';

interface IntermissionViewProps {
  assignment: Assignment | null;
  intermissionEndsAt: number | null;
}

export function IntermissionView({ assignment, intermissionEndsAt }: IntermissionViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.roundLabel}>다음 순서</Text>
      <Text style={styles.subject}>{assignment ? `${assignment.subjectName}님` : '...'}</Text>
      <Countdown endsAt={intermissionEndsAt} />
      <Text style={styles.body}>그릴 준비를 해주세요.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  roundLabel: { fontSize: 13, color: '#9a9488' },
  subject: { fontSize: 22, fontWeight: '700', color: '#232320' },
  body: { fontSize: 14, color: '#6b6b66' },
});
