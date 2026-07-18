import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const namesInputRef = useRef<TextInput>(null);
  const roundInputRef = useRef<TextInput>(null);
  const focusedInputRef = useRef<TextInput | null>(null);
  const scrollOffsetRef = useRef(0);
  const keyboardVisibleRef = useRef(false);

  // 키보드가 뜬 상태에서 포커스된 입력창을 항상 화면 상단 근처(TOP_MARGIN)로
  // 끌어올린다. adjustResize만으로는 이 화면에서 ScrollView 컨테이너가 충분히
  // 줄어들지 않아 스크롤 여유가 부족했기 때문에, 콘텐츠 하단에 키보드 높이만큼
  // paddingBottom을 추가해 실제로 스크롤할 수 있는 공간을 확보한다.
  const TOP_MARGIN = 140;

  const scrollFocusedIntoView = () => {
    const input = focusedInputRef.current;
    if (!input || !keyboardVisibleRef.current) return;
    // 키보드 애니메이션/리사이즈가 끝난 뒤 측정하도록 한 프레임 늦춘다.
    setTimeout(() => {
      input.measureInWindow((_x, y) => {
        const delta = y - TOP_MARGIN;
        if (Math.abs(delta) > 4) {
          scrollRef.current?.scrollTo({ y: Math.max(scrollOffsetRef.current + delta, 0), animated: true });
        }
      });
    }, 60);
  };

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      keyboardVisibleRef.current = true;
      setKeyboardHeight(e.endCoordinates.height);
      scrollFocusedIntoView();
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      keyboardVisibleRef.current = false;
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleInputFocus = (ref: React.RefObject<TextInput | null>) => {
    focusedInputRef.current = ref.current;
    scrollFocusedIntoView();
  };

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
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.container, { paddingBottom: 60 + keyboardHeight }]}
        keyboardShouldPersistTaps="handled"
        onScroll={(e) => {
          scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
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
          ref={namesInputRef}
          style={styles.textarea}
          multiline
          value={namesText}
          onChangeText={setNamesText}
          placeholder={'유지\n민서\n하늘\n다온\n서연'}
          textAlignVertical="top"
          onFocus={() => handleInputFocus(namesInputRef)}
        />
        <Text style={styles.participantCount}>참가자 {names.length}명</Text>

        <Text style={styles.sectionLabel}>그림 제출 시간 (분)</Text>
        <TextInput
          ref={roundInputRef}
          style={styles.input}
          keyboardType="numeric"
          value={roundLengthText}
          onChangeText={setRoundLengthText}
          onFocus={() => handleInputFocus(roundInputRef)}
        />

        {setupError ? <Text style={styles.error}>{setupError}</Text> : null}

        <Button title="시작하기 →" variant="primary" style={styles.createBtn} onPress={handleCreate} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
