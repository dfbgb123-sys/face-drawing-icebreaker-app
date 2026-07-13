import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ResultsViewProps {
  onEndSession: () => void;
}

export function ResultsView({ onEndSession }: ResultsViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>모든 라운드가 끝났어요</Text>
      <Text style={styles.body}>
        각자 자기 화면에서 자신을 그린 그림들을 확인할 수 있어요.{'\n'}진행자도 직접 보고 싶다면, 참가자 화면에서
        본인 이름을 선택하면 돼요.
      </Text>
      <TouchableOpacity style={styles.endBtn} onPress={onEndSession}>
        <Text style={styles.endBtnText}>세션 완전히 종료</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#232320', textAlign: 'center' },
  body: { fontSize: 13, color: '#6b6b66', textAlign: 'center', lineHeight: 20 },
  endBtn: { marginTop: 8, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, borderWidth: 1, borderColor: '#ddd8cf' },
  endBtnText: { color: '#6b6b66', fontSize: 14 },
});
