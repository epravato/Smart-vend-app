import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMachines } from '../../context/MachinesContext';

export default function ManageMachinesScreen() {
  const { machines, updateMachine, deleteMachine } = useMachines();
  const [editingMachine, setEditingMachine] = useState(null);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');

  function openEdit(machine) {
    setEditingMachine(machine);
    setEditName(machine.name);
    setEditLocation(machine.location);
  }

  function saveEdit() {
    if (!editName.trim()) return;
    updateMachine(editingMachine.id, { name: editName.trim(), location: editLocation.trim() });
    setEditingMachine(null);
  }

  function confirmDelete(machine) {
    Alert.alert(
      'Remove Machine',
      `Remove "${machine.name}" from your fleet? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => deleteMachine(machine.id) },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={!!editingMachine} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rename Machine</Text>

            <Text style={styles.label}>Machine Name</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="e.g. Main Lobby"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.label}>Location Label</Text>
            <TextInput
              style={styles.input}
              value={editLocation}
              onChangeText={setEditLocation}
              placeholder="e.g. Building A – 2nd Floor"
              placeholderTextColor="#94a3b8"
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingMachine(null)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={machines}
        keyExtractor={m => m.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.hint}>Tap the pencil to rename, trash to remove.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.dot, { backgroundColor: item.status === 'online' ? '#16a34a' : '#dc2626' }]} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.location}>{item.location}</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn} onPress={() => openEdit(item)}>
              <Ionicons name="create-outline" size={20} color="#1e40af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => confirmDelete(item)}>
              <Ionicons name="trash-outline" size={20} color="#dc2626" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No machines in your fleet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  list: { padding: 16, paddingBottom: 32 },
  hint: { fontSize: 13, color: '#94a3b8', marginBottom: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 12,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  location: { fontSize: 13, color: '#64748b', marginTop: 2 },
  iconBtn: { padding: 6 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: '#94a3b8', fontWeight: '600' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end',
  },
  modalCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, margin: 16 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#1e293b', marginBottom: 20 },
  label: {
    fontSize: 13, fontWeight: '700', color: '#64748b',
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 12, padding: 14, fontSize: 16, color: '#1e293b', marginBottom: 14,
  },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1, borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 12, padding: 16, alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: '#64748b' },
  saveBtn: {
    flex: 1, backgroundColor: '#1e40af', borderRadius: 12, padding: 16, alignItems: 'center',
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
