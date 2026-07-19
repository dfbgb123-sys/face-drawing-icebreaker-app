import React from 'react';
import { StyleSheet, Text as RNText, TextProps } from 'react-native';
import { fontFamily } from '../theme';

// react-native의 Text를 대체하는 래퍼. 원본 웹 클라이언트와 동일한 A2G 폰트를
// 앱 전체 기본값으로 적용한다. React 19에서는 함수형 컴포넌트의 defaultProps가
// 무시되므로 Text.defaultProps 방식 대신 이 래퍼를 쓴다.
export function Text({ style, ...rest }: TextProps) {
  return <RNText style={[styles.base, style]} {...rest} />;
}

const styles = StyleSheet.create({ base: { fontFamily: fontFamily.regular } });
