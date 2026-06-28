// Run this ONCE to populate Firestore with demo data.
// Usage: open the browser console on localhost:8082 and call window.seedFirestore()
// OR import and call seedFirestore() from App.js temporarily.

import { db } from './config';
import { doc, setDoc } from 'firebase/firestore';
import { machines } from '../fake-data/dummyData';
import { operatorInventory } from '../fake-data/operatorInventory';

export async function seedFirestore() {
  console.log('Seeding Firestore...');

  for (const machine of machines) {
    await setDoc(doc(db, 'machines', machine.id), machine);
    console.log(`Seeded machine: ${machine.name}`);
  }

  for (const item of operatorInventory) {
    await setDoc(doc(db, 'inventory', item.id), item);
    console.log(`Seeded inventory: ${item.name}`);
  }

  console.log('Seed complete!');
}
