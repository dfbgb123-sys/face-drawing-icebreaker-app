import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { useCountdown } from '../hooks/useCountdown';
import { colors, fontMono } from '../theme';
import { Text } from './AppText';

interface CountdownProps {
  endsAt: number | null | undefined;
  onDone?: () => void;
  style?: TextStyle;
}

export function Countdown({ endsAt, onDone, style }: CountdownProps) {
  const { label, isWarning } = useCountdown(endsAt, { onDone });
  return <Text style={[styles.timer, isWarning && styles.warning, style]}>{label}</Text>;
}

const styles = StyleSheet.create({
  timer: {
    fontFamily: fontMono,
    fontSize: 32,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
  },
  warning: {
    color: colors.danger,
  },
});
