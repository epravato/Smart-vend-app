import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
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
  return (
    <SafeAreaView style={styles.container}>
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
            onPress={() => {}}
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
            onPress={() => {}}
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
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingsRow
            iconName="document-text"
            iconColor="#64748b"
            iconBg="#f1f5f9"
            label="Terms & Privacy Policy"
            onPress={() => {}}
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '900', color: '#fff' },
  profileName: { fontSize: 18, fontWeight: '800', color: '#fff' },
  profileEmail: { fontSize: 13, color: '#bfdbfe', marginTop: 2 },
  profilePlan: { fontSize: 12, color: '#93c5fd', marginTop: 4, fontWeight: '600' },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    paddingHorizontal: 20,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rowText: { flex: 1 },
  rowLabel: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  rowSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  chevron: { fontSize: 22, color: '#cbd5e1' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginLeft: 70 },
  version: { textAlign: 'center', color: '#94a3b8', fontSize: 13, marginBottom: 32 },
});
