import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const STEPS = ['Enter Details', 'Scan Device', 'Confirm'];

export default function AddMachineScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [deviceId, setDeviceId] = useState('');

  function nextStep() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.stepRow}>
          {STEPS.map((s, i) => (
            <View key={i} style={styles.stepItem}>
              <View style={[styles.stepDot, i <= step && styles.stepDotActive]}>
                <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>
                  {i < step ? '✓' : i + 1}
                </Text>
              </View>
              <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{s}</Text>
            </View>
          ))}
        </View>

        {step === 0 && (
          <View style={styles.form}>
            <Text style={styles.stepTitle}>Name Your Machine</Text>
            <Text style={styles.stepDesc}>Give this machine a name and location so you can identify it in your fleet.</Text>

            <Text style={styles.label}>Machine Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Main Lobby, Break Room"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Building A – 2nd Floor"
              placeholderTextColor="#94a3b8"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        )}

        {step === 1 && (
          <View style={styles.form}>
            <Text style={styles.stepTitle}>Connect Your Device</Text>
            <Text style={styles.stepDesc}>Enter the Device ID printed on your VendSmart hardware unit, or tap Scan to use your camera.</Text>

            <View style={styles.scanBox}>
              <Text style={styles.scanIcon}>📷</Text>
              <Text style={styles.scanText}>Tap to Scan QR Code</Text>
              <Text style={styles.scanSub}>Point your camera at the QR code on the device</Text>
            </View>

            <Text style={styles.orText}>— or enter manually —</Text>

            <Text style={styles.label}>Device ID</Text>
            <TextInput
              style={styles.input}
              placeholder="VS-XXXX-XXXX"
              placeholderTextColor="#94a3b8"
              value={deviceId}
              onChangeText={setDeviceId}
              autoCapitalize="characters"
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.form}>
            <Text style={styles.stepTitle}>All Set!</Text>
            <Text style={styles.stepDesc}>Your new machine has been added to your fleet.</Text>

            <View style={styles.confirmCard}>
              <Text style={styles.confirmIcon}>✅</Text>
              <Text style={styles.confirmName}>{name || 'My New Machine'}</Text>
              <Text style={styles.confirmLocation}>{location || 'No location set'}</Text>
              <View style={styles.onlinePill}>
                <View style={styles.greenDot} />
                <Text style={styles.onlineText}>Device Connected</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.nextBtn, step === 0 && !name && styles.nextBtnDisabled]}
          onPress={nextStep}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {step === STEPS.length - 1 ? 'Go to Fleet' : 'Continue →'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  content: { padding: 20 },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  stepItem: { alignItems: 'center', flex: 1 },
  stepDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepDotActive: { backgroundColor: '#1e40af' },
  stepNum: { fontSize: 15, fontWeight: '800', color: '#94a3b8' },
  stepNumActive: { color: '#fff' },
  stepLabel: { fontSize: 11, color: '#94a3b8', textAlign: 'center', fontWeight: '600' },
  stepLabelActive: { color: '#1e40af' },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  stepTitle: { fontSize: 22, fontWeight: '900', color: '#1e293b', marginBottom: 8 },
  stepDesc: { fontSize: 14, color: '#64748b', lineHeight: 21, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
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
  scanBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bfdbfe',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  scanIcon: { fontSize: 40, marginBottom: 10 },
  scanText: { fontSize: 16, fontWeight: '700', color: '#1e40af' },
  scanSub: { fontSize: 12, color: '#64748b', marginTop: 4, textAlign: 'center' },
  orText: { textAlign: 'center', color: '#94a3b8', fontSize: 13, marginBottom: 16 },
  confirmCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  confirmIcon: { fontSize: 52, marginBottom: 12 },
  confirmName: { fontSize: 22, fontWeight: '900', color: '#1e293b' },
  confirmLocation: { fontSize: 14, color: '#64748b', marginTop: 4 },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 14,
  },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#16a34a' },
  onlineText: { fontSize: 13, color: '#16a34a', fontWeight: '700' },
  nextBtn: {
    backgroundColor: '#1e40af',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  nextBtnDisabled: { backgroundColor: '#93c5fd' },
  nextBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
