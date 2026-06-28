import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Linking, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from '../../shared-ui-pieces/StatusBadge';
import { useInventory } from '../../context/InventoryContext';
import { useMachines } from '../../context/MachinesContext';

export default function InventoryTab({ machine }) {
  const { inventory, useStock } = useInventory();
  const { restockMachine } = useMachines();
  const sorted = [...machine.slots].sort((a, b) => {
    const score = s => (s.stock === 0 ? 0 : s.stock / s.capacity <= 0.3 ? 1 : 2);
    return score(a) - score(b);
  });

  const needsAction = slot => slot.stock === 0 || slot.stock / slot.capacity <= 0.3;

  function getWarehouseStock(slotName) {
    return inventory.find(
      i => i.name.toLowerCase() === slotName.toLowerCase() && i.quantity > 0
    );
  }

  function handleUseStock(slot, warehouseItem) {
    const needed = slot.capacity - slot.stock;
    const available = warehouseItem.quantity;
    const toUse = Math.min(needed, available);
    Alert.alert(
      'Use Warehouse Stock',
      `Add ${toUse} ${warehouseItem.unit} of ${slot.name} to this machine?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            useStock(slot.name, toUse);
            restockMachine(machine.id, { [slot.id]: String(toUse) });
          },
        },
      ]
    );
  }

  const canUseFromStock = sorted.filter(s => needsAction(s) && getWarehouseStock(s.name)).length;

  return (
    <FlatList
      data={sorted}
      keyExtractor={s => s.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              {machine.slots.length} slots ·{' '}
              <Text style={{ color: '#dc2626', fontWeight: '700' }}>
                {machine.slots.filter(s => s.stock === 0).length} empty
              </Text>
              {' · '}
              <Text style={{ color: '#d97706', fontWeight: '700' }}>
                {machine.slots.filter(s => s.stock > 0 && s.stock / s.capacity <= 0.3).length} low
              </Text>
            </Text>
          </View>

          {canUseFromStock > 0 && (
            <View style={styles.warehouseBanner}>
              <View style={styles.warehouseIconBox}>
                <Ionicons name="cube" size={20} color="#1e40af" />
              </View>
              <View style={styles.warehouseBannerText}>
                <Text style={styles.warehouseBannerTitle}>
                  You have {canUseFromStock} item{canUseFromStock > 1 ? 's' : ''} in your warehouse
                </Text>
                <Text style={styles.warehouseBannerSub}>
                  Use your own stock before ordering more
                </Text>
              </View>
            </View>
          )}
        </View>
      }
      renderItem={({ item: slot }) => {
        const warehouseItem = getWarehouseStock(slot.name);
        const hasWarehouseStock = !!warehouseItem;

        return (
          <View style={[styles.row, slot.stock === 0 && styles.emptyRow]}>
            <View style={styles.slotBadge}>
              <Text style={styles.slotId}>{slot.id}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{slot.name}</Text>
              <Text style={styles.sub}>{slot.stock} / {slot.capacity} units · ${slot.price.toFixed(2)}</Text>
              {needsAction(slot) && hasWarehouseStock && (
                <View style={styles.warehouseTag}>
                  <Ionicons name="cube-outline" size={12} color="#1e40af" />
                  <Text style={styles.warehouseTagText}>
                    {warehouseItem.quantity} {warehouseItem.unit} in your warehouse
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.right}>
              <StatusBadge stock={slot.stock} capacity={slot.capacity} />
              {needsAction(slot) && (
                hasWarehouseStock ? (
                  <TouchableOpacity style={styles.useStockBtn} onPress={() => handleUseStock(slot, warehouseItem)}>
                    <Ionicons name="cube-outline" size={13} color="#1e40af" />
                    <Text style={styles.useStockText}>Use My Stock</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(slot.reorderUrl)}
                    style={styles.reorderBtn}
                  >
                    <Ionicons name="cart-outline" size={13} color="#16a34a" />
                    <Text style={styles.reorderText}>Reorder</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 32, backgroundColor: '#f0f4f8' },
  summary: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryText: { fontSize: 14, color: '#475569', fontWeight: '500' },
  warehouseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  warehouseIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warehouseBannerText: { flex: 1 },
  warehouseBannerTitle: { fontSize: 14, fontWeight: '800', color: '#1e40af' },
  warehouseBannerSub: { fontSize: 12, color: '#3b82f6', marginTop: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  emptyRow: { borderColor: '#fecaca' },
  slotBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  slotId: { fontSize: 12, fontWeight: '800', color: '#1e40af' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  sub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  warehouseTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },
  warehouseTagText: { fontSize: 12, color: '#1e40af', fontWeight: '600' },
  right: { alignItems: 'flex-end', gap: 6 },
  useStockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  useStockText: { fontSize: 12, color: '#1e40af', fontWeight: '700' },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  reorderText: { fontSize: 12, color: '#16a34a', fontWeight: '700' },
});
