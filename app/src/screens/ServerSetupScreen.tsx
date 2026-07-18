import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

interface ServerSetupScreenProps {
  initialValue?: string;
  onSave: (url: string) => void;
}

export function ServerSetupScreen({ initialValue = '', onSave }: ServerSetupScreenProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmed = value.trim();
    if (!/^https?:\/\/.+/.test(trimmed)) {
      setError('http:// 또는 https://로 시작하는 주소를 입력해주세요.');
      return;
    }
    setError(null);
    onSave(trimmed);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>서버 주소를 입력하세요</Text>
        <Text style={styles.body}>
          진행자 컴퓨터에서 실행 중인 얼굴 그리기 아이스브레이커 서버 주소를 입력하세요. 같은 와이파이에
          연결된 상태여야 해요.
        </Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder="http://192.168.0.10:3000"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>저장하고 계속하기</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '700', color: colors.ink },
  body: { fontSize: 14, color: colors.inkSoft, lineHeight: 20 },
  input: {
    marginTop: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: 14,
    fontSize: 15,
    color: colors.ink,
  },
  error: { fontSize: 13, color: colors.danger },
  button: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  buttonText: { color: colors.accentInk, fontSize: 16, fontWeight: '700' },
});
