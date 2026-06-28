import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

function ToggleRow({ label, subtitle, value, onChange }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
        thumbColor={value ? '#1e40af' : '#94a3b8'}
      />
    </View>
  );
}

export default function NotificationSettingsScreen() {
  const [emptySlot, setEmptySlot] = useState(true);
  const [lowStock, setLowStock] = useState(true);
  const [offline, setOffline] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [revenueAlerts, setRevenueAlerts] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        <Text style={styles.sectionHeader}>Stock Alerts</Text>
        <View style={styles.section}>
          <ToggleRow
            label="Empty Slot Alert"
            subtitle="Notify me when a slot runs out completely"
            value={emptySlot}
            onChange={setEmptySlot}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Low Stock Alert"
            subtitle="Notify me when a slot is 30% or less full"
            value={lowStock}
            onChange={setLowStock}
          />
        </View>

        <Text style={styles.sectionHeader}>Machine Status</Text>
        <View style={styles.section}>
          <ToggleRow
            label="Machine Goes Offline"
            subtitle="Notify me if a machine loses connection"
            value={offline}
            onChange={setOffline}
          />
        </View>

        <Text style={styles.sectionHeader}>Reports</Text>
        <View style={styles.section}>
          <ToggleRow
            label="Daily Sales Summary"
            subtitle="Get a summary of each day's sales at 8pm"
            value={dailySummary}
            onChange={setDailySummary}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Weekly Report"
            subtitle="Get a weekly breakdown every Monday morning"
            value={weeklySummary}
            onChange={setWeeklySummary}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Revenue Milestone Alerts"
            subtitle="Notify me when I hit a daily revenue goal"
            value={revenueAlerts}
            onChange={setRevenueAlerts}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  content: { padding: 20 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
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
    gap: 12,
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  rowSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 3 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginLeft: 16 },
});
