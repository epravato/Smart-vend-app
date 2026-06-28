import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useMachines } from '../context/MachinesContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardTab from './machine-tabs/DashboardTab';
import InventoryTab from './machine-tabs/InventoryTab';
import TrendsTab from './machine-tabs/TrendsTab';
import EarningsTab from './machine-tabs/EarningsTab';
import SuggestionsTab from './machine-tabs/SuggestionsTab';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Dashboard: 'grid-outline',
  Inventory: 'cube-outline',
  Trends: 'bar-chart-outline',
  Earnings: 'cash-outline',
  Suggestions: 'chatbubble-ellipses-outline',
};

export default function MachineScreen({ route }) {
  const { machines } = useMachines();
  const machine = machines.find(m => m.id === route.params.machine.id) || route.params.machine;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.machineHeader}>
        <Text style={styles.machineName}>{machine.name}</Text>
        <Text style={styles.machineLocation}>{machine.location}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: machine.status === 'online' ? '#16a34a' : '#dc2626' }]} />
          <Text style={[styles.statusText, { color: machine.status === 'online' ? '#16a34a' : '#dc2626' }]}>
            {machine.status === 'online' ? 'Online' : 'Offline — Last seen yesterday'}
          </Text>
        </View>
      </View>

      <Tab.Navigator
        screenOptions={({ route: r }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name={TAB_ICONS[r.name]} size={24} color={color} />,
          tabBarActiveTintColor: '#1e40af',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarStyle: { borderTopColor: '#e2e8f0', height: 65, paddingBottom: 8 },
          tabBarLabelStyle: { fontSize: 13, fontWeight: '700' },
        })}
      >
        <Tab.Screen name="Dashboard">
          {() => <DashboardTab machine={machine} />}
        </Tab.Screen>
        <Tab.Screen name="Inventory">
          {() => <InventoryTab machine={machine} />}
        </Tab.Screen>
        <Tab.Screen name="Trends">
          {() => <TrendsTab machine={machine} />}
        </Tab.Screen>
        <Tab.Screen name="Earnings">
          {() => <EarningsTab machine={machine} />}
        </Tab.Screen>
        <Tab.Screen name="Suggestions">
          {() => <SuggestionsTab machine={machine} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  machineHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  machineName: { fontSize: 24, fontWeight: '900', color: '#1e293b' },
  machineLocation: { fontSize: 15, color: '#64748b', marginTop: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  statusText: { fontSize: 15, fontWeight: '700' },
});
