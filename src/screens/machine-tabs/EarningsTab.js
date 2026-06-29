import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function EarningsTab({ machine }) {
  const earnings = machine.earnings || {};
  const recentSales = machine.recentSales || earnings.recentSales || [];
  const pctChange = earnings.lastMonth
    ? (((earnings.monthToDate - earnings.lastMonth) / earnings.lastMonth) * 100).toFixed(1)
    : '0.0';
  const isUp = (earnings.monthToDate || 0) >= (earnings.lastMonth || 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Month-to-Date Revenue</Text>
        <Text style={styles.heroValue}>${earnings.monthToDate.toFixed(2)}</Text>
        <View style={[styles.changePill, { backgroundColor: isUp ? '#f0fdf4' : '#fef2f2' }]}>
          <Text style={{ color: isUp ? '#16a34a' : '#dc2626', fontSize: 13, fontWeight: '700' }}>
            {isUp ? '▲' : '▼'} {Math.abs(pctChange)}% vs last month
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${earnings.thisWeek.toFixed(2)}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${earnings.avgPerDay.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Avg / Day</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{earnings.itemsSoldMonth}</Text>
          <Text style={styles.statLabel}>Items Sold</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${earnings.avgSalePrice.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Avg Sale Price</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Sales</Text>
      <View style={styles.salesCard}>
        {recentSales.length === 0 ? (
          <View style={styles.saleRow}>
            <Text style={{ color: '#94a3b8', fontSize: 14 }}>No sales recorded yet</Text>
          </View>
        ) : recentSales.map((sale, i) => (
          <View key={i} style={[styles.saleRow, i < recentSales.length - 1 && styles.saleRowBorder]}>
            <View style={styles.saleLeft}>
              <Text style={styles.saleName}>{sale.item}</Text>
              <Text style={styles.saleTime}>{sale.time} · qty {sale.qty}</Text>
            </View>
            <Text style={styles.saleRevenue}>+${sale.revenue.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  heroCard: {
    backgroundColor: '#1e40af',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1e40af',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  heroLabel: { fontSize: 13, color: '#bfdbfe', fontWeight: '500' },
  heroValue: { fontSize: 40, fontWeight: '900', color: '#fff', marginTop: 4, marginBottom: 12 },
  changePill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  statLabel: { fontSize: 11, color: '#64748b', marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 10 },
  salesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  saleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  saleRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  saleLeft: { flex: 1 },
  saleName: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  saleTime: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  saleRevenue: { fontSize: 15, fontWeight: '700', color: '#16a34a' },
});
