
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { loginUser } from '../lib/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await loginUser(email.trim(), password);
      router.replace('/(authenticated)/(tabs)/home');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to log in right now.';
      Alert.alert('Login Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoCircle}>
          <Text style={styles.logo}>♫</Text>
        </View>

        <Text style={styles.appName}>MeloShare</Text>
        <Text style={styles.subtitle}>
          Share your music. Share your moments.
        </Text>

        <View style={styles.form}>
          <Text style={styles.heading}>Welcome Back!</Text>
          <Text style={styles.description}>
            Login to discover and share your favorite music.
          </Text>

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>LOGIN</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
            </Text>

            <Link href="/(unauthenticated)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerText}>Register</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
  },
  logoCircle: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: '#F7B5CC',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  logo: {
    fontSize: 48,
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D94F82',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 35,
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 22,
    elevation: 3,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 7,
  },
  description: {
    color: '#888',
    fontSize: 13,
    marginBottom: 25,
  },
  label: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#F0D5E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#222',
    backgroundColor: '#FFFAFC',
  },
  loginButton: {
    backgroundColor: '#D94F82',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 23,
  },
  footerText: {
    color: '#777',
    fontSize: 13,
  },
  registerText: {
    color: '#D94F82',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
