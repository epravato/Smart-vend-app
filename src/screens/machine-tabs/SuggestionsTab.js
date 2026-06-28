import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialSuggestions = [
  { id: '1', item: 'Kind Bars', votes: 14, category: 'Snack', reorderUrl: 'https://www.amazon.com/s?k=kind+bars', status: 'requested' },
  { id: '2', item: 'Sparkling Water', votes: 11, category: 'Drink', reorderUrl: 'https://www.amazon.com/s?k=sparkling+water+cans', status: 'requested' },
  { id: '3', item: 'Greek Yogurt', votes: 9, category: 'Snack', reorderUrl: 'https://www.amazon.com/s?k=greek+yogurt+cups', status: 'requested' },
  { id: '4', item: 'Cold Brew Coffee', votes: 8, category: 'Drink', reorderUrl: 'https://www.amazon.com/s?k=cold+brew+coffee+cans', status: 'requested' },
  { id: '5', item: 'Pretzels', votes: 6, category: 'Snack', reorderUrl: 'https://www.amazon.com/s?k=pretzel+snack+packs', status: 'requested' },
  { id: '6', item: 'Protein Shake', votes: 5, category: 'Drink', reorderUrl: 'https://www.amazon.com/s?k=protein+shake+ready+to+drink', status: 'requested' },
  { id: '7', item: 'Celsius Energy Drink', votes: 4, category: 'Drink', reorderUrl: 'https://www.amazon.com/s?k=celsius+energy+drink', status: 'requested' },
];

const CATEGORY_COLORS = {
  Snack: { bg: '#eff6ff', text: '#1e40af' },
  Drink: { bg: '#f0fdf4', text: '#16a34a' },
};

export default function SuggestionsTab({ machine }) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [voted, setVoted] = useState({});
  const [qrVisible, setQrVisible] = useState(false);

  const sorted = [...suggestions].sort((a, b) => b.votes - a.votes);

  function handleVote(id) {
    if (voted[id]) return;
    setSuggestions(prev =>
      prev.map(s => s.id === id ? { ...s, votes: s.votes + 1 } : s)
    );
    setVoted(prev => ({ ...prev, [id]: true }));
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <Modal visible={qrVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setQrVisible(false)}>
          <View style={styles.qrModal}>
            <Text style={styles.qrModalTitle}>Customer Suggestion QR</Text>
            <Text style={styles.qrModalSub}>{machine.name}</Text>
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code" size={140} color="#1e40af" />
            </View>
            <Text style={styles.qrModalHint}>
              Print and attach this to your machine. Customers scan to suggest items.
            </Text>
            <TouchableOpacity style={styles.qrCloseBtn} onPress={() => setQrVisible(false)}>
              <Text style={styles.qrCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.qrCard}>
        <View style={styles.qrLeft}>
          <Text style={styles.qrTitle}>Customer Suggestions</Text>
          <Text style={styles.qrDesc}>
            Customers scan the QR code on your machine to suggest items they want stocked.
          </Text>
          <TouchableOpacity style={styles.qrBtn} onPress={() => setQrVisible(true)}>
            <Ionicons name="qr-code-outline" size={16} color="#fff" />
            <Text style={styles.qrBtnText}>View QR Code</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.qrIconBox}>
          <Ionicons name="qr-code" size={64} color="#bfdbfe" />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statPill}>
          <Ionicons name="people-outline" size={16} color="#1e40af" />
          <Text style={styles.statPillText}>{suggestions.reduce((s, i) => s + i.votes, 0)} total votes</Text>
        </View>
        <View style={styles.statPill}>
          <Ionicons name="bulb-outline" size={16} color="#1e40af" />
          <Text style={styles.statPillText}>{suggestions.length} suggestions</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Most Requested</Text>

      {sorted.map((s, index) => {
        const catStyle = CATEGORY_COLORS[s.category] || { bg: '#f1f5f9', text: '#64748b' };
        const isVoted = voted[s.id];
        return (
          <View key={s.id} style={styles.card}>
            <View style={styles.rank}>
              <Text style={[styles.rankNum, index === 0 && styles.rankTop]}>#{index + 1}</Text>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={styles.itemName}>{s.item}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: catStyle.bg }]}>
                  <Text style={[styles.categoryText, { color: catStyle.text }]}>{s.category}</Text>
                </View>
              </View>

              <View style={styles.cardBottom}>
                <TouchableOpacity
                  style={[styles.voteBtn, isVoted && styles.voteBtnActive]}
                  onPress={() => handleVote(s.id)}
                >
                  <Ionicons
                    name={isVoted ? 'thumbs-up' : 'thumbs-up-outline'}
                    size={16}
                    color={isVoted ? '#fff' : '#1e40af'}
                  />
                  <Text style={[styles.voteCount, isVoted && { color: '#fff' }]}>
                    {s.votes} {s.votes === 1 ? 'vote' : 'votes'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.orderBtn}
                  onPress={() => Linking.openURL(s.reorderUrl)}
                >
                  <Ionicons name="cart-outline" size={16} color="#16a34a" />
                  <Text style={styles.orderBtnText}>Order Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}

      <View style={styles.footer}>
        <Ionicons name="information-circle-outline" size={16} color="#94a3b8" />
        <Text style={styles.footerText}>
          Suggestions are submitted anonymously by customers at this machine.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', padding: 16 },
  qrCard: {
    backgroundColor: '#1e40af',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  qrLeft: { flex: 1 },
  qrTitle: { fontSize: 18, fontWeight: '900', color: '#fff', marginBottom: 6 },
  qrDesc: { fontSize: 13, color: '#bfdbfe', lineHeight: 19, marginBottom: 14 },
  qrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  qrBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  qrIconBox: { opacity: 0.6 },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statPillText: { fontSize: 13, color: '#1e40af', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  rank: { width: 32, alignItems: 'center' },
  rankNum: { fontSize: 14, fontWeight: '800', color: '#94a3b8' },
  rankTop: { color: '#d97706', fontSize: 16 },
  cardBody: { flex: 1 },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: { fontSize: 16, fontWeight: '700', color: '#1e293b', flex: 1 },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  categoryText: { fontSize: 11, fontWeight: '700' },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  voteBtnActive: { backgroundColor: '#1e40af' },
  voteCount: { fontSize: 13, fontWeight: '700', color: '#1e40af' },
  orderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  orderBtnText: { fontSize: 13, fontWeight: '700', color: '#16a34a' },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  footerText: { flex: 1, fontSize: 12, color: '#94a3b8', lineHeight: 18 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  qrModal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  qrModalTitle: { fontSize: 20, fontWeight: '900', color: '#1e293b', marginBottom: 4 },
  qrModalSub: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  qrPlaceholder: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#bfdbfe',
  },
  qrModalHint: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  qrCloseBtn: {
    backgroundColor: '#1e40af',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  qrCloseBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
