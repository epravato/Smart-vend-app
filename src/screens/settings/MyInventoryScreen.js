import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useInventory } from '../../context/InventoryContext';

export default function MyInventoryScreen() {
  const { inventory, updateItem, addItem, deleteItem } = useInventory();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newUnit, setNewUnit] = useState('units');
  const [search, setSearch] = useState('');

  const filtered = inventory.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditingItem(null);
    setNewName('');
    setNewQty('');
    setNewUnit('units');
    setModalVisible(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setNewName(item.name);
    setNewQty(String(item.quantity));
    setNewUnit(item.unit);
    setModalVisible(true);
  }

  function saveItem() {
    if (!newName.trim() || !newQty.trim()) return;
    if (editingItem) {
      updateItem(editingItem.id, {
        name: newName.trim(),
        quantity: parseInt(newQty) || 0,
        unit: newUnit,
      });
    } else {
      addItem(newName.trim(), newQty, newUnit);
    }
    setModalVisible(false);
  }

  function adjustQty(id, delta) {
    const item = inventory.find(i => i.id === id);
    if (item) updateItem(id, { quantity: Math.max(0, item.quantity + delta) });
  }

  const totalItems = inventory.reduce((s, i) => s + i.quantity, 0);
  const lowItems = inventory.filter(i => i.quantity > 0 && i.quantity <= 6).length;
  const outItems = inventory.filter(i => i.quantity === 0).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalItems}</Text>
          <Text style={styles.statLabel}>Total Units</Text>
        </View>
        <View style={[styles.statCard, lowItems > 0 && styles.warnCard]}>
          <Text style={[styles.statValue, lowItems > 0 && { color: '#d97706' }]}>{lowItems}</Text>
          <Text style={styles.statLabel}>Running Low</Text>
        </View>
        <View style={[styles.statCard, outItems > 0 && styles.dangerCard]}>
          <Text style={[styles.statValue, outItems > 0 && { color: '#dc2626' }]}>{outItems}</Text>
          <Text style={styles.statLabel}>Out of Stock</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your inventory..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isOut = item.quantity === 0;
          const isLow = item.quantity > 0 && item.quantity <= 6;
          return (
            <View style={[styles.row, isOut && styles.rowOut]}>
              <TouchableOpacity onPress={() => openEdit(item)} style={styles.rowMain}>
                <View style={styles.rowLeft}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.statusRow}>
                    {isOut && (
                      <View style={styles.badge}>
                        <Text style={[styles.badgeText, { color: '#dc2626' }]}>Out of stock</Text>
                      </View>
                    )}
                    {isLow && (
                      <View style={[styles.badge, { backgroundColor: '#fffbeb' }]}>
                        <Text style={[styles.badgeText, { color: '#d97706' }]}>Running low</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.qtyControls}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => adjustQty(item.id, -1)}
                  >
                    <Ionicons name="remove" size={16} color="#64748b" />
                  </TouchableOpacity>
                  <View style={styles.qtyBox}>
                    <Text style={[styles.qtyNum, isOut && { color: '#dc2626' }]}>
                      {item.quantity}
                    </Text>
                    <Text style={styles.qtyUnit}>{item.unit}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => adjustQty(item.id, 1)}
                  >
                    <Ionicons name="add" size={16} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={18} color="#dc2626" />
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubtext}>Tap + to add items to your warehouse inventory</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingItem ? 'Edit Item' : 'Add Item'}</Text>

            <Text style={styles.modalLabel}>Item Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Red Bull, Doritos..."
              placeholderTextColor="#94a3b8"
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={styles.modalLabel}>Quantity</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="0"
              placeholderTextColor="#94a3b8"
              value={newQty}
              onChangeText={setNewQty}
              keyboardType="number-pad"
            />

            <Text style={styles.modalLabel}>Unit</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="bags, cans, bottles, bars..."
              placeholderTextColor="#94a3b8"
              value={newUnit}
              onChangeText={setNewUnit}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveItem}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  warnCard: { backgroundColor: '#fffbeb', borderColor: '#fde68a' },
  dangerCard: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  statValue: { fontSize: 24, fontWeight: '900', color: '#1e293b' },
  statLabel: { fontSize: 11, color: '#64748b', marginTop: 3, fontWeight: '600' },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1e293b' },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#1e40af',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  row: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  rowOut: { borderColor: '#fecaca', opacity: 0.85 },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  rowLeft: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  statusRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  badge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBox: { alignItems: 'center', minWidth: 40 },
  qtyNum: { fontSize: 18, fontWeight: '900', color: '#1e293b' },
  qtyUnit: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
  deleteBtn: {
    padding: 14,
    borderLeftWidth: 1,
    borderLeftColor: '#f1f5f9',
  },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#94a3b8' },
  emptySubtext: { fontSize: 13, color: '#cbd5e1', textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    margin: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#1e293b', marginBottom: 20 },
  modalLabel: { fontSize: 13, fontWeight: '700', color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 14,
  },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: '#64748b' },
  saveBtn: {
    flex: 1,
    backgroundColor: '#1e40af',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
