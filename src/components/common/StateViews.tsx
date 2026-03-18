import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Colors, FontSize, Spacing } from '../../constants';

interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  style,
}) => (
  <View style={[styles.center, style]}>
    <ActivityIndicator size="large" color={Colors.primary} />
    <Text style={styles.message}>{message}</Text>
  </View>
);

interface EmptyStateProps {
  message?: string;
  icon?: string;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No data yet. Start logging meals.',
  icon = '🍽',
  style,
}) => (
  <View style={[styles.center, style]}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

interface ErrorStateProps {
  message?: string;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong. Please try again.',
  style,
}) => (
  <View style={[styles.center, style]}>
    <Text style={styles.icon}>⚠️</Text>
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  message: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorText: {
    fontSize: FontSize.base,
    color: Colors.error,
    textAlign: 'center',
    lineHeight: 24,
  },
});
