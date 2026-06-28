import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardTab({ machine }) {
  const alerts = machine.slots.filter(s => s.stock === 0 || s.stock / s.capacity <= 0.3);
  const bestSeller = [...machine.slots].sort((a, b) => (b.capacity - b.stock) - (a.capacity - a.stock))[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {machine.slots.reduce((s, sl) => s + (sl.capacity - sl.stock), 0)}
          </Text>
          <Text style={styles.statLabel}>Sales Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#1e40af' }]}>
            ${machine.revenueToday.toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>Revenue Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{machine.itemsInStock}</Text>
          <Text style={styles.statLabel}>Items in Stock</Text>
        </View>
        <View style={[styles.statCard, machine.alerts > 0 && styles.alertCard]}>
          <Text style={[styles.statValue, machine.alerts > 0 && { color: '#d97706' }]}>
            {machine.alerts}
          </Text>
          <Text style={styles.statLabel}>Active Alerts</Text>
        </View>
      </View>

      {bestSeller && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Seller Today</Text>
          <View style={styles.bestSellerCard}>
            <View style={styles.trophyBox}>
              <Ionicons name="trophy" size={28} color="#d97706" />
            </View>
            <View>
              <Text style={styles.bestSellerName}>{bestSeller.name}</Text>
              <Text style={styles.bestSellerSub}>
                {bestSeller.capacity - bestSeller.stock} units sold · ${bestSeller.price.toFixed(2)} each
              </Text>
            </View>
          </View>
        </View>
      )}

      {alerts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stock Alerts</Text>
          {alerts.map(slot => {
            const isEmpty = slot.stock === 0;
            return (
              <View key={slot.id} style={[styles.alertRow, { borderLeftColor: isEmpty ? '#dc2626' : '#d97706' }]}>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertSlot}>Slot {slot.id}</Text>
                  <Text style={styles.alertName}>{slot.name}</Text>
                </View>
                <View style={[styles.alertBadge, { backgroundColor: isEmpty ? '#fef2f2' : '#fffbeb' }]}>
                  <Text style={[styles.alertBadgeText, { color: isEmpty ? '#dc2626' : '#d97706' }]}>
                    {isEmpty ? 'EMPTY' : `LOW — ${slot.stock} left`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {alerts.length === 0 && (
        <View style={styles.allGoodCard}>
          <Ionicons name="checkmark-circle" size={28} color="#16a34a" />
          <Text style={styles.allGoodText}>All slots are well stocked!</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', padding: 16 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  alertCard: { borderColor: '#fde68a', backgroundColor: '#fffbeb' },
  statValue: { fontSize: 32, fontWeight: '900', color: '#1e293b' },
  statLabel: { fontSize: 13, color: '#64748b', marginTop: 6, fontWeight: '600' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
  bestSellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  trophyBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fffbeb', alignItems: 'center', justifyContent: 'center' },
  bestSellerName: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  bestSellerSub: { fontSize: 14, color: '#64748b', marginTop: 4 },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  alertInfo: { flex: 1 },
  alertSlot: { fontSize: 12, color: '#94a3b8', fontWeight: '700' },
  alertName: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginTop: 2 },
  alertBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  alertBadgeText: { fontSize: 13, fontWeight: '800' },
  allGoodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  allGoodIcon: { fontSize: 24 },
  allGoodText: { fontSize: 16, color: '#16a34a', fontWeight: '700' },
});
