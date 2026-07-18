// Mirrors the CSS custom properties in the original web client
// (server/public/css/base.css, host.css, player.css) so the RN app matches its visual design.
// Note: the web app also uses backdrop-filter blur, CSS gradients, and a custom
// "A2G" web font — those aren't replicated here since they'd require adding new
// native dependencies (blur/gradient libs, bundled font files + native linking).
import { Platform } from 'react-native';

export const colors = {
  bg: '#f3f6ff',
  surface: '#ffffff',
  surface2: '#eaf2ff',
  ink: '#1c2332',
  inkSoft: 'rgba(28, 35, 50, 0.68)',
  line: 'rgba(28, 35, 50, 0.12)',
  accent: '#6c92ff',
  accentTint: 'rgba(108, 146, 255, 0.14)',
  accentInk: '#ffffff',
  accent2: '#49c3d1',
  accent2Tint: 'rgba(73, 195, 209, 0.14)',
  accentViolet: '#7e6cff',
  accentVioletTint: 'rgba(126, 108, 255, 0.12)',
  accentVioletInk: '#4a3fd6',
  danger: '#ee6f7e',
  dangerTint: 'rgba(238, 111, 126, 0.12)',
  shadow: 'rgba(56, 76, 113, 0.12)',
  ghostBg: 'rgba(255, 255, 255, 0.70)',
};

export const fontMono = Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' });
