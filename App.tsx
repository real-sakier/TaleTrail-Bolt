import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/shared/theme';
import { RootNavigator, linking } from './src/app/navigation';
import { ErrorBoundary } from './src/shared/ui';
import { DataSourceProvider } from './src/core/providers/DataSourceContext';
import { FeatureFlags } from './src/core/config/features.config';

function AppContent() {
  const { colorScheme } = useTheme();

  useEffect(() => {
    FeatureFlags.initialize();
  }, []);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer linking={linking}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <DataSourceProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </DataSourceProvider>
    </ErrorBoundary>
  );
}
