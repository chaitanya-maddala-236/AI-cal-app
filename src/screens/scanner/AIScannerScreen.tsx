import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList, AIScanResult } from '../../utils/types';
import { Button, Input, Card } from '../../components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../constants';
import { useDashboardStore, useAuthStore } from '../../store';
import { scanFood } from '../../services/aiService';
import { addFoodEntry } from '../../services/logService';
import { getErrorMessage } from '../../services/apiClient';
import { getTodayDateString } from '../../utils/helpers';

type AIScannerScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'AIScanner'>;
};

type ScanState = 'idle' | 'analyzing' | 'result' | 'saved';

const AIScannerScreen: React.FC<AIScannerScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { addFoodEntry: addToStore } = useDashboardStore();
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [result, setResult] = useState<AIScanResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [editedDish, setEditedDish] = useState('');
  const [editedCalories, setEditedCalories] = useState('');
  const [editedProtein, setEditedProtein] = useState('');
  const [editedCarbs, setEditedCarbs] = useState('');
  const [editedFat, setEditedFat] = useState('');

  const isPremium = user?.isPremium ?? false;

  const handleScan = async (isMock = false) => {
    if (!isPremium) {
      Alert.alert(
        '🔒 Premium Feature',
        'AI Food Scanner is available for Premium subscribers. Upgrade to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'View Demo',
            onPress: () => handleScan(true),
          },
        ],
      );
      return;
    }
    performScan(isMock);
  };

  const performScan = async (isMock: boolean) => {
    setScanState('analyzing');
    try {
      let scanResult: AIScanResult;
      if (isMock) {
        // Mock result for demo
        await new Promise<void>((r) => setTimeout(r, 2000));
        scanResult = {
          dish: 'Grilled Chicken Salad',
          calories: 320,
          protein: 35,
          carbs: 12,
          fat: 14,
          confidence: 0.87,
        };
      } else {
        scanResult = await scanFood('mock_image_base64');
      }
      setResult(scanResult);
      setEditedDish(scanResult.dish);
      setEditedCalories(scanResult.calories.toString());
      setEditedProtein(scanResult.protein.toString());
      setEditedCarbs(scanResult.carbs.toString());
      setEditedFat(scanResult.fat.toString());
      setScanState('result');
    } catch (err) {
      setScanState('idle');
      Alert.alert('Scan Failed', getErrorMessage(err));
    }
  };

  const handleConfirmAndSave = async () => {
    if (!result) { return; }
    setIsSaving(true);
    try {
      const entry = await addFoodEntry({
        name: editedDish,
        calories: parseFloat(editedCalories) || result.calories,
        protein: parseFloat(editedProtein) || result.protein,
        carbs: parseFloat(editedCarbs) || result.carbs,
        fat: parseFloat(editedFat) || result.fat,
        mealType: 'Lunch',
        date: getTodayDateString(),
      });
      addToStore(entry);
      setScanState('saved');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err) {
      Alert.alert('Error', getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (scanState === 'analyzing') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.analyzingText}>Analyzing your food...</Text>
        <Text style={styles.analyzingSubtext}>Our AI is identifying the dish</Text>
        <View style={styles.skeleton}>
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, { width: '60%' }]} />
          <View style={[styles.skeletonLine, { width: '80%' }]} />
        </View>
      </View>
    );
  }

  if (scanState === 'saved') {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.savedEmoji}>✅</Text>
        <Text style={styles.savedText}>Meal Saved!</Text>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AI Food Scanner 📸</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {scanState === 'idle' ? (
          <View style={styles.cameraSection}>
            {/* Camera placeholder */}
            <View style={styles.cameraContainer}>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.cameraText}>Point camera at your food</Text>
              <Text style={styles.cameraSubtext}>AI will identify and calculate calories</Text>
            </View>

            <View style={styles.actionButtons}>
              <Button
                title="📸 Scan Food"
                onPress={() => handleScan(false)}
                fullWidth
                size="lg"
                style={styles.scanButton}
              />
              <Button
                title="🖼 Upload Image"
                onPress={() => handleScan(false)}
                variant="outline"
                fullWidth
                size="lg"
                style={styles.uploadButton}
              />
            </View>

            {!isPremium ? (
              <Card style={styles.premiumBanner} padding={Spacing.md}>
                <Text style={styles.premiumTitle}>🔒 Premium Feature</Text>
                <Text style={styles.premiumText}>
                  Upgrade to Premium to use AI Food Scanner
                </Text>
                <Button
                  title="Try Demo"
                  onPress={() => performScan(true)}
                  variant="outline"
                  size="sm"
                  style={styles.demoButton}
                />
              </Card>
            ) : null}
          </View>
        ) : (
          // Result state
          <View style={styles.resultSection}>
            {result ? (
              <>
                <Card style={styles.confidenceCard} padding={Spacing.md}>
                  <Text style={styles.confidenceText}>
                    🎯 Detected: {result.dish} ({Math.round(result.confidence * 100)}% confidence)
                  </Text>
                </Card>

                <View style={styles.editForm}>
                  <Input
                    label="Dish Name"
                    value={editedDish}
                    onChangeText={setEditedDish}
                    placeholder="Food name"
                  />
                  <Input
                    label="Calories (kcal)"
                    value={editedCalories}
                    onChangeText={setEditedCalories}
                    keyboardType="decimal-pad"
                    placeholder="Calories"
                  />
                  <View style={styles.macroRow}>
                    <Input
                      label="Protein (g)"
                      value={editedProtein}
                      onChangeText={setEditedProtein}
                      keyboardType="decimal-pad"
                      containerStyle={styles.macroInput}
                    />
                    <Input
                      label="Carbs (g)"
                      value={editedCarbs}
                      onChangeText={setEditedCarbs}
                      keyboardType="decimal-pad"
                      containerStyle={styles.macroInput}
                    />
                    <Input
                      label="Fat (g)"
                      value={editedFat}
                      onChangeText={setEditedFat}
                      keyboardType="decimal-pad"
                      containerStyle={styles.macroInput}
                    />
                  </View>
                </View>

                <View style={styles.resultActions}>
                  <Button
                    title="✏️ Rescan"
                    onPress={() => setScanState('idle')}
                    variant="outline"
                    style={styles.rescanBtn}
                  />
                  <Button
                    title="✅ Confirm & Save"
                    onPress={handleConfirmAndSave}
                    loading={isSaving}
                    style={styles.saveBtn}
                  />
                </View>
              </>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  analyzingText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  analyzingSubtext: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  skeleton: {
    width: '80%',
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    width: '100%',
  },
  savedEmoji: { fontSize: 72 },
  savedText: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginTop: Spacing.lg,
  },
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
  cameraSection: { alignItems: 'center' },
  cameraContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: Colors.black,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  cameraIcon: { fontSize: 72 },
  cameraText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    marginTop: Spacing.md,
  },
  cameraSubtext: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: Spacing.xs,
  },
  actionButtons: { width: '100%', gap: Spacing.sm },
  scanButton: {},
  uploadButton: { marginTop: Spacing.sm },
  premiumBanner: {
    width: '100%',
    marginTop: Spacing.lg,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  premiumTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.warning,
    marginBottom: Spacing.xs,
  },
  premiumText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  demoButton: { alignSelf: 'flex-start' },
  resultSection: {},
  confidenceCard: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.primaryLight,
  },
  confidenceText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.primaryDark,
  },
  editForm: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  macroRow: { flexDirection: 'row', gap: Spacing.sm },
  macroInput: { flex: 1, marginBottom: 0 },
  resultActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  rescanBtn: { flex: 1 },
  saveBtn: { flex: 2 },
});

export default AIScannerScreen;
