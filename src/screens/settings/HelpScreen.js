import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const faqs = [
  {
    q: 'How do I know when a machine needs restocking?',
    a: 'VendSmart sends you a push notification when any slot drops below 30% or goes completely empty. You can also see all alerts at a glance on the Fleet screen.',
  },
  {
    q: 'What does "Offline" mean?',
    a: 'Offline means the VendSmart device in that machine has lost its internet connection. This could be a WiFi issue or a power problem. You\'ll get a notification as soon as it goes offline.',
  },
  {
    q: 'How accurate is the inventory count?',
    a: 'The count is based on IR sensors that detect every item dispensed. As long as the sensors are properly installed, the count is very accurate.',
  },
  {
    q: 'Can I add multiple machines?',
    a: 'Yes! Go to Settings → Add New Machine to pair as many machines as you have devices for. They\'ll all appear on your Fleet screen.',
  },
  {
    q: 'How do I reorder stock?',
    a: 'On the Inventory tab, tap "Reorder ↗" next to any low or empty slot. This opens your supplier\'s website directly so you can order more.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity style={styles.faqItem} onPress={() => setOpen(!open)} activeOpacity={0.7}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQ}>{q}</Text>
        <Text style={styles.faqChevron}>{open ? '▲' : '▼'}</Text>
      </View>
      {open && <Text style={styles.faqA}>{a}</Text>}
    </TouchableOpacity>
  );
}

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Need help?</Text>
          <Text style={styles.contactSub}>Our support team is here for you</Text>
          <View style={styles.contactBtns}>
            <TouchableOpacity style={styles.contactBtn}>
              <Text style={styles.contactBtnIcon}>📧</Text>
              <Text style={styles.contactBtnText}>Email Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactBtn, styles.contactBtnOutline]}>
              <Text style={styles.contactBtnIcon}>💬</Text>
              <Text style={[styles.contactBtnText, { color: '#1e40af' }]}>Live Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
        <View style={styles.faqSection}>
          {faqs.map((faq, i) => (
            <View key={i}>
              <FAQItem q={faq.q} a={faq.a} />
              {i < faqs.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  content: { padding: 20 },
  contactCard: {
    backgroundColor: '#1e40af',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  contactTitle: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
  contactSub: { fontSize: 14, color: '#bfdbfe', marginBottom: 20 },
  contactBtns: { flexDirection: 'row', gap: 12 },
  contactBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  contactBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  contactBtnIcon: { fontSize: 18 },
  contactBtnText: { fontSize: 15, fontWeight: '700', color: '#1e40af' },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  faqSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  faqItem: { padding: 18 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  faqQ: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1e293b', lineHeight: 22 },
  faqChevron: { fontSize: 12, color: '#94a3b8', marginTop: 3 },
  faqA: { fontSize: 14, color: '#475569', lineHeight: 22, marginTop: 10 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginHorizontal: 18 },
});
