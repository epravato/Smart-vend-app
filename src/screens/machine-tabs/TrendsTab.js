import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
  labelColor: () => '#64748b',
  style: { borderRadius: 12 },
  propsForBackgroundLines: { stroke: '#f1f5f9' },
};

export default function TrendsTab({ machine }) {
  const weekData = {
    labels: machine.weekSales.map(d => d.day),
    datasets: [{ data: machine.weekSales.map(d => d.sales) }],
  };

  const peakData = {
    labels: machine.peakHours.map(d => d.hour),
    datasets: [{ data: machine.peakHours.map(d => d.sales) }],
  };

  const topItems = [...machine.slots]
    .sort((a, b) => (b.capacity - b.stock) - (a.capacity - a.stock))
    .slice(0, 5);

  const maxSales = Math.max(...topItems.map(s => s.capacity - s.stock)) || 1;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Sales This Week</Text>
      <View style={styles.chartCard}>
        <BarChart
          data={weekData}
          width={screenWidth - 48}
          height={200}
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          fromZero
        />
      </View>

      <Text style={styles.sectionTitle}>Peak Hours</Text>
      <View style={styles.chartCard}>
        <BarChart
          data={peakData}
          width={screenWidth - 48}
          height={200}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`,
          }}
          style={styles.chart}
          showValuesOnTopOfBars
          fromZero
        />
      </View>

      <Text style={styles.sectionTitle}>Top Items This Week</Text>
      <View style={styles.itemsCard}>
        {topItems.map((slot, i) => {
          const sold = slot.capacity - slot.stock;
          const pct = (sold / maxSales) * 100;
          return (
            <View key={slot.id} style={styles.itemRow}>
              <Text style={styles.rank}>{i + 1}</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{slot.name}</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${pct}%` }]} />
                </View>
              </View>
              <Text style={styles.soldCount}>{sold} sold</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 10, marginTop: 4 },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chart: { borderRadius: 12 },
  itemsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  rank: { width: 20, fontSize: 13, fontWeight: '700', color: '#94a3b8', textAlign: 'center' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: '600', color: '#1e293b', marginBottom: 5 },
  barBg: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4 },
  barFill: { height: 8, backgroundColor: '#1e40af', borderRadius: 4 },
  soldCount: { fontSize: 12, color: '#64748b', fontWeight: '600', width: 50, textAlign: 'right' },
});
