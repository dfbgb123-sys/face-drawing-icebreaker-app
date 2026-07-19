import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors, fontFamily } from '../../../theme';
import { Text } from '../../../components/AppText';

interface LobbyViewProps {
  name: string | null;
  onBack: () => void;
}

export function LobbyView({ name, onBack }: LobbyViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name ? `${name}님, 환영해요!` : '환영해요!'}</Text>
      <View style={styles.noticeBox}>
        <Text style={styles.body}>진행자가 시작하면 바로 알려드릴게요.{'\n'}잠시만 기다려주세요.</Text>
      </View>
      <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.backButton}>
        <Text style={styles.backText}>다시 유저 선택하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontFamily: fontFamily.bold, fontSize: 22, fontWeight: '700', color: colors.ink },
  noticeBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  body: { fontSize: 14, color: colors.inkSoft, textAlign: 'center' },
  backButton: { marginTop: 20, paddingVertical: 8, paddingHorizontal: 12 },
  backText: { fontSize: 13, fontWeight: '600', color: colors.inkSoft, textDecorationLine: 'underline' },
});
