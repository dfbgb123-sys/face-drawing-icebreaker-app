// Mirrors the CSS custom properties in the original web client
// (server/public/css/base.css, host.css, player.css) so the RN app matches its visual design.
// Note: the web app also uses backdrop-filter blur and CSS gradients — those
// aren't replicated here since they'd require adding new native dependencies.
import { Platform } from 'react-native';

// 메인톤(블루) · 서브톤(그린 = 선택/포지티브, 네이비 = 강조) · 베이스(아이보리 화이트)
// 4색 기준으로 짠 팔레트. 채도를 낮게 유지해 화면이 무거워지지 않도록 한다.
export const colors = {
  bg: '#FFFDF5',
  surface: '#ffffff',
  surface2: 'rgba(149, 177, 238, 0.12)',
  ink: '#293241',
  inkSoft: 'rgba(41, 50, 65, 0.64)',
  line: 'rgba(41, 50, 65, 0.14)',

  // 메인톤 — 주요 액션/CTA
  accent: '#95B1EE',
  accentInk: '#1F3868',
  accentTint: 'rgba(149, 177, 238, 0.16)',

  // 서브톤 1 — 선택 상태 / 포지티브(연결됨·정답 등)
  accentGreen: '#E7F1A8',
  accentGreenDeep: '#A7C05A',
  accentGreenInk: '#4B5A22',
  accentGreenTint: 'rgba(231, 241, 168, 0.55)',

  // 서브톤 2 — 강조 테두리/텍스트
  navy: '#364C84',

  danger: '#ee6f7e',
  dangerTint: 'rgba(238, 111, 126, 0.12)',
  shadow: 'rgba(41, 50, 65, 0.10)',
  ghostBg: 'rgba(255, 255, 255, 0.60)',
  overlay: 'rgba(20, 24, 38, 0.46)',
  // 버튼 3단계 상태(default/선택/강조) 공통 색.
  buttonBorderDefault: 'rgba(41, 50, 65, 0.30)',
};

export const fontMono = Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' });

// 원본 웹 클라이언트가 쓰는 "에이투지체(A2G)" 커스텀 폰트.
// server/public/fonts에서 Regular/Bold 두 굵기만 가져와 android/app/src/main/assets/fonts에
// 번들했다 (전체 9굵기를 다 넣으면 6MB가 넘어서 실제 텍스트에 쓰이는 굵기 위주로 추렸다).
// 굵기를 명시하지 않은 일반 텍스트는 App.tsx에서 Text/TextInput 기본값으로 Regular가 적용되고,
// fontWeight가 700 이상인 강조 텍스트는 이 fontFamily.bold를 함께 지정해서 쓴다.
export const fontFamily = {
  regular: 'A2G-Regular',
  bold: 'A2G-Bold',
};
