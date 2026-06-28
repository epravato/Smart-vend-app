import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMachines } from '../../context/MachinesContext';

export default function CourierHomeScreen({ navigation }) {
  const { machines } = useMachines();
  const sorted = [...machines].sort((a, b) => b.alerts - a.alerts);

  function urgencyColor(alerts) {
    if (alerts >= 4) return '#dc2626';
    if (alerts >= 2) return '#d97706';
    return '#16a34a';
  }

  function urgencyLabel(alerts) {
    if (alerts >= 4) return 'Urgent';
    if (alerts >= 2) return 'Needs Restock';
    return 'All Good';
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Courier Dashboard</Text>
          <Text style={styles.subtitle}>Today's restock assignments</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
          <Ionicons name="log-out-outline" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{machines.length}</Text>
          <Text style={styles.summaryLabel}>Machines</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
          <Text style={[styles.summaryValue, { color: '#dc2626' }]}>
            {machines.filter(m => m.alerts >= 4).length}
          </Text>
          <Text style={styles.summaryLabel}>Urgent</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
          <Text style={[styles.summaryValue, { color: '#d97706' }]}>
            {machines.reduce((s, m) => s + m.alerts, 0)}
          </Text>
          <Text style={styles.summaryLabel}>Total Alerts</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Machines to Restock</Text>

      <FlatList
        data={sorted}
        keyExtractor={m => m.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: machine }) => {
          const color = urgencyColor(machine.alerts);
          const label = urgencyLabel(machine.alerts);
          const emptySlots = machine.slots.filter(s => s.stock === 0).length;
          const lowSlots = machine.slots.filter(s => s.stock > 0 && s.stock / s.capacity <= 0.3).length;

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('CourierRestock', { machine })}
              activeOpacity={0.85}
            >
              <View style={styles.cardLeft}>
                <View style={styles.cardHeader}>
                  <Text style={styles.machineName}>{machine.name}</Text>
                  <View style={[styles.urgencyBadge, { backgroundColor: color + '18' }]}>
                    <View style={[styles.urgencyDot, { backgroundColor: color }]} />
                    <Text style={[styles.urgencyText, { color }]}>{label}</Text>
                  </View>
                </View>
                <Text style={styles.machineLocation}>{machine.location}</Text>

                <View style={styles.slotSummary}>
                  {emptySlots > 0 && (
                    <View style={styles.slotTag}>
                      <Ionicons name="alert-circle" size={13} color="#dc2626" />
                      <Text style={[styles.slotTagText, { color: '#dc2626' }]}>
                        {emptySlots} empty
                      </Text>
                    </View>
                  )}
                  {lowSlots > 0 && (
                    <View style={styles.slotTag}>
                      <Ionicons name="warning" size={13} color="#d97706" />
                      <Text style={[styles.slotTagText, { color: '#d97706' }]}>
                        {lowSlots} low
                      </Text>
                    </View>
                  )}
                  {emptySlots === 0 && lowSlots === 0 && (
                    <View style={styles.slotTag}>
                      <Ionicons name="checkmark-circle" size={13} color="#16a34a" />
                      <Text style={[styles.slotTagText, { color: '#16a34a' }]}>Fully stocked</Text>
                    </View>
                  )}
                </View>
              </View>

              <Ionicons name="chevron-forward" size={22} color="#cbd5e1" />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: { fontSize: 24, fontWeight: '900', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 2 },
  logoutBtn: { padding: 8 },
  summaryRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryValue: { fontSize: 24, fontWeight: '900', color: '#1e293b' },
  summaryLabel: { fontSize: 11, color: '#64748b', marginTop: 3, fontWeight: '600' },
  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: '#1e293b',
    paddingHorizontal: 20, paddingBottom: 10,
  },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLeft: { flex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  machineName: { fontSize: 17, fontWeight: '800', color: '#1e293b' },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  urgencyDot: { width: 7, height: 7, borderRadius: 4 },
  urgencyText: { fontSize: 12, fontWeight: '700' },
  machineLocation: { fontSize: 13, color: '#64748b', marginBottom: 10 },
  slotSummary: { flexDirection: 'row', gap: 10 },
  slotTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  slotTagText: { fontSize: 13, fontWeight: '700' },
});
