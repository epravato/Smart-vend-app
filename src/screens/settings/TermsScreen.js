import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Terms of Service</Text>
        <Text style={styles.updated}>Last updated: January 2025</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.body}>
          By using VendSmart, you agree to these Terms of Service. If you do not agree, please discontinue use of the app.
        </Text>

        <Text style={styles.sectionTitle}>2. Use of Service</Text>
        <Text style={styles.body}>
          VendSmart is a fleet management tool for vending machine operators. You are responsible for all activity under your account.
        </Text>

        <Text style={styles.sectionTitle}>3. Data & Privacy</Text>
        <Text style={styles.body}>
          We collect machine data, inventory levels, and sales information to provide the service. We do not sell your data to third parties.
        </Text>

        <Text style={styles.sectionTitle}>4. Limitation of Liability</Text>
        <Text style={styles.body}>
          VendSmart is provided "as is." We are not liable for losses resulting from downtime, data loss, or inaccurate machine data.
        </Text>

        <Text style={styles.sectionTitle}>5. Contact</Text>
        <Text style={styles.body}>
          Questions? Contact us at support@vendsmart.com
        </Text>

        <Text style={styles.heading} style={{ marginTop: 32 }}>Privacy Policy</Text>
        <Text style={styles.updated}>Last updated: January 2025</Text>

        <Text style={styles.sectionTitle}>Data We Collect</Text>
        <Text style={styles.body}>
          We collect your email address, machine data, inventory counts, and restock logs. This data is used solely to power the VendSmart app.
        </Text>

        <Text style={styles.sectionTitle}>Data Storage</Text>
        <Text style={styles.body}>
          All data is stored securely in Firebase (Google Cloud). We follow industry-standard practices for data encryption and access control.
        </Text>

        <Text style={styles.sectionTitle}>Your Rights</Text>
        <Text style={styles.body}>
          You may request deletion of your account and all associated data at any time by contacting support@vendsmart.com.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  content: { padding: 20, paddingBottom: 48 },
  heading: { fontSize: 24, fontWeight: '900', color: '#1e293b', marginBottom: 4 },
  updated: { fontSize: 12, color: '#94a3b8', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginTop: 20, marginBottom: 8 },
  body: { fontSize: 14, color: '#475569', lineHeight: 22 },
});
