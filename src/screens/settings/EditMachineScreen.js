import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EditMachineScreen({ route, navigation }) {
  const { machine } = route.params;

  const [name, setName] = useState(machine.name);
  const [location, setLocation] = useState(machine.location);
  const [address, setAddress] = useState(machine.address || '');
  const [buildingNotes, setBuildingNotes] = useState(machine.buildingNotes || '');

  function handleSave() {
    Alert.alert(
      'Changes Saved',
      `${name} has been updated. In the live app, this would sync to all couriers instantly.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  }

  const hasChanges =
    name !== machine.name ||
    location !== machine.location ||
    address !== (machine.address || '') ||
    buildingNotes !== (machine.buildingNotes || '');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.machineCard}>
          <Ionicons name="cube" size={28} color="#fff" />
          <Text style={styles.cardTitle}>{machine.name}</Text>
          <Text style={styles.cardSub}>Editing machine details</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Machine Info</Text>

          <Text style={styles.label}>Machine Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Main Lobby"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Location Label</Text>
          <Text style={styles.hint}>Short label shown on the dashboard (e.g. "Purdue Union – 1st Floor")</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Building – Floor"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Courier Directions</Text>

          <Text style={styles.label}>Street Address</Text>
          <Text style={styles.hint}>Used to open Google Maps for your couriers</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="123 Main St, City, ST 12345"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Finding the Machine</Text>
          <Text style={styles.hint}>Step-by-step directions from the entrance to the machine. Couriers see this before restocking.</Text>
          <TextInput
            style={styles.textArea}
            value={buildingNotes}
            onChangeText={setBuildingNotes}
            placeholder="e.g. Enter through the main doors on Grant St. Machine is immediately on your right..."
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, !hasChanges && styles.saveBtnDisabled]}
          onPress={handleSave}
          activeOpacity={0.85}
          disabled={!hasChanges}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color="#1e40af" />
          <Text style={styles.infoText}>
            Changes to directions and building notes are immediately visible to couriers on their next restock.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  scroll: { padding: 16, paddingBottom: 48 },
  machineCard: {
    backgroundColor: '#1e40af',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    gap: 6,
  },
  cardTitle: { fontSize: 22, fontWeight: '900', color: '#fff' },
  cardSub: { fontSize: 13, color: '#bfdbfe' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 16,
  },
  label: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  hint: { fontSize: 12, color: '#94a3b8', marginBottom: 8 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1e293b',
    height: 130,
    marginBottom: 4,
  },
  saveBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  saveBtnDisabled: { backgroundColor: '#94a3b8' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoText: { flex: 1, fontSize: 13, color: '#1e40af', lineHeight: 20 },
});
