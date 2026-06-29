import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Modal, TextInput, FlatList, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useInventory } from '../../context/InventoryContext';

const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];
const MIN_ROWS = 1;
const MAX_ROWS = 6;
const MIN_COLS = 1;
const MAX_COLS = 5;

function buildEmptyGrid(rows, cols, existing = {}) {
  const slots = {};
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `${ROW_LABELS[r]}${c + 1}`;
      slots[id] = existing[id] || { id, name: '', capacity: 10, price: 0, stock: 0, reorderUrl: 'https://www.costco.com' };
    }
  }
  return slots;
}

function slotsToArray(grid) {
  return Object.values(grid).filter(s => s.name.trim() !== '');
}

export default function MachineGridEditor({ initialSlots = [], onSave, onCancel }) {
  // Detect initial grid size from existing slots
  const existingMap = {};
  let initRows = 3;
  let initCols = 4;

  if (initialSlots.length > 0) {
    initialSlots.forEach(s => { existingMap[s.id] = s; });
    const rowSet = new Set(initialSlots.map(s => s.id[0]));
    const colSet = new Set(initialSlots.map(s => parseInt(s.id.slice(1))));
    initRows = Math.min(Math.max(rowSet.size, MIN_ROWS), MAX_ROWS);
    initCols = Math.min(Math.max(Math.max(...colSet), MIN_COLS), MAX_COLS);
  }

  const [rows, setRows] = useState(initRows);
  const [cols, setCols] = useState(initCols);
  const [grid, setGrid] = useState(() => buildEmptyGrid(initRows, initCols, existingMap));
  const [pickerVisible, setPickerVisible] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState(null);
  const [search, setSearch] = useState('');
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [capacityInput, setCapacityInput] = useState('10');

  const { inventory } = useInventory();

  const changeRows = useCallback((delta) => {
    const next = Math.min(Math.max(rows + delta, MIN_ROWS), MAX_ROWS);
    if (next === rows) return;
    setRows(next);
    setGrid(g => buildEmptyGrid(next, cols, g));
  }, [rows, cols]);

  const changeCols = useCallback((delta) => {
    const next = Math.min(Math.max(cols + delta, MIN_COLS), MAX_COLS);
    if (next === cols) return;
    setCols(next);
    setGrid(g => buildEmptyGrid(rows, next, g));
  }, [rows, cols]);

  function openPicker(slotId) {
    const slot = grid[slotId];
    setActiveSlotId(slotId);
    setCapacityInput(String(slot.capacity || 10));
    setSearch('');
    setCustomName('');
    setCustomPrice('');
    setPickerVisible(true);
  }

  function assignProduct(name, price = 0) {
    const capacity = parseInt(capacityInput) || 10;
    setGrid(g => ({
      ...g,
      [activeSlotId]: {
        ...g[activeSlotId],
        name,
        capacity,
        stock: capacity,
        price,
        reorderUrl: 'https://www.costco.com',
      },
    }));
    setPickerVisible(false);
  }

  function clearSlot(slotId) {
    setGrid(g => ({
      ...g,
      [slotId]: { ...g[slotId], name: '', capacity: 10, stock: 0, price: 0 },
    }));
  }

  function handleSave() {
    const filled = slotsToArray(grid);
    if (filled.length === 0) {
      Alert.alert('No slots set up', 'Assign at least one product to a slot before saving.');
      return;
    }
    onSave(filled);
  }

  const filteredInventory = inventory.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  // Build ordered slot list for display
  const orderedSlots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `${ROW_LABELS[r]}${c + 1}`;
      orderedSlots.push(grid[id]);
    }
  }

  const CELL_SIZE = Math.min(64, Math.floor(300 / cols));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Machine Layout</Text>
          <Text style={styles.subtitle}>Set up your grid, then tap each slot to assign a product.</Text>
        </View>

        {/* Grid size controls */}
        <View style={styles.sizeCard}>
          <View style={styles.sizeRow}>
            <Text style={styles.sizeLabel}>Rows</Text>
            <View style={styles.sizeControls}>
              <TouchableOpacity style={styles.sizeBtn} onPress={() => changeRows(-1)} disabled={rows <= MIN_ROWS}>
                <Ionicons name="remove" size={20} color={rows <= MIN_ROWS ? '#cbd5e1' : '#1e40af'} />
              </TouchableOpacity>
              <Text style={styles.sizeValue}>{rows}</Text>
              <TouchableOpacity style={styles.sizeBtn} onPress={() => changeRows(1)} disabled={rows >= MAX_ROWS}>
                <Ionicons name="add" size={20} color={rows >= MAX_ROWS ? '#cbd5e1' : '#1e40af'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sizeDivider} />
          <View style={styles.sizeRow}>
            <Text style={styles.sizeLabel}>Columns</Text>
            <View style={styles.sizeControls}>
              <TouchableOpacity style={styles.sizeBtn} onPress={() => changeCols(-1)} disabled={cols <= MIN_COLS}>
                <Ionicons name="remove" size={20} color={cols <= MIN_COLS ? '#cbd5e1' : '#1e40af'} />
              </TouchableOpacity>
              <Text style={styles.sizeValue}>{cols}</Text>
              <TouchableOpacity style={styles.sizeBtn} onPress={() => changeCols(1)} disabled={cols >= MAX_COLS}>
                <Ionicons name="add" size={20} color={cols >= MAX_COLS ? '#cbd5e1' : '#1e40af'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Column labels */}
        <View style={styles.gridWrapper}>
          <View style={styles.colLabelsRow}>
            <View style={{ width: 24 }} />
            {Array.from({ length: cols }, (_, c) => (
              <View key={c} style={[styles.colLabel, { width: CELL_SIZE, marginHorizontal: 3 }]}>
                <Text style={styles.colLabelText}>{c + 1}</Text>
              </View>
            ))}
          </View>

          {/* Grid rows */}
          {Array.from({ length: rows }, (_, r) => (
            <View key={r} style={styles.gridRow}>
              <Text style={styles.rowLabel}>{ROW_LABELS[r]}</Text>
              {Array.from({ length: cols }, (_, c) => {
                const id = `${ROW_LABELS[r]}${c + 1}`;
                const slot = grid[id];
                const filled = slot && slot.name.trim() !== '';
                return (
                  <TouchableOpacity
                    key={id}
                    style={[
                      styles.cell,
                      { width: CELL_SIZE, height: CELL_SIZE + 16, marginHorizontal: 3 },
                      filled && styles.cellFilled,
                    ]}
                    onPress={() => openPicker(id)}
                    onLongPress={() => filled && clearSlot(id)}
                    activeOpacity={0.75}
                  >
                    {filled ? (
                      <>
                        <Text style={styles.cellName} numberOfLines={2}>{slot.name}</Text>
                        <Text style={styles.cellCap}>{slot.capacity}</Text>
                      </>
                    ) : (
                      <Ionicons name="add" size={22} color="#cbd5e1" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <Text style={styles.hint}>Tap to assign · Hold to clear</Text>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#eff6ff' }]} />
            <Text style={styles.legendText}>Empty slot</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#1e40af' }]} />
            <Text style={styles.legendText}>Assigned</Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Ionicons name="cube-outline" size={20} color="#1e40af" />
          <Text style={styles.summaryText}>
            {slotsToArray(grid).length} of {rows * cols} slots assigned
          </Text>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.saveBtnText}>Save Layout</Text>
        </TouchableOpacity>

        {onCancel && (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      {/* Product Picker Modal */}
      <Modal visible={pickerVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Slot {activeSlotId}</Text>
            <TouchableOpacity onPress={() => setPickerVisible(false)}>
              <Ionicons name="close" size={26} color="#1e293b" />
            </TouchableOpacity>
          </View>

          {/* Capacity */}
          <View style={styles.capacityRow}>
            <Text style={styles.capacityLabel}>Capacity (max items)</Text>
            <TextInput
              style={styles.capacityInput}
              value={capacityInput}
              onChangeText={setCapacityInput}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <Text style={styles.pickLabel}>Pick a product from your inventory</Text>

          {/* Search */}
          <View style={styles.searchRow}>
            <Ionicons name="search-outline" size={18} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search inventory..."
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <FlatList
            data={filteredInventory}
            keyExtractor={i => i.id}
            style={styles.inventoryList}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.inventoryItem} onPress={() => assignProduct(item.name, 0)}>
                <View style={styles.inventoryIcon}>
                  <Ionicons name="cube-outline" size={20} color="#1e40af" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inventoryName}>{item.name}</Text>
                  <Text style={styles.inventoryQty}>{item.quantity} {item.unit} in warehouse</Text>
                </View>
                <Ionicons name="add-circle" size={24} color="#1e40af" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No matches. Add a custom product below.</Text>
            }
          />

          {/* Custom product */}
          <View style={styles.customSection}>
            <Text style={styles.customLabel}>Or add a new product</Text>
            <View style={styles.customRow}>
              <TextInput
                style={[styles.searchInput, { flex: 1, marginRight: 8 }]}
                placeholder="Product name"
                placeholderTextColor="#94a3b8"
                value={customName}
                onChangeText={setCustomName}
              />
              <TextInput
                style={[styles.capacityInput, { width: 70 }]}
                placeholder="$0.00"
                placeholderTextColor="#94a3b8"
                value={customPrice}
                onChangeText={setCustomPrice}
                keyboardType="decimal-pad"
              />
            </View>
            <TouchableOpacity
              style={[styles.saveBtn, { marginTop: 10 }, !customName.trim() && { backgroundColor: '#93c5fd' }]}
              onPress={() => customName.trim() && assignProduct(customName.trim(), parseFloat(customPrice) || 0)}
              disabled={!customName.trim()}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>Add Custom Product</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '900', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },

  sizeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
  },
  sizeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  sizeLabel: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  sizeControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  sizeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center',
  },
  sizeValue: { fontSize: 20, fontWeight: '900', color: '#1e40af', minWidth: 28, textAlign: 'center' },
  sizeDivider: { height: 1, backgroundColor: '#f1f5f9', marginHorizontal: 14 },

  gridWrapper: { alignItems: 'center', marginBottom: 8 },
  colLabelsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  colLabel: { alignItems: 'center' },
  colLabelText: { fontSize: 13, fontWeight: '800', color: '#94a3b8' },
  gridRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  rowLabel: { width: 24, fontSize: 13, fontWeight: '800', color: '#94a3b8', textAlign: 'center' },

  cell: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  cellFilled: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
    borderStyle: 'solid',
  },
  cellName: { fontSize: 9, fontWeight: '700', color: '#fff', textAlign: 'center', lineHeight: 12 },
  cellCap: { fontSize: 9, color: '#93c5fd', marginTop: 2 },

  hint: { textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 4, marginBottom: 16 },

  legend: { flexDirection: 'row', gap: 20, justifyContent: 'center', marginBottom: 20 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 14, height: 14, borderRadius: 4 },
  legendText: { fontSize: 13, color: '#64748b', fontWeight: '600' },

  summaryCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#eff6ff', borderRadius: 12, padding: 14, marginBottom: 20,
  },
  summaryText: { fontSize: 15, color: '#1e40af', fontWeight: '700' },

  saveBtn: {
    backgroundColor: '#1e40af', borderRadius: 14, padding: 18,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  cancelBtn: { alignItems: 'center', padding: 12 },
  cancelBtnText: { color: '#64748b', fontSize: 15, fontWeight: '600' },

  // Modal
  modal: { flex: 1, backgroundColor: '#f0f4f8' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#1e293b' },
  capacityRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  capacityLabel: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  capacityInput: {
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 10, padding: 10, fontSize: 16, color: '#1e293b',
    textAlign: 'center', width: 60,
  },
  pickLabel: { fontSize: 13, fontWeight: '700', color: '#64748b', padding: 16, paddingBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1.5, borderColor: '#e2e8f0', marginBottom: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#1e293b' },
  inventoryList: { flex: 1, marginHorizontal: 16 },
  inventoryItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8,
  },
  inventoryIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
  inventoryName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  inventoryQty: { fontSize: 12, color: '#64748b', marginTop: 2 },
  emptyText: { textAlign: 'center', color: '#94a3b8', padding: 20, fontSize: 14 },

  customSection: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  customLabel: { fontSize: 13, fontWeight: '700', color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  customRow: { flexDirection: 'row', alignItems: 'center' },
});
