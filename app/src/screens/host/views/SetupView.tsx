import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { SessionMode } from '../../../types';
import { colors } from '../../../theme';
import { Button } from '../../../components/Button';
import { MODE_META } from '../hostReducer';

const MODES: SessionMode[] = ['portrait', 'baton', 'multi'];

interface SetupViewProps {
  selectedMode: SessionMode;
  setupError: string | null;
  onSelectMode: (mode: SessionMode) => void;
  onCreate: (names: string[], minutes: number) => void;
}

export function SetupView({ selectedMode, setupError, onSelectMode, onCreate }: SetupViewProps) {
  const [namesText, setNamesText] = useState('');
  const [roundLengthText, setRoundLengthText] = useState('3');

  const names = useMemo(
    () =>
      namesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    [namesText]
  );

  const meta = MODE_META[selectedMode];

  const handleCreate = () => {
    const minutes = parseFloat(roundLengthText) || 3;
    onCreate(names, minutes);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionLabel}>게임 모드 선택</Text>
      <View style={styles.modeRow}>
        {MODES.map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.modeBtn, selectedMode === mode && styles.modeBtnActive]}
            onPress={() => onSelectMode(mode)}
          >
            <Text style={[styles.modeBtnText, selectedMode === mode && styles.modeBtnTextActive]}>
              {MODE_META[mode].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.modeCard}>
        <Text style={styles.modeIcon}>{meta.icon}</Text>
        <Text style={styles.modeDescription}>{meta.description}</Text>
        <Text style={styles.modeHint}>{meta.hint}</Text>
      </View>

      <Text style={styles.sectionLabel}>참가자 이름 (한 줄에 한 명, 앉은 순서대로)</Text>
      <TextInput
        style={styles.textarea}
        multiline
        value={namesText}
        onChangeText={setNamesText}
        placeholder={'유지\n민서\n하늘\n다온\n서연'}
        textAlignVertical="top"
      />
      <Text style={styles.participantCount}>참가자 {names.length}명</Text>

      <Text style={styles.sectionLabel}>그림 제출 시간 (분)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={roundLengthText}
        onChangeText={setRoundLengthText}
      />

      {setupError ? <Text style={styles.error}>{setupError}</Text> : null}

      <Button title="시작하기 →" variant="primary" style={styles.createBtn} onPress={handleCreate} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: colors.ink, marginTop: 12 },
  modeRow: { flexDirection: 'row', gap: 8 },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  modeBtnActive: { backgroundColor: colors.accentTint, borderColor: colors.accentViolet },
  modeBtnText: { fontSize: 13, fontWeight: '700', color: colors.ink },
  modeBtnTextActive: { color: colors.accentVioletInk },
  modeCard: { padding: 16, borderRadius: 22, backgroundColor: colors.surface2, gap: 4 },
  modeIcon: { fontSize: 24 },
  modeDescription: { fontSize: 13, color: colors.ink, lineHeight: 18 },
  modeHint: { fontSize: 12, color: colors.inkSoft },
  textarea: {
    minHeight: 110,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: 14,
    fontSize: 14,
    color: colors.ink,
  },
  participantCount: { fontSize: 12, color: colors.inkSoft },
  input: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: 14,
    fontSize: 14,
    color: colors.ink,
    width: 120,
  },
  error: { fontSize: 13, color: colors.danger },
  createBtn: { marginTop: 16 },
});
