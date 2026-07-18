import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Countdown } from '../../../components/Countdown';
import { DrawingCanvas, DrawingCanvasHandle, DrawingTool } from '../../../components/DrawingCanvas';
import { colors, fontMono } from '../../../theme';
import type { Assignment, SessionMode } from '../../../types';
import { subjectPromptText } from '../playerReducer';

const SWATCHES = ['#232320', '#d94f26', '#2f6f6b', '#3b5bd9'];

interface DrawingViewProps {
  canvasRef: React.RefObject<DrawingCanvasHandle | null>;
  canvasWidth: number;
  canvasHeight: number;
  roundIndex: number;
  totalRounds: number;
  roundEndsAt: number | null;
  assignment: Assignment | null;
  sessionMode: SessionMode | null;
  submitted: boolean;
  onSubmit: () => void;
}

export function DrawingView({
  canvasRef,
  canvasWidth,
  canvasHeight,
  roundIndex,
  totalRounds,
  roundEndsAt,
  assignment,
  sessionMode,
  submitted,
  onSubmit,
}: DrawingViewProps) {
  const [activeColor, setActiveColor] = useState(SWATCHES[0]);
  const [activeTool, setActiveTool] = useState<DrawingTool>('pen');

  const pickColor = (color: string) => {
    setActiveColor(color);
    setActiveTool('pen');
    canvasRef.current?.setColor(color);
    canvasRef.current?.setTool('pen');
  };

  const pickTool = (tool: DrawingTool) => {
    setActiveTool(tool);
    canvasRef.current?.setTool(tool);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roundLabel}>
          라운드 {roundIndex + 1} / {totalRounds}
        </Text>
        <Text style={styles.subjectName}>{subjectPromptText(assignment, sessionMode)}</Text>
        <Countdown endsAt={roundEndsAt} onDone={onSubmit} style={styles.timer} />
      </View>

      <View style={styles.canvasWrap}>
        <DrawingCanvas ref={canvasRef} width={canvasWidth} height={canvasHeight} disabled={submitted} />
      </View>

      <View style={styles.toolbar}>
        {SWATCHES.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.swatch,
              { backgroundColor: color },
              activeColor === color && activeTool === 'pen' && styles.swatchActive,
            ]}
            disabled={submitted}
            onPress={() => pickColor(color)}
          />
        ))}
        <TouchableOpacity
          style={[styles.toolBtn, activeTool === 'pen' && styles.toolBtnActive]}
          disabled={submitted}
          onPress={() => pickTool('pen')}
        >
          <Text style={[styles.toolBtnText, activeTool === 'pen' && styles.toolBtnTextActive]}>펜</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolBtn, activeTool === 'eraser' && styles.toolBtnActive]}
          disabled={submitted}
          onPress={() => pickTool('eraser')}
        >
          <Text style={[styles.toolBtnText, activeTool === 'eraser' && styles.toolBtnTextActive]}>지우개</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolBtn}
          disabled={submitted}
          onPress={() => canvasRef.current?.clear()}
        >
          <Text style={styles.toolBtnText}>전체 지우기</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, submitted && styles.submitBtnDisabled]}
        disabled={submitted}
        onPress={onSubmit}
      >
        <Text style={styles.submitBtnText}>제출하기</Text>
      </TouchableOpacity>

      {submitted ? (
        <View style={styles.submittedBanner}>
          <Text style={styles.submittedBannerText}>제출 완료! 다음 라운드를 기다려주세요.</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center', gap: 12 },
  header: { alignItems: 'center', gap: 4 },
  roundLabel: {
    fontFamily: fontMono,
    fontSize: 12.5,
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subjectName: { fontSize: 22, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  timer: { fontSize: 28 },
  canvasWrap: {
    padding: 10,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  toolbar: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', alignItems: 'center' },
  swatch: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: 'transparent' },
  swatchActive: { borderColor: colors.accent },
  toolBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  toolBtnActive: { borderColor: colors.accent, backgroundColor: colors.accentTint },
  toolBtnText: { fontSize: 14, fontWeight: '700', color: colors.inkSoft },
  toolBtnTextActive: { color: colors.ink },
  submitBtn: {
    width: '100%',
    maxWidth: 320,
    paddingVertical: 16,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { color: colors.ink, fontSize: 16, fontWeight: '700' },
  submittedBanner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  submittedBannerText: { fontSize: 14, color: colors.inkSoft },
});
