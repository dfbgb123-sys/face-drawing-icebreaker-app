import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { useCountdown } from '../hooks/useCountdown';

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
    fontSize: 32,
    fontWeight: '700',
    color: '#232320',
    textAlign: 'center',
  },
  warning: {
    color: '#d94f26',
  },
});
