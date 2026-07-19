import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Countdown } from '../../../components/Countdown';
import { colors, fontFamily } from '../../../theme';
import { Text } from '../../../components/AppText';
import type { Assignment } from '../../../types';

interface IntermissionViewProps {
  assignment: Assignment | null;
  intermissionEndsAt: number | null;
}

export function IntermissionView({ assignment, intermissionEndsAt }: IntermissionViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.subject}>{assignment ? `${assignment.subjectName}님` : '...'}</Text>
      <Text style={styles.body}>그릴 준비를 해주세요.</Text>
      <Countdown endsAt={intermissionEndsAt} style={styles.timer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  subject: { fontFamily: fontFamily.bold, fontSize: 26, fontWeight: '800', color: colors.ink },
  body: { fontSize: 14, color: colors.inkSoft },
  timer: { fontSize: 48, marginTop: 8 },
});
