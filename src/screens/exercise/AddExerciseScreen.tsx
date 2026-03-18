import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../utils/types';
import { Button, Input } from '../../components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../constants';
import { useDashboardStore } from '../../store';
import { addExerciseEntry } from '../../services/logService';
import { getErrorMessage } from '../../services/apiClient';
import { getTodayDateString } from '../../utils/helpers';

type AddExerciseScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'AddExercise'>;
};

const QUICK_EXERCISES = [
  { name: 'Running', icon: '🏃', caloriesPerMin: 10 },
  { name: 'Cycling', icon: '🚴', caloriesPerMin: 8 },
  { name: 'Swimming', icon: '🏊', caloriesPerMin: 9 },
  { name: 'Gym Workout', icon: '💪', caloriesPerMin: 7 },
  { name: 'Yoga', icon: '🧘', caloriesPerMin: 4 },
  { name: 'Walking', icon: '🚶', caloriesPerMin: 4 },
];

const AddExerciseScreen: React.FC<AddExerciseScreenProps> = ({ navigation }) => {
  const { addExerciseEntry: addToStore } = useDashboardStore();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickSelect = (ex: (typeof QUICK_EXERCISES)[0]) => {
    setName(ex.name);
    const dur = parseInt(duration, 10) || 30;
    setCaloriesBurned((ex.caloriesPerMin * dur).toString());
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Exercise name is required');
      return;
    }
    const dur = parseInt(duration, 10);
    if (isNaN(dur) || dur <= 0) {
      Alert.alert('Error', 'Enter valid duration in minutes');
      return;
    }
    const cal = parseFloat(caloriesBurned);
    if (isNaN(cal) || cal < 0) {
      Alert.alert('Error', 'Enter valid calories burned');
      return;
    }

    setIsLoading(true);
    try {
      const entry = await addExerciseEntry({
        name: name.trim(),
        duration: dur,
        caloriesBurned: cal,
        date: getTodayDateString(),
      });
      addToStore(entry);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Exercise 🏃</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Quick Select */}
        <Text style={styles.sectionLabel}>Quick Select</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickScroll}
        >
          {QUICK_EXERCISES.map((ex) => (
            <TouchableOpacity
              key={ex.name}
              style={[
                styles.quickBtn,
                name === ex.name && styles.quickBtnSelected,
              ]}
              onPress={() => handleQuickSelect(ex)}
            >
              <Text style={styles.quickIcon}>{ex.icon}</Text>
              <Text
                style={[
                  styles.quickText,
                  name === ex.name && styles.quickTextSelected,
                ]}
              >
                {ex.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.form}>
          <Input
            label="Exercise Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Running"
          />
          <Input
            label="Duration (minutes)"
            value={duration}
            onChangeText={setDuration}
            placeholder="e.g. 30"
            keyboardType="number-pad"
          />
          <Input
            label="Calories Burned"
            value={caloriesBurned}
            onChangeText={setCaloriesBurned}
            placeholder="e.g. 300"
            keyboardType="decimal-pad"
          />
        </View>

        <Button
          title="Log Exercise"
          onPress={handleSave}
          loading={isLoading}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  backIcon: { fontSize: FontSize.xl, color: Colors.text },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  content: { padding: Spacing.lg, paddingTop: Spacing.sm },
  sectionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  quickScroll: { marginBottom: Spacing.lg },
  quickBtn: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
    minWidth: 80,
    gap: Spacing.xs,
  },
  quickBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  quickIcon: { fontSize: 24 },
  quickText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  quickTextSelected: { color: Colors.primaryDark },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
});

export default AddExerciseScreen;
