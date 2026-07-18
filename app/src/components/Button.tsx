import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ title, variant = 'secondary', disabled, style, textStyle, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      style={[styles.base, variantContainerStyles[variant], disabled && styles.disabled, style]}
      {...rest}
    >
      <Text style={[styles.text, variantTextStyles[variant], textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  text: { fontSize: 15.5, fontWeight: '700' },
  primary: {
    backgroundColor: colors.accent,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  primaryText: { color: colors.accentInk, fontSize: 16, fontWeight: '800' },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  secondaryText: { color: colors.ink },
  ghost: {
    backgroundColor: colors.ghostBg,
    borderColor: colors.line,
  },
  ghostText: { color: colors.inkSoft },
  disabled: { opacity: 0.4 },
});

const variantContainerStyles: Record<ButtonVariant, ViewStyle> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
};

const variantTextStyles: Record<ButtonVariant, TextStyle> = {
  primary: styles.primaryText,
  secondary: styles.secondaryText,
  ghost: styles.ghostText,
};
