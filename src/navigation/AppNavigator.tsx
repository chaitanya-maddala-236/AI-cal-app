import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import {
  MainTabParamList,
  HomeStackParamList,
  AnalysisStackParamList,
  ProfileStackParamList,
} from '../utils/types';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import DailyDetailScreen from '../screens/home/DailyDetailScreen';
import EditEntryScreen from '../screens/home/EditEntryScreen';
import AddMealScreen from '../screens/meals/AddMealScreen';
import AddExerciseScreen from '../screens/exercise/AddExerciseScreen';
import AddWaterScreen from '../screens/water/AddWaterScreen';
import AIScannerScreen from '../screens/scanner/AIScannerScreen';
import AIInsightsScreen from '../screens/insights/AIInsightsScreen';
import AnalysisScreen from '../screens/analysis/AnalysisScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import FAB from '../components/navigation/FAB';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const AnalysisStack = createNativeStackNavigator<AnalysisStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const HomeNavigator: React.FC = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="DailyDetail" component={DailyDetailScreen} />
    <HomeStack.Screen name="EditEntry" component={EditEntryScreen} />
    <HomeStack.Screen name="AIInsights" component={AIInsightsScreen} />
    <HomeStack.Screen name="AddMeal" component={AddMealScreen} />
    <HomeStack.Screen name="AddExercise" component={AddExerciseScreen} />
    <HomeStack.Screen name="AddWater" component={AddWaterScreen} />
    <HomeStack.Screen name="AIScanner" component={AIScannerScreen} />
  </HomeStack.Navigator>
);

const AnalysisNavigator: React.FC = () => (
  <AnalysisStack.Navigator screenOptions={{ headerShown: false }}>
    <AnalysisStack.Screen name="Analysis" component={AnalysisScreen} />
  </AnalysisStack.Navigator>
);

const ProfileNavigator: React.FC = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const TabIcon: React.FC<{ emoji: string; focused: boolean; label: string }> = ({
  emoji,
  focused,
  label,
}) => (
  <View style={tabStyles.tabItem}>
    <Text style={[tabStyles.tabEmoji, focused && tabStyles.tabEmojiActive]}>{emoji}</Text>
    <Text style={[tabStyles.tabLabel, focused && tabStyles.tabLabelActive]}>{label}</Text>
  </View>
);

const tabStyles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  tabEmoji: { fontSize: 22, opacity: 0.5 },
  tabEmojiActive: { opacity: 1 },
  tabLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: FontWeight.medium,
  },
  tabLabelActive: { color: Colors.primary, fontWeight: FontWeight.bold },
});

const GlobalFABWrapper: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const fabActions = [
    {
      label: 'Scan Food',
      icon: '📸',
      color: Colors.accent,
      onPress: () => navigation.navigate('AIScanner'),
    },
    {
      label: 'Add Meal',
      icon: '🍽',
      color: Colors.primary,
      onPress: () => navigation.navigate('AddMeal', {}),
    },
    {
      label: 'Add Water',
      icon: '💧',
      color: Colors.water,
      onPress: () => navigation.navigate('AddWater'),
    },
    {
      label: 'Add Exercise',
      icon: '🏃',
      color: Colors.secondary,
      onPress: () => navigation.navigate('AddExercise'),
    },
  ];

  return <FAB actions={fabActions} />;
};

const homeTabIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon emoji="🏠" focused={focused} label="Home" />
);
const analysisTabIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon emoji="📊" focused={focused} label="Analysis" />
);
const profileTabIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon emoji="👤" focused={focused} label="Profile" />
);

export const MainNavigator: React.FC = () => (
  <View style={styles.mainWrapper}>
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{ tabBarIcon: homeTabIcon }}
      />
      <Tab.Screen
        name="AnalysisTab"
        component={AnalysisNavigator}
        options={{ tabBarIcon: analysisTabIcon }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{ tabBarIcon: profileTabIcon }}
      />
    </Tab.Navigator>
    <GlobalFABWrapper />
  </View>
);

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    height: 70,
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.sm,
    ...Shadow.md,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
