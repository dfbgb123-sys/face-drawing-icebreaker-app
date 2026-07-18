import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme';
import { Button } from '../../../components/Button';

interface NoneViewProps {
  title: string;
  body: string;
  onRetry: () => void;
}

export function NoneView({ title, body, onRetry }: NoneViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      <Button title="다시 확인하기" variant="secondary" style={styles.button} onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: colors.ink },
  body: { fontSize: 14, color: colors.inkSoft, textAlign: 'center' },
  button: { marginTop: 12 },
});
