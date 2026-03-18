import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, FontSize, FontWeight } from '../../constants';

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 1
  color?: string;
  backgroundColor?: string;
  label?: string;
  centerContent?: React.ReactNode;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 180,
  strokeWidth = 14,
  progress,
  color = Colors.primary,
  backgroundColor = Colors.border,
  centerContent,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        {centerContent}
      </View>
    </View>
  );
};

interface CalorieProgressProps {
  consumed: number;
  target: number;
  size?: number;
  goal?: string;
}

export const CalorieProgress: React.FC<CalorieProgressProps> = ({
  consumed,
  target,
  size = 180,
  goal,
}) => {
  const progress = target > 0 ? Math.min(1, consumed / target) : 0;
  const remaining = Math.max(0, target - consumed);
  const isOverTarget = consumed > target;

  const color = isOverTarget
    ? Colors.error
    : goal === 'fat_loss'
      ? Colors.warning
      : Colors.primary;

  return (
    <CircularProgress
      size={size}
      progress={progress}
      color={color}
      centerContent={
        <View style={styles.calorieCenter}>
          <Text style={styles.consumedText}>
            {Math.round(consumed).toLocaleString()}
          </Text>
          <Text style={styles.kcalText}>kcal</Text>
          <View style={styles.divider} />
          <Text style={styles.remainingLabel}>
            {isOverTarget ? 'over by' : 'remaining'}
          </Text>
          <Text style={[styles.remainingValue, isOverTarget && { color: Colors.error }]}>
            {isOverTarget
              ? `${Math.round(consumed - target).toLocaleString()}`
              : `${Math.round(remaining).toLocaleString()}`}
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieCenter: {
    alignItems: 'center',
  },
  consumedText: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    lineHeight: 32,
  },
  kcalText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  remainingLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  remainingValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
});

export default CircularProgress;
