import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMachines } from '../context/MachinesContext';

function MachineCard({ machine, onPress, onEdit }) {
  const isOnline = machine.status === 'online';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.machineName}>{machine.name}</Text>
          <Text style={styles.machineLocation}>{machine.location}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: isOnline ? '#f0fdf4' : '#fef2f2' }]}>
          <View style={[styles.dot, { backgroundColor: isOnline ? '#16a34a' : '#dc2626' }]} />
          <Text style={[styles.statusText, { color: isOnline ? '#16a34a' : '#dc2626' }]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <View style={styles.cardStats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>${machine.revenueToday.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Today's Revenue</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{machine.itemsInStock}</Text>
          <Text style={styles.statLabel}>Items in Stock</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, machine.alerts > 0 && styles.alertValue]}>
            {machine.alerts}
          </Text>
          <Text style={styles.statLabel}>{machine.alerts === 1 ? 'Alert' : 'Alerts'}</Text>
        </View>
      </View>

      {machine.alerts > 0 && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertBannerText}>
            {machine.alerts} slot{machine.alerts > 1 ? 's' : ''} need{machine.alerts === 1 ? 's' : ''} restocking
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.editDetailsBtn} onPress={onEdit}>
        <Ionicons name="create-outline" size={15} color="#1e40af" />
        <Text style={styles.editDetailsBtnText}>Edit Machine Details</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function FleetScreen({ navigation }) {
  const { machines } = useMachines();

  const totalRevenue = machines.reduce((s, m) => s + m.revenueToday, 0);
  const totalAlerts = machines.reduce((s, m) => s + m.alerts, 0);
  const offlineCount = machines.filter(m => m.status === 'offline').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>VendSmart</Text>
          <Text style={styles.subtitle}>Your Machine Fleet</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={26} color="#1e40af" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{machines.length}</Text>
          <Text style={styles.summaryLabel}>Total Machines</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>${totalRevenue.toFixed(0)}</Text>
          <Text style={styles.summaryLabel}>Revenue Today</Text>
        </View>
        <View style={[styles.summaryCard, totalAlerts > 0 && styles.warnCard]}>
          <Text style={[styles.summaryValue, totalAlerts > 0 && { color: '#d97706' }]}>
            {totalAlerts}
          </Text>
          <Text style={styles.summaryLabel}>Total Alerts</Text>
        </View>
        <View style={[styles.summaryCard, offlineCount > 0 && styles.dangerCard]}>
          <Text style={[styles.summaryValue, offlineCount > 0 && { color: '#dc2626' }]}>
            {offlineCount}
          </Text>
          <Text style={styles.summaryLabel}>Offline</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Machines</Text>

      <FlatList
        data={machines}
        keyExtractor={m => m.id}
        renderItem={({ item }) => (
          <MachineCard
            machine={item}
            onPress={() => navigation.navigate('Machine', { machine: item })}
            onEdit={() => navigation.navigate('EditMachine', { machine: item })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsBtn: { padding: 6 },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1e40af',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 2,
  },
  summaryGrid: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  warnCard: { backgroundColor: '#fffbeb', borderColor: '#fde68a' },
  dangerCard: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  summaryValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  list: { paddingHorizontal: 16, paddingBottom: 30 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  machineName: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  machineLocation: { fontSize: 14, color: '#64748b', marginTop: 3 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  statusText: { fontSize: 14, fontWeight: '700' },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 22, fontWeight: '900', color: '#1e293b' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: '500' },
  alertValue: { color: '#d97706' },
  statDivider: { width: 1, backgroundColor: '#e2e8f0' },
  alertBanner: {
    marginTop: 14,
    backgroundColor: '#fffbeb',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  alertBannerText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '600',
    textAlign: 'center',
  },
  editDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  editDetailsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e40af',
  },
});
