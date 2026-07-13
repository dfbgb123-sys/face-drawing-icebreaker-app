import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>다시 확인하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#232320' },
  body: { fontSize: 14, color: '#6b6b66', textAlign: 'center' },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#232320',
  },
  buttonText: { fontSize: 15, fontWeight: '600', color: '#232320' },
});
