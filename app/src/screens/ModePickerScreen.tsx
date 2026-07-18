import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

interface ModePickerScreenProps {
  apiBase: string;
  onPickPlayer: () => void;
  onPickHost: () => void;
}

export function ModePickerScreen({ apiBase, onPickPlayer, onPickHost }: ModePickerScreenProps) {
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 22, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  subtitle: { fontSize: 12, color: colors.inkSoft, textAlign: 'center', marginBottom: 8 },
  card: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 4,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  cardIcon: { fontSize: 28 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.ink },
  cardBody: { fontSize: 13, color: colors.inkSoft },
});
