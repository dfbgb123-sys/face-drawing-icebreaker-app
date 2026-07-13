import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApiBaseProvider } from './src/context/ApiBaseContext';
import { clearApiBase, loadApiBase, saveApiBase } from './src/config';
import { ServerSetupScreen } from './src/screens/ServerSetupScreen';
import { ModePickerScreen } from './src/screens/ModePickerScreen';
import { PlayerScreen } from './src/screens/player/PlayerScreen';
import { HostScreen } from './src/screens/host/HostScreen';

type Mode = 'picker' | 'player' | 'host';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [apiBase, setApiBase] = useState<string | null | undefined>(undefined);
  const [mode, setMode] = useState<Mode>('picker');

  useEffect(() => {
    loadApiBase().then(setApiBase);
  }, []);

  if (apiBase === undefined) {
    return <View style={styles.container} />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {!apiBase ? (
          <ServerSetupScreen
            onSave={async (url) => {
              const saved = await saveApiBase(url);
              setApiBase(saved);
            }}
          />
        ) : (
          <ApiBaseProvider value={apiBase}>
            {mode === 'picker' ? (
              <ModePickerScreen
                apiBase={apiBase}
                onPickPlayer={() => setMode('player')}
                onPickHost={() => setMode('host')}
                onChangeServer={async () => {
                  await clearApiBase();
                  setApiBase(null);
                }}
              />
            ) : null}
            {mode === 'player' ? <PlayerScreen onExit={() => setMode('picker')} /> : null}
            {mode === 'host' ? <HostScreen onExit={() => setMode('picker')} /> : null}
          </ApiBaseProvider>
        )}
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
