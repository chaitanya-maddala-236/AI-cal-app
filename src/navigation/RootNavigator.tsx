import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';
import { useAuthStore, useOnboardingStore } from '../store';
import { configureApiClient } from '../services/apiClient';
import { LoadingState } from '../components/common';

// Screens
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import { MainNavigator } from './AppNavigator';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    accessToken,
    loadFromStorage,
    logout,
  } = useAuthStore();
  const { isCompleted: onboardingCompleted } = useOnboardingStore();

  useEffect(() => {
    // Configure API client with token getter and unauthorized handler
    configureApiClient(
      () => accessToken,
      () => logout(),
    );
    loadFromStorage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-configure on token change
  useEffect(() => {
    configureApiClient(
      () => accessToken,
      () => logout(),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <RootStack.Screen name="SignIn" component={SignInScreen} />
            <RootStack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : !onboardingCompleted ? (
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <RootStack.Screen name="Main" component={MainNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
