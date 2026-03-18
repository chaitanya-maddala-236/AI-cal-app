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
import { addWaterEntry } from '../../services/logService';
import { getErrorMessage } from '../../services/apiClient';
import { getTodayDateString } from '../../utils/helpers';
import { QUICK_WATER_AMOUNTS } from '../../constants/api';

type AddWaterScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'AddWater'>;
};

const WATER_GLASS_LABELS: Record<number, string> = {
  250: '1 glass',
  500: '2 glasses',
  750: '3 glasses',
  1000: '4 glasses',
};

const AddWaterScreen: React.FC<AddWaterScreenProps> = ({ navigation }) => {
  const { addWaterEntry: addToStore, getTotalWaterForDate } = useDashboardStore();
  const today = getTodayDateString();
  const totalWater = getTotalWaterForDate(today);

  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (ml: number) => {
    setIsLoading(true);
    try {
      const entry = await addWaterEntry({ amount: ml, date: today });
      addToStore(entry);
      Alert.alert('💧 Water Logged!', `${ml}ml added. Total: ${totalWater + ml}ml`);
    } catch (err) {
      Alert.alert('Error', getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomAmount = async () => {
    const ml = parseInt(amount, 10);
    if (isNaN(ml) || ml <= 0 || ml > 5000) {
      Alert.alert('Error', 'Enter a valid amount (1–5000 ml)');
      return;
    }
    await handleAdd(ml);
    setAmount('');
  };

  const progressPercent = Math.min(100, (totalWater / 2500) * 100);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Water 💧</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressEmoji}>💧</Text>
          <Text style={styles.progressValue}>{totalWater} ml</Text>
          <Text style={styles.progressTarget}>/ 2500 ml daily goal</Text>
          <View style={styles.progressBg}>
            <View
              style={[styles.progressBar, { width: `${progressPercent}%` }]}
            />
          </View>
          <Text style={styles.progressPercent}>{Math.round(progressPercent)}% of daily goal</Text>
        </View>

        {/* Quick Add Buttons */}
        <Text style={styles.sectionLabel}>Quick Add</Text>
        <View style={styles.quickGrid}>
          {QUICK_WATER_AMOUNTS.map((ml) => (
            <TouchableOpacity
              key={ml}
              style={styles.quickBtn}
              onPress={() => handleAdd(ml)}
              disabled={isLoading}
            >
              <Text style={styles.quickIcon}>💧</Text>
              <Text style={styles.quickAmount}>{ml}ml</Text>
              <Text style={styles.quickGlass}>
                {WATER_GLASS_LABELS[ml] ?? `${Math.round(ml / 250)} glasses`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Amount */}
        <View style={styles.customSection}>
          <Text style={styles.sectionLabel}>Custom Amount</Text>
          <View style={styles.customRow}>
            <Input
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter ml (e.g. 350)"
              keyboardType="number-pad"
              containerStyle={styles.customInput}
            />
            <Button
              title="Add"
              onPress={handleCustomAmount}
              loading={isLoading}
              style={styles.customBtn}
            />
          </View>
        </View>
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
  progressCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  progressEmoji: { fontSize: 48, marginBottom: Spacing.sm },
  progressValue: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.water,
  },
  progressTarget: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  progressBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(33,150,243,0.2)',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.water,
    borderRadius: BorderRadius.full,
  },
  progressPercent: {
    fontSize: FontSize.sm,
    color: Colors.water,
    fontWeight: FontWeight.semibold,
    marginTop: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
  },
  quickBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  quickIcon: { fontSize: 28 },
  quickAmount: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.water,
  },
  quickGlass: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  customSection: { marginBottom: Spacing.lg },
  customRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  customInput: { flex: 1, marginBottom: 0 },
  customBtn: { marginTop: 20 },
});

export default AddWaterScreen;
