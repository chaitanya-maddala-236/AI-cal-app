import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/types';
import { Button, Input } from '../../components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../constants';
import { useOnboardingStore, useAuthStore } from '../../store';
import { submitOnboarding } from '../../services/authService';
import { getErrorMessage } from '../../services/apiClient';
import { GOALS, GoalType } from '../../constants';

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const STEPS = ['Age', 'Gender', 'Height', 'Weight', 'Goal'];

const GOAL_OPTIONS = [
  { value: GOALS.FAT_LOSS, label: 'Fat Loss 🔥', description: 'Lose weight with calorie deficit' },
  { value: GOALS.MUSCLE_GAIN, label: 'Muscle Gain 💪', description: 'Build muscle with protein focus' },
  { value: GOALS.MAINTENANCE, label: 'Maintenance ⚖️', description: 'Maintain your current weight' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: '♂ Male' },
  { value: 'female', label: '♀ Female' },
  { value: 'other', label: '⚧ Other' },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation: _navigation }) => {
  const { data, currentStep, setOnboardingData, nextStep, prevStep, completeOnboarding } = useOnboardingStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const [localAge, setLocalAge] = useState(data.age?.toString() || '');
  const [localHeight, setLocalHeight] = useState(data.height?.toString() || '');
  const [localWeight, setLocalWeight] = useState(data.weight?.toString() || '');

  const handleNext = async () => {
    switch (currentStep) {
      case 0: {
        const age = parseInt(localAge, 10);
        if (isNaN(age) || age < 10 || age > 120) {
          Alert.alert('Invalid Age', 'Enter a valid age between 10 and 120');
          return;
        }
        setOnboardingData({ age });
        break;
      }
      case 1:
        if (!data.gender) {
          Alert.alert('Select Gender', 'Please select your gender');
          return;
        }
        break;
      case 2: {
        const h = parseFloat(localHeight);
        if (isNaN(h) || h < 100 || h > 250) {
          Alert.alert('Invalid Height', 'Enter height in cm (100–250)');
          return;
        }
        setOnboardingData({ height: h });
        break;
      }
      case 3: {
        const w = parseFloat(localWeight);
        if (isNaN(w) || w < 20 || w > 400) {
          Alert.alert('Invalid Weight', 'Enter weight in kg (20–400)');
          return;
        }
        setOnboardingData({ weight: w });
        break;
      }
      case 4: {
        // Last step - submit
        if (!data.goal) {
          Alert.alert('Select Goal', 'Please select your goal');
          return;
        }
        setIsLoading(true);
        try {
          await submitOnboarding({
            age: data.age!,
            gender: data.gender!,
            height: data.height!,
            weight: data.weight!,
            goal: data.goal!,
          });
          completeOnboarding();
        } catch (err) {
          // If API fails, still complete onboarding with local data
          completeOnboarding();
          console.warn('Onboarding API error:', getErrorMessage(err));
        } finally {
          setIsLoading(false);
        }
        return;
      }
    }
    if (currentStep < STEPS.length - 1) {
      nextStep();
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepEmoji}>🎂</Text>
            <Text style={styles.stepTitle}>How old are you?</Text>
            <Text style={styles.stepSubtitle}>This helps us calculate your calorie needs</Text>
            <Input
              value={localAge}
              onChangeText={setLocalAge}
              placeholder="e.g. 25"
              keyboardType="number-pad"
              style={styles.input}
              containerStyle={styles.inputContainer}
            />
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepEmoji}>👤</Text>
            <Text style={styles.stepTitle}>What's your gender?</Text>
            <Text style={styles.stepSubtitle}>Used for metabolic rate calculation</Text>
            <View style={styles.optionsGrid}>
              {GENDER_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.option,
                    data.gender === opt.value && styles.optionSelected,
                  ]}
                  onPress={() => setOnboardingData({ gender: opt.value as 'male' | 'female' | 'other' })}
                >
                  <Text style={[styles.optionLabel, data.gender === opt.value && styles.optionLabelSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepEmoji}>📏</Text>
            <Text style={styles.stepTitle}>What's your height?</Text>
            <Text style={styles.stepSubtitle}>Enter in centimeters</Text>
            <Input
              value={localHeight}
              onChangeText={setLocalHeight}
              placeholder="e.g. 175"
              keyboardType="decimal-pad"
              containerStyle={styles.inputContainer}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepEmoji}>⚖️</Text>
            <Text style={styles.stepTitle}>What's your weight?</Text>
            <Text style={styles.stepSubtitle}>Enter in kilograms</Text>
            <Input
              value={localWeight}
              onChangeText={setLocalWeight}
              placeholder="e.g. 70"
              keyboardType="decimal-pad"
              containerStyle={styles.inputContainer}
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepEmoji}>🎯</Text>
            <Text style={styles.stepTitle}>What's your goal?</Text>
            <Text style={styles.stepSubtitle}>We'll personalize your experience</Text>
            <View style={styles.goalOptions}>
              {GOAL_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.goalOption,
                    data.goal === opt.value && styles.goalOptionSelected,
                  ]}
                  onPress={() => setOnboardingData({ goal: opt.value as GoalType })}
                >
                  <Text style={[styles.goalLabel, data.goal === opt.value && styles.goalLabelSelected]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.goalDescription}>{opt.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.flex}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.stepIndicator}>
          {currentStep + 1} / {STEPS.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.greeting}>
          Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
        </Text>
        {renderStep()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        {currentStep > 0 ? (
          <Button
            title="Back"
            onPress={prevStep}
            variant="outline"
            style={styles.backButton}
          />
        ) : <View style={styles.backButton} />}
        <Button
          title={currentStep === STEPS.length - 1 ? "Let's Go! 🚀" : 'Next →'}
          onPress={handleNext}
          loading={isLoading}
          style={styles.nextButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  progressContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  progressBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  stepIndicator: {
    textAlign: 'right',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  greeting: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepEmoji: {
    fontSize: 72,
    marginBottom: Spacing.lg,
  },
  stepTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  stepSubtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  input: {
    fontSize: FontSize.xxl,
    textAlign: 'center',
    fontWeight: FontWeight.bold,
  },
  inputContainer: {
    width: '60%',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  option: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    minWidth: 120,
    alignItems: 'center',
    ...Shadow.sm,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  optionLabelSelected: {
    color: Colors.primaryDark,
  },
  goalOptions: {
    width: '100%',
    gap: Spacing.md,
  },
  goalOption: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  goalOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  goalLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  goalLabelSelected: {
    color: Colors.primaryDark,
  },
  goalDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  navButtons: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});

export default OnboardingScreen;
