import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApiBaseProvider } from './src/context/ApiBaseContext';
import { DEFAULT_API_BASE } from './src/config';
import { ModePickerScreen } from './src/screens/ModePickerScreen';
import { PlayerScreen } from './src/screens/player/PlayerScreen';
import { HostScreen } from './src/screens/host/HostScreen';

type Mode = 'picker' | 'player' | 'host';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [mode, setMode] = useState<Mode>('picker');

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ApiBaseProvider value={DEFAULT_API_BASE}>
          {mode === 'picker' ? (
            <ModePickerScreen
              apiBase={DEFAULT_API_BASE}
              onPickPlayer={() => setMode('player')}
              onPickHost={() => setMode('host')}
            />
          ) : null}
          {mode === 'player' ? <PlayerScreen onExit={() => setMode('picker')} /> : null}
          {mode === 'host' ? <HostScreen onExit={() => setMode('picker')} /> : null}
        </ApiBaseProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
