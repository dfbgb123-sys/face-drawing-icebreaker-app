import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamily } from '../theme';
import { Text } from '../components/AppText';
import { PaperBackground } from '../components/PaperBackground';

interface ModePickerScreenProps {
  onPickPlayer: () => void;
  onPickHost: () => void;
}

export function ModePickerScreen({ onPickPlayer, onPickHost }: ModePickerScreenProps) {
  return (
    <PaperBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>초상화 배달부</Text>
            <Text style={styles.tagline}>Face Drawing Icebreaker</Text>
          </View>

          <TouchableOpacity style={styles.card} onPress={onPickPlayer}>
            <Text style={styles.cardTitle}>참가자로 입장</Text>
            <Text style={styles.cardBody}>이름을 선택하고 그림을 그려요.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={onPickHost}>
            <Text style={styles.cardTitle}>진행자 모드</Text>
            <Text style={styles.cardBody}>세션을 만들고 게임을 진행해요.</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  header: { gap: 2, marginBottom: 32 },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 34,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tagline: { fontSize: 13, color: colors.inkSoft, textAlign: 'center' },
  card: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 4,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  cardTitle: { fontFamily: fontFamily.bold, fontSize: 17, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  cardBody: { fontSize: 13, color: colors.inkSoft, textAlign: 'center' },
});
