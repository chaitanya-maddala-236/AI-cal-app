import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Colors, BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants';

export interface FABAction {
  label: string;
  icon: string;
  onPress: () => void;
  color?: string;
}

interface FABActionItemProps {
  action: FABAction;
  index: number;
  total: number;
  animation: SharedValue<number>;
  onPress: (action: FABAction) => void;
}

const FABActionItem: React.FC<FABActionItemProps> = ({
  action,
  index,
  total,
  animation,
  onPress,
}) => {
  const actionStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animation.value,
      [0, 1],
      [0, -(60 * (total - index))],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      animation.value,
      [0, 0.5, 1],
      [0, 0, 1],
      Extrapolation.CLAMP,
    );
    const scale = withSpring(animation.value, {
      damping: 15,
      stiffness: 200,
    });
    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.actionItem, actionStyle]}>
      <Text style={styles.actionLabel}>{action.label}</Text>
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: action.color || Colors.primary },
        ]}
        onPress={() => onPress(action)}
        activeOpacity={0.9}
      >
        <Text style={styles.actionIcon}>{action.icon}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface FABProps {
  actions: FABAction[];
}

const FAB: React.FC<FABProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useSharedValue(0);

  const toggle = useCallback(() => {
    const next = !isOpen;
    setIsOpen(next);
    animation.value = withTiming(next ? 1 : 0, { duration: 300 });
  }, [isOpen, animation]);

  const close = useCallback((action?: FABAction) => {
    setIsOpen(false);
    animation.value = withTiming(0, { duration: 200 });
    if (action) {
      action.onPress();
    }
  }, [animation]);

  const mainButtonStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(animation.value, [0, 1], [0, 45], Extrapolation.CLAMP)}deg`,
      },
    ],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animation.value, [0, 1], [0, 0.5], Extrapolation.CLAMP),
    pointerEvents: isOpen ? 'auto' : 'none',
  }));

  return (
    <>
      {/* Overlay */}
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => close()} />
      </Animated.View>

      <View style={styles.container} pointerEvents="box-none">
        {/* Action buttons */}
        {actions.map((action, index) => (
          <FABActionItem
            key={action.label}
            action={action}
            index={index}
            total={actions.length}
            animation={animation}
            onPress={(a) => close(a)}
          />
        ))}

        {/* Main FAB button */}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={toggle}
          activeOpacity={0.9}
        >
          <Animated.Text style={[styles.mainIcon, mainButtonStyle]}>+</Animated.Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black,
    zIndex: 10,
  },
  container: {
    position: 'absolute',
    bottom: Spacing.xl + 10,
    right: Spacing.lg,
    alignItems: 'center',
    zIndex: 20,
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
  mainIcon: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: FontWeight.bold,
    lineHeight: 32,
  },
  actionItem: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    backgroundColor: Colors.black,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
});

export default FAB;
