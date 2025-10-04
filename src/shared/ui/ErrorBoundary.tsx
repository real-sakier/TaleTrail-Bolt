import React, { Component, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { spacing } from '../tokens';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text variant="h2" style={styles.title}>
              Oops!
            </Text>
            <Text variant="body" style={styles.message}>
              Es ist ein Fehler aufgetreten. Versuche die App neu zu laden.
            </Text>
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text variant="bodySmall" style={styles.errorText}>
                  {this.state.error.message}
                </Text>
                <Text variant="caption" style={styles.errorStack}>
                  {this.state.error.stack}
                </Text>
              </View>
            )}
            <Button onPress={this.handleReset} variant="primary">
              Erneut versuchen
            </Button>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
    backgroundColor: '#f5f5f5',
  },
  content: {
    maxWidth: 400,
    alignItems: 'center',
    gap: spacing[4],
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  errorDetails: {
    backgroundColor: '#fee',
    padding: spacing[3],
    borderRadius: 8,
    width: '100%',
    gap: spacing[2],
  },
  errorText: {
    color: '#c00',
    fontWeight: '600',
  },
  errorStack: {
    color: '#900',
    fontFamily: 'monospace',
  },
});
