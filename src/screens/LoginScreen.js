import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    if (email.trim() && password.trim()) {
      navigation.replace('Fleet');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <View style={styles.logoArea}>
          <View style={styles.logoIcon}>
            <Ionicons name="cube" size={36} color="#fff" />
          </View>
          <Text style={styles.appName}>VendSmart</Text>
          <Text style={styles.tagline}>Smart vending. Simple management.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot your password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, (!email || !password) && styles.loginBtnDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoBtn} onPress={() => {
            setEmail('demo@vendsmart.com');
            setPassword('demo1234');
          }}>
            <Text style={styles.demoBtnText}>Use Demo Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.courierBtn}
          onPress={() => navigation.navigate('CourierLogin')}
        >
          <Ionicons name="person-circle-outline" size={22} color="#64748b" />
          <Text style={styles.courierBtnText}>I'm a Courier — Enter PIN</Text>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </TouchableOpacity>

        <Text style={styles.footer}>© 2025 VendSmart. All rights reserved.</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logoArea: { alignItems: 'center', marginBottom: 40 },
  logoIcon: {
    width: 80, height: 80, borderRadius: 22,
    backgroundColor: '#1e40af',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#1e40af',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  appName: { fontSize: 40, fontWeight: '900', color: '#1e40af', letterSpacing: -1 },
  tagline: { fontSize: 16, color: '#64748b', marginTop: 6, textAlign: 'center' },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 8, marginTop: 4 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 16,
  },
  forgotRow: { alignItems: 'flex-end', marginBottom: 20, marginTop: -8 },
  forgotText: { fontSize: 14, color: '#1e40af', fontWeight: '600' },
  loginBtn: {
    backgroundColor: '#1e40af',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginBtnDisabled: { backgroundColor: '#93c5fd' },
  loginBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  demoBtn: {
    borderWidth: 1.5,
    borderColor: '#1e40af',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  demoBtnText: { color: '#1e40af', fontSize: 15, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { fontSize: 13, color: '#94a3b8', fontWeight: '600' },
  courierBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  courierBtnText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#475569' },
  footer: { textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 24 },
});
