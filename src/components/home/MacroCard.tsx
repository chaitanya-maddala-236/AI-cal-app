import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing, Shadow } from '../../constants';

interface MacroCardProps {
  label: string;
  value: number;
  unit: string;
  target?: number;
  color: string;
  icon: string;
}

const MacroCard: React.FC<MacroCardProps> = ({
  label,
  value,
  unit,
  target,
  color,
  icon,
}) => {
  const progress = target && target > 0 ? Math.min(1, value / target) : 0;

  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      <View style={styles.row}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
      <Text style={styles.value}>
        {Math.round(value)}
        <Text style={styles.unit}>{unit}</Text>
      </Text>
      {target !== undefined ? (
        <View style={styles.progressContainer}>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.round(progress * 100)}%`, backgroundColor: color },
              ]}
            />
          </View>
          <Text style={styles.targetText}>
            {Math.round(target)}
            {unit}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flex: 1,
    borderTopWidth: 3,
    ...Shadow.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  icon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  unit: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  progressBg: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  targetText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});

export default MacroCard;
