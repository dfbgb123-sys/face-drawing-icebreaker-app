import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Countdown } from '../../../components/Countdown';
import { colors } from '../../../theme';

interface RevealViewProps {
  revealEndsAt: number | null;
}

export function RevealView({ revealEndsAt }: RevealViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.roundLabel}>두구두구 🥁</Text>
      <Text style={styles.title}>결과를 준비하고 있어요!</Text>
      <Countdown endsAt={revealEndsAt} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  roundLabel: { fontSize: 13, color: colors.inkSoft },
  title: { fontSize: 20, fontWeight: '700', color: colors.ink },
});
