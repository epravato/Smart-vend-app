import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { machines as dummyMachines } from '../fake-data/dummyData';

const MachinesContext = createContext(null);

const FIREBASE_CONFIGURED = true;

export function MachinesProvider({ children }) {
  const [machines, setMachines] = useState(
    () => dummyMachines.map(m => ({ ...m, slots: m.slots.map(s => ({ ...s })) }))
  );
  const [loading, setLoading] = useState(FIREBASE_CONFIGURED);

  useEffect(() => {
    if (!FIREBASE_CONFIGURED) return;

    const unsub = onSnapshot(collection(db, 'machines'), snapshot => {
      const data = snapshot.docs.map(d => ({ ...d.data(), _firestoreId: d.id }));
      if (data.length > 0) setMachines(data);
      setLoading(false);
    }, () => {
      // If Firestore fails, keep using dummy data
      setLoading(false);
    });

    return unsub;
  }, []);

  async function restockMachine(machineId, filledMap) {
    const machine = machines.find(m => m.id === machineId);
    if (!machine) return;

    const newSlots = machine.slots.map(slot => {
      const added = parseInt(filledMap[slot.id] || '0', 10);
      if (!added || isNaN(added)) return slot;
      return { ...slot, stock: Math.min(slot.capacity, slot.stock + added) };
    });

    const alerts = newSlots.filter(s => s.stock === 0 || s.stock / s.capacity <= 0.3).length;
    const itemsInStock = newSlots.reduce((sum, s) => sum + s.stock, 0);
    const updates = { slots: newSlots, alerts, itemsInStock };

    // Update local state immediately for snappy UI
    setMachines(prev => prev.map(m => m.id === machineId ? { ...m, ...updates } : m));

    if (FIREBASE_CONFIGURED) {
      try {
        await updateDoc(doc(db, 'machines', machineId), updates);
      } catch (e) {
        console.warn('Firestore update failed, changes are local only:', e);
      }
    }
  }

  async function updateMachine(machineId, fields) {
    setMachines(prev => prev.map(m => m.id === machineId ? { ...m, ...fields } : m));

    if (FIREBASE_CONFIGURED) {
      try {
        await updateDoc(doc(db, 'machines', machineId), fields);
      } catch (e) {
        console.warn('Firestore update failed:', e);
      }
    }
  }

  async function addMachine(name, location) {
    const newMachine = {
      id: String(Date.now()),
      name,
      location,
      address: '',
      buildingNotes: '',
      status: 'online',
      revenueToday: 0,
      itemsInStock: 0,
      alerts: 0,
      slots: [],
      weekSales: [],
      peakHours: [],
      earnings: {
        monthToDate: 0, lastMonth: 0, thisWeek: 0,
        avgPerDay: 0, itemsSoldMonth: 0, avgSalePrice: 0, recentSales: [],
      },
    };

    setMachines(prev => [...prev, newMachine]);

    if (FIREBASE_CONFIGURED) {
      try {
        await addDoc(collection(db, 'machines'), newMachine);
      } catch (e) {
        console.warn('Firestore add failed:', e);
      }
    }
  }

  async function deleteMachine(machineId) {
    setMachines(prev => prev.filter(m => m.id !== machineId));

    if (FIREBASE_CONFIGURED) {
      try {
        await deleteDoc(doc(db, 'machines', machineId));
      } catch (e) {
        console.warn('Firestore delete failed:', e);
      }
    }
  }

  return (
    <MachinesContext.Provider value={{ machines, loading, restockMachine, updateMachine, addMachine, deleteMachine }}>
      {children}
    </MachinesContext.Provider>
  );
}

export function useMachines() {
  return useContext(MachinesContext);
}
