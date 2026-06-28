import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CORRECT_PIN = '1234';

export default function CourierLoginScreen({ navigation }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  function pressKey(key) {
    if (pin.length >= 4) return;
    const newPin = pin + key;
    setPin(newPin);
    setError(false);
    if (newPin.length === 4) {
      setTimeout(() => {
        if (newPin === CORRECT_PIN) {
          navigation.replace('CourierHome');
        } else {
          setError(true);
          setPin('');
        }
      }, 200);
    }
  }

  function deleteKey() {
    setPin(p => p.slice(0, -1));
    setError(false);
  }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','del'];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#1e40af" />
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons name="person-circle-outline" size={56} color="#1e40af" />
        </View>
        <Text style={styles.title}>Courier Access</Text>
        <Text style={styles.subtitle}>Enter your 4-digit PIN to continue</Text>

        <View style={styles.dotsRow}>
          {[0,1,2,3].map(i => (
            <View key={i} style={[
              styles.dot,
              i < pin.length && styles.dotFilled,
              error && styles.dotError,
            ]} />
          ))}
        </View>

        {error && (
          <Text style={styles.errorText}>Incorrect PIN. Try again.</Text>
        )}

        <View style={styles.keypad}>
          {keys.map((key, i) => {
            if (key === '') return <View key={i} style={styles.keyEmpty} />;
            if (key === 'del') return (
              <TouchableOpacity key={i} style={styles.keyBtn} onPress={deleteKey}>
                <Ionicons name="backspace-outline" size={22} color="#64748b" />
              </TouchableOpacity>
            );
            return (
              <TouchableOpacity key={i} style={styles.keyBtn} onPress={() => pressKey(key)}>
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.hint}>Demo PIN: 1234</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 20,
  },
  backText: { fontSize: 15, color: '#1e40af', fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '900', color: '#1e293b', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#64748b', marginBottom: 32 },
  dotsRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: 'transparent',
  },
  dotFilled: { backgroundColor: '#1e40af', borderColor: '#1e40af' },
  dotError: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  errorText: { fontSize: 14, color: '#dc2626', fontWeight: '600', marginBottom: 16 },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 280,
    marginTop: 24,
    gap: 12,
  },
  keyBtn: {
    width: 80,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  keyEmpty: { width: 80, height: 70 },
  keyText: { fontSize: 24, fontWeight: '700', color: '#1e293b' },
  hint: { marginTop: 32, fontSize: 13, color: '#94a3b8' },
});
