import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,
  Modal, TextInput, Alert, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function SettingsRow({ iconName, iconColor, iconBg, label, subtitle, onPress, danger }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: danger ? '#fef2f2' : iconBg || '#eff6ff' }]}>
        <Ionicons name={iconName} size={20} color={danger ? '#dc2626' : iconColor || '#1e40af'} />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, danger && { color: '#dc2626' }]}>{label}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const [pwModalVisible, setPwModalVisible] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  function handleChangePassword() {
    if (!currentPw || !newPw || !confirmPw) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert('Passwords Don\'t Match', 'New password and confirmation must match.');
      return;
    }
    if (newPw.length < 6) {
      Alert.alert('Too Short', 'Password must be at least 6 characters.');
      return;
    }
    setPwModalVisible(false);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    Alert.alert('Password Updated', 'Your password has been changed successfully.');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={pwModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <Text style={styles.modalLabel}>Current Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              value={currentPw}
              onChangeText={setCurrentPw}
            />

            <Text style={styles.modalLabel}>New Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              value={newPw}
              onChangeText={setNewPw}
            />

            <Text style={styles.modalLabel}>Confirm New Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              value={confirmPw}
              onChangeText={setConfirmPw}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setPwModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleChangePassword}>
                <Text style={styles.saveBtnText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>EP</Text>
          </View>
          <View>
            <Text style={styles.profileName}>Ethan Pravato</Text>
            <Text style={styles.profileEmail}>ethan@vendsmart.com</Text>
            <Text style={styles.profilePlan}>Pro Plan · 3 machines</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Account</Text>
        <View style={styles.section}>
          <SettingsRow
            iconName="person"
            iconColor="#1e40af"
            iconBg="#eff6ff"
            label="My Profile"
            subtitle="Name, email, phone number"
            onPress={() => navigation.navigate('Profile')}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconName="notifications"
            iconColor="#d97706"
            iconBg="#fffbeb"
            label="Notification Settings"
            subtitle="Alerts, low stock thresholds"
            onPress={() => navigation.navigate('NotificationSettings')}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconName="lock-closed"
            iconColor="#64748b"
            iconBg="#f1f5f9"
            label="Change Password"
            subtitle="Update your login password"
            onPress={() => setPwModalVisible(true)}
          />
        </View>

        <Text style={styles.sectionHeader}>Machines</Text>
        <View style={styles.section}>
          <SettingsRow
            iconName="add-circle"
            iconColor="#16a34a"
            iconBg="#f0fdf4"
            label="Add New Machine"
            subtitle="Pair a new vending machine device"
            onPress={() => navigation.navigate('AddMachine')}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconName="construct"
            iconColor="#64748b"
            iconBg="#f1f5f9"
            label="Manage Machines"
            subtitle="Rename, remove, or reorder machines"
            onPress={() => navigation.navigate('ManageMachines')}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconName="cube"
            iconColor="#1e40af"
            iconBg="#eff6ff"
            label="My Warehouse Inventory"
            subtitle="Stock you have on hand to use in machines"
            onPress={() => navigation.navigate('MyInventory')}
          />
        </View>

        <Text style={styles.sectionHeader}>Support</Text>
        <View style={styles.section}>
          <SettingsRow
            iconName="help-circle"
            iconColor="#1e40af"
            iconBg="#eff6ff"
            label="Help & Support"
            subtitle="FAQs, contact us, tutorials"
            onPress={() => navigation.navigate('Help')}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconName="star"
            iconColor="#d97706"
            iconBg="#fffbeb"
            label="Rate VendSmart"
            subtitle="Leave a review on the App Store"
            onPress={() => Linking.openURL('https://apps.apple.com')}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconName="document-text"
            iconColor="#64748b"
            iconBg="#f1f5f9"
            label="Terms & Privacy Policy"
            onPress={() => navigation.navigate('TermsScreen')}
          />
        </View>

        <View style={styles.section}>
          <SettingsRow
            iconName="log-out"
            label="Log Out"
            danger
            onPress={() => navigation.replace('Login')}
          />
        </View>

        <Text style={styles.version}>VendSmart v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '900', color: '#fff' },
  profileName: { fontSize: 18, fontWeight: '800', color: '#fff' },
  profileEmail: { fontSize: 13, color: '#bfdbfe', marginTop: 2 },
  profilePlan: { fontSize: 12, color: '#93c5fd', marginTop: 4, fontWeight: '600' },
  sectionHeader: {
    fontSize: 13, fontWeight: '700', color: '#64748b',
    paddingHorizontal: 20, paddingBottom: 8,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#fff', borderRadius: 16,
    marginHorizontal: 16, marginBottom: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  iconBox: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  rowSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginLeft: 70 },
  version: { textAlign: 'center', color: '#94a3b8', fontSize: 13, marginBottom: 32 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 24, margin: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#1e293b', marginBottom: 20 },
  modalLabel: {
    fontSize: 13, fontWeight: '700', color: '#64748b',
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  modalInput: {
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 12, padding: 14, fontSize: 16, color: '#1e293b', marginBottom: 14,
  },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1, borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 12, padding: 16, alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: '#64748b' },
  saveBtn: {
    flex: 1, backgroundColor: '#1e40af', borderRadius: 12, padding: 16, alignItems: 'center',
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
