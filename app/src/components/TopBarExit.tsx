import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme';
import { Text } from './AppText';

interface TopBarExitProps {
  onPress: () => void;
}

export function TopBarExit({ onPress }: TopBarExitProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={styles.button}
    >
      <Text style={styles.icon}>‹</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 32,
  },
});
