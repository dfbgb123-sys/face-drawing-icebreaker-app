import React from 'react';
import { ImageBackground, StyleSheet, ViewStyle } from 'react-native';

interface PaperBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

// 모든 화면 바탕에 깔리는 종이 질감(그레인) 텍스처.
// paper-texture.png는 순수 랜덤 노이즈라 타일 이음매가 보이지 않아 resizeMode="repeat"로 이어붙인다.
export function PaperBackground({ children, style }: PaperBackgroundProps) {
  return (
    <ImageBackground
      source={require('../assets/paper-texture.png')}
      resizeMode="repeat"
      style={[styles.fill, style]}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
