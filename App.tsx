import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/shared/theme';
import { HomeScreen } from './src/app/screens/HomeScreen';

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <HomeScreen />
    </ThemeProvider>
  );
}
