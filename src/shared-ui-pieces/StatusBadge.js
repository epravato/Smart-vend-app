import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusBadge({ stock, capacity }) {
  const pct = stock / capacity;
  let label, color, bg;

  if (stock === 0) {
    label = 'Empty'; color = '#dc2626'; bg = '#fef2f2';
  } else if (pct <= 0.3) {
    label = 'Low'; color = '#d97706'; bg = '#fffbeb';
  } else {
    label = 'OK'; color = '#16a34a'; bg = '#f0fdf4';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
