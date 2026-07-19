import React, { forwardRef } from 'react';
import { StyleSheet, TextInput as RNTextInput, TextInputProps } from 'react-native';
import { fontFamily } from '../theme';

// react-native의 TextInput을 대체하는 래퍼. AppText와 동일하게 기본 폰트를 A2G로 맞춘다.
export const TextInput = forwardRef<RNTextInput, TextInputProps>(function AppTextInput(
  { style, ...rest },
  ref
) {
  return <RNTextInput ref={ref} style={[styles.base, style]} {...rest} />;
});

const styles = StyleSheet.create({ base: { fontFamily: fontFamily.regular } });
