import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/types';
import { Button, Input } from '../../components/common';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../constants';
import { useAuthStore } from '../../store';
import { login } from '../../services/authService';
import { getErrorMessage } from '../../services/apiClient';
import { validateEmail, validatePassword } from '../../utils/helpers';

type SignInScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
};

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { setAuth, isLoading, setLoading, setError } = useAuthStore();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await login(email.trim(), password);
      await setAuth(response.accessToken, response.user);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo / Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🥗</Text>
          <Text style={styles.title}>AI Calories Tracker</Text>
          <Text style={styles.subtitle}>Track smarter, live healthier</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Welcome Back</Text>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            isPassword
            error={errors.password}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            size="lg"
            style={styles.loginButton}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => Alert.alert('Reset Password', 'Check your email for reset instructions.')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logo: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  formTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  forgotText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  footerText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  signUpLink: {
    fontSize: FontSize.base,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});

export default SignInScreen;
