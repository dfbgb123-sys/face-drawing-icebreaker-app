import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { SessionMode } from '../../../types';
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

      <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
        <Text style={styles.createBtnText}>시작하기 →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#232320', marginTop: 12 },
  modeRow: { flexDirection: 'row', gap: 8 },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd8cf',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modeBtnActive: { backgroundColor: '#232320', borderColor: '#232320' },
  modeBtnText: { fontSize: 13, fontWeight: '600', color: '#232320' },
  modeBtnTextActive: { color: '#fff' },
  modeCard: { padding: 12, borderRadius: 10, backgroundColor: '#f1efe6', gap: 4 },
  modeIcon: { fontSize: 24 },
  modeDescription: { fontSize: 13, color: '#4a4a44', lineHeight: 18 },
  modeHint: { fontSize: 12, color: '#9a9488' },
  textarea: {
    minHeight: 110,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd8cf',
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 14,
    color: '#232320',
  },
  participantCount: { fontSize: 12, color: '#6b6b66' },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd8cf',
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 14,
    color: '#232320',
    width: 120,
  },
  error: { fontSize: 13, color: '#c0392b' },
  createBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#232320',
    alignItems: 'center',
  },
  createBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
