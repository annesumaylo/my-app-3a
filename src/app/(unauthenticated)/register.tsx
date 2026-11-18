
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { registerUser } from '../lib/api';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Missing Information', 'Please complete all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Error', 'Your passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const username = name.trim().toLowerCase().replace(/\s+/g, '');
      await registerUser(name.trim(), username, email.trim(), password);
      Alert.alert('Registration Successful', 'Your account has been created.');
      router.replace('/(unauthenticated)/login');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to create your account.';
      Alert.alert('Registration Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.logoCircle}>
        <Text style={styles.logo}>♫</Text>
      </View>

      <Text style={styles.appName}>MeloShare</Text>
      <Text style={styles.subtitle}>
        Join the community of music lovers.
      </Text>

      <View style={styles.form}>
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.description}>
          Sign up and start sharing your favorite music.
        </Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
          </Text>

          <Link href="/(unauthenticated)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
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
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: '#F7B5CC',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  logo: {
    fontSize: 43,
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#D94F82',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    marginTop: 5,
    marginBottom: 25,
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 22,
    elevation: 3,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  description: {
    fontSize: 13,
    color: '#888',
    marginTop: 6,
    marginBottom: 15,
  },
  label: {
    color: '#333',
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 7,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#F0D5E0',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFAFC',
    color: '#222',
  },
  registerButton: {
    height: 52,
    backgroundColor: '#D94F82',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  footerText: {
    color: '#777',
    fontSize: 13,
  },
  loginText: {
    color: '#D94F82',
    fontWeight: 'bold',
  },
});
