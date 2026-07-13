import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Countdown } from '../../../components/Countdown';
import { DrawingCanvas, DrawingCanvasHandle, DrawingTool } from '../../../components/DrawingCanvas';
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

      <View style={[styles.canvasWrap, { width: canvasWidth, height: canvasHeight }]}>
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
  roundLabel: { fontSize: 13, color: '#9a9488' },
  subjectName: { fontSize: 17, fontWeight: '700', color: '#232320', textAlign: 'center' },
  timer: { fontSize: 24 },
  canvasWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd8cf',
  },
  toolbar: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', alignItems: 'center' },
  swatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
  swatchActive: { borderColor: '#232320' },
  toolBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd8cf',
    backgroundColor: '#fff',
  },
  toolBtnActive: { backgroundColor: '#232320' },
  toolBtnText: { fontSize: 13, color: '#232320' },
  toolBtnTextActive: { color: '#fff' },
  submitBtn: {
    width: '100%',
    maxWidth: 320,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#232320',
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  submittedBanner: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#eef0e4' },
  submittedBannerText: { fontSize: 13, color: '#3f4a2f' },
});
