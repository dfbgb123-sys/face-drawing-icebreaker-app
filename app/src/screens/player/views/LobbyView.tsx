import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LobbyViewProps {
  name: string | null;
}

export function LobbyView({ name }: LobbyViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name ? `${name}님, 환영해요!` : '환영해요!'}</Text>
      <Text style={styles.body}>진행자가 시작하면 바로 알려드릴게요. 잠시만 기다려주세요.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 22, fontWeight: '700', color: '#232320' },
  body: { fontSize: 14, color: '#6b6b66', textAlign: 'center' },
});
