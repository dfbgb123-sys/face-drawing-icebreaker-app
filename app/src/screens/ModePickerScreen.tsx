import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ModePickerScreenProps {
  apiBase: string;
  onPickPlayer: () => void;
  onPickHost: () => void;
  onChangeServer: () => void;
}

export function ModePickerScreen({ apiBase, onPickPlayer, onPickHost, onChangeServer }: ModePickerScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>얼굴 그리기 아이스브레이커</Text>
        <Text style={styles.subtitle}>{apiBase}</Text>

        <TouchableOpacity style={styles.card} onPress={onPickPlayer}>
          <Text style={styles.cardIcon}>🙋</Text>
          <Text style={styles.cardTitle}>참가자로 입장</Text>
          <Text style={styles.cardBody}>이름을 선택하고 그림을 그려요.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={onPickHost}>
          <Text style={styles.cardIcon}>🎛️</Text>
          <Text style={styles.cardTitle}>진행자 모드</Text>
          <Text style={styles.cardBody}>세션을 만들고 게임을 진행해요.</Text>
        </TouchableOpacity>

        <Text style={styles.changeServer} onPress={onChangeServer}>
          서버 주소 변경
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f2' },
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#232320', textAlign: 'center' },
  subtitle: { fontSize: 12, color: '#9a9488', textAlign: 'center', marginBottom: 8 },
  card: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd8cf',
    gap: 4,
  },
  cardIcon: { fontSize: 28 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#232320' },
  cardBody: { fontSize: 13, color: '#6b6b66' },
  changeServer: {
    marginTop: 16,
    fontSize: 13,
    color: '#9a9488',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
