import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMachines } from '../../context/MachinesContext';

export default function CourierRestockScreen({ route, navigation }) {
  const { machines, restockMachine } = useMachines();
  // Always use live machine data from context
  const machine = machines.find(m => m.id === route.params.machine.id) || route.params.machine;

  const slotsToRestock = machine.slots.filter(
    s => s.stock === 0 || s.stock / s.capacity <= 0.3
  );
  const stockedSlots = machine.slots.filter(
    s => s.stock > 0 && s.stock / s.capacity > 0.3
  );

  // Pre-fill with the exact amount needed so it always saves correctly
  const [filled, setFilled] = useState(
    Object.fromEntries(slotsToRestock.map(s => [s.id, String(s.capacity - s.stock)]))
  );
  const [checked, setChecked] = useState({});
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allChecked = slotsToRestock.length > 0 && checkedCount === slotsToRestock.length;

  function toggleCheck(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSubmit() {
    restockMachine(machine.id, filled);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successScreen}>
          <Ionicons name="checkmark-circle" size={72} color="#16a34a" />
          <Text style={styles.successTitle}>Restock Complete!</Text>
          <Text style={styles.successSub}>
            {machine.name} has been updated. The operator can see the changes now.
          </Text>
          <View style={styles.successSummary}>
            <View style={styles.successRow}>
              <Ionicons name="cube-outline" size={18} color="#64748b" />
              <Text style={styles.successRowText}>{checkedCount} slots restocked</Text>
            </View>
            <View style={styles.successRow}>
              <Ionicons name="time-outline" size={18} color="#64748b" />
              <Text style={styles.successRowText}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={styles.successRow}>
              <Ionicons name="location-outline" size={18} color="#64748b" />
              <Text style={styles.successRowText}>{machine.location}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.doneBtnText}>Back to Machine List</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const Header = (
    <View>
      {/* Machine card */}
      <View style={styles.machineCard}>
        <Text style={styles.machineName}>{machine.name}</Text>
        <Text style={styles.machineLocation}>{machine.location}</Text>

        <TouchableOpacity
          style={styles.directionsBtn}
          onPress={() => {
            const encoded = encodeURIComponent(machine.address || machine.location);
            Linking.openURL(`https://maps.google.com/?q=${encoded}`);
          }}
        >
          <Ionicons name="navigate" size={16} color="#fff" />
          <View style={styles.directionsBtnInner}>
            <Text style={styles.directionsBtnText}>Get Directions</Text>
            <Text style={styles.directionsAddress} numberOfLines={1}>{machine.address}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { width: `${slotsToRestock.length > 0 ? (checkedCount / slotsToRestock.length) * 100 : 100}%` }
            ]} />
          </View>
          <Text style={styles.progressText}>
            {slotsToRestock.length === 0 ? 'All stocked' : `${checkedCount} / ${slotsToRestock.length} done`}
          </Text>
        </View>
      </View>

      {/* Building notes */}
      {machine.buildingNotes && (
        <View style={styles.buildingNotesCard}>
          <View style={styles.buildingNotesHeader}>
            <Ionicons name="location" size={18} color="#1e40af" />
            <Text style={styles.buildingNotesTitle}>Finding the Machine</Text>
          </View>
          <Text style={styles.buildingNotesBody}>{machine.buildingNotes}</Text>
        </View>
      )}

      {/* Slots to restock */}
      {slotsToRestock.length > 0 && (
        <Text style={styles.sectionTitle}>
          Needs Restocking ({slotsToRestock.length})
        </Text>
      )}
    </View>
  );

  const Footer = (
    <View>
      {/* Full machine inventory */}
      {stockedSlots.length > 0 && (
        <View style={styles.stockedSection}>
          <Text style={styles.sectionTitle}>Already Stocked ({stockedSlots.length})</Text>
          {stockedSlots.map(slot => {
            const pct = Math.round((slot.stock / slot.capacity) * 100);
            return (
              <View key={slot.id} style={styles.stockedCard}>
                <View style={styles.stockedLeft}>
                  <Text style={styles.stockedId}>Slot {slot.id}</Text>
                  <Text style={styles.stockedName}>{slot.name}</Text>
                  <View style={styles.stockedBarBg}>
                    <View style={[styles.stockedBarFill, { width: `${pct}%` }]} />
                  </View>
                </View>
                <View style={styles.stockedRight}>
                  <Text style={styles.stockedQty}>{slot.stock}</Text>
                  <Text style={styles.stockedOf}>/ {slot.capacity}</Text>
                  <Text style={styles.stockedPct}>{pct}%</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Notes + submit */}
      <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Notes (optional)</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Any issues with this machine?"
        placeholderTextColor="#94a3b8"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {slotsToRestock.length > 0 ? (
        <TouchableOpacity
          style={[styles.submitBtn, !allChecked && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
          <Text style={styles.submitBtnText}>
            {allChecked
              ? 'Submit Restock Report'
              : `Check off all ${slotsToRestock.length} slots to submit`}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.submitBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
          <Text style={styles.submitBtnText}>Machine is fully stocked — Done</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={slotsToRestock}
        keyExtractor={s => s.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        renderItem={({ item: slot }) => {
          const isEmpty = slot.stock === 0;
          const isChecked = checked[slot.id];
          const needed = slot.capacity - slot.stock;

          return (
            <View style={[styles.slotCard, isChecked && styles.slotChecked]}>
              <TouchableOpacity
                style={[styles.checkbox, isChecked && styles.checkboxChecked]}
                onPress={() => toggleCheck(slot.id)}
              >
                {isChecked && <Ionicons name="checkmark" size={18} color="#fff" />}
              </TouchableOpacity>

              <View style={styles.slotInfo}>
                <View style={styles.slotHeader}>
                  <Text style={styles.slotId}>Slot {slot.id}</Text>
                  <View style={[styles.statusChip, { backgroundColor: isEmpty ? '#fef2f2' : '#fffbeb' }]}>
                    <Text style={[styles.statusChipText, { color: isEmpty ? '#dc2626' : '#d97706' }]}>
                      {isEmpty ? 'Empty' : `Low — ${slot.stock} left`}
                    </Text>
                  </View>
                </View>

                <Text style={styles.slotName}>{slot.name}</Text>

                {/* Capacity bar */}
                <View style={styles.capacityRow}>
                  <View style={styles.capacityBarBg}>
                    <View style={[
                      styles.capacityBarFill,
                      { width: `${(slot.stock / slot.capacity) * 100}%` }
                    ]} />
                  </View>
                  <Text style={styles.capacityText}>
                    {slot.stock} / {slot.capacity} units
                  </Text>
                </View>

                {/* Units to add — pre-filled with the exact amount needed */}
                <View style={styles.filledRow}>
                  <Text style={styles.filledLabel}>Units to add:</Text>
                  <TextInput
                    style={styles.filledInput}
                    value={filled[slot.id]}
                    onChangeText={v => setFilled(prev => ({ ...prev, [slot.id]: v }))}
                    keyboardType="number-pad"
                    selectTextOnFocus
                  />
                  <Text style={styles.filledHint}>to fill: {needed}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  list: { padding: 16, paddingBottom: 40 },

  machineCard: {
    backgroundColor: '#1e40af',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },
  machineName: { fontSize: 22, fontWeight: '900', color: '#fff' },
  machineLocation: { fontSize: 14, color: '#bfdbfe', marginTop: 4, marginBottom: 14 },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  directionsBtnInner: { flex: 1 },
  directionsBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  directionsAddress: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressBar: {
    flex: 1, height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4, overflow: 'hidden',
  },
  progressFill: { height: 8, backgroundColor: '#4ade80', borderRadius: 4 },
  progressText: { fontSize: 13, color: '#bfdbfe', fontWeight: '700', minWidth: 70 },

  buildingNotesCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: '#bfdbfe',
  },
  buildingNotesHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  buildingNotesTitle: { fontSize: 15, fontWeight: '800', color: '#1e40af' },
  buildingNotesBody: { fontSize: 14, color: '#1e40af', lineHeight: 22 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 12 },

  slotCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16, padding: 16, marginBottom: 10, gap: 14,
    borderWidth: 1, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  slotChecked: { borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' },
  checkbox: {
    width: 28, height: 28, borderRadius: 8,
    borderWidth: 2, borderColor: '#cbd5e1',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  checkboxChecked: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  slotInfo: { flex: 1 },
  slotHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4,
  },
  slotId: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },
  statusChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusChipText: { fontSize: 11, fontWeight: '700' },
  slotName: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 8 },

  capacityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  capacityBarBg: {
    flex: 1, height: 6,
    backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden',
  },
  capacityBarFill: { height: 6, backgroundColor: '#fbbf24', borderRadius: 3 },
  capacityText: { fontSize: 12, color: '#64748b', fontWeight: '600', minWidth: 80 },

  filledRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  filledLabel: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  filledInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5, borderColor: '#1e40af',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
    fontSize: 16, fontWeight: '800', color: '#1e40af',
    width: 64, textAlign: 'center',
  },
  filledHint: { fontSize: 12, color: '#94a3b8' },

  stockedSection: { marginTop: 8, marginBottom: 8 },
  stockedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1, borderColor: '#f1f5f9',
    gap: 12,
  },
  stockedLeft: { flex: 1 },
  stockedId: { fontSize: 11, fontWeight: '700', color: '#94a3b8', marginBottom: 2 },
  stockedName: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 6 },
  stockedBarBg: {
    height: 5, backgroundColor: '#e2e8f0',
    borderRadius: 3, overflow: 'hidden',
  },
  stockedBarFill: { height: 5, backgroundColor: '#4ade80', borderRadius: 3 },
  stockedRight: { alignItems: 'flex-end' },
  stockedQty: { fontSize: 20, fontWeight: '900', color: '#16a34a' },
  stockedOf: { fontSize: 11, color: '#94a3b8' },
  stockedPct: { fontSize: 11, fontWeight: '700', color: '#16a34a' },

  notesInput: {
    backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 14, padding: 14,
    fontSize: 15, color: '#1e293b',
    height: 90, textAlignVertical: 'top', marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  submitBtnDisabled: { backgroundColor: '#94a3b8' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  successScreen: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12,
  },
  successTitle: { fontSize: 30, fontWeight: '900', color: '#1e293b' },
  successSub: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  successSummary: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    width: '100%', gap: 14, marginBottom: 20,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  successRowText: { fontSize: 15, color: '#1e293b', fontWeight: '600' },
  doneBtn: {
    backgroundColor: '#1e40af', borderRadius: 14, padding: 18,
    width: '100%', alignItems: 'center',
  },
  doneBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
