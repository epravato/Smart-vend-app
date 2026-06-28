import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { operatorInventory as dummyInventory } from '../fake-data/operatorInventory';

const InventoryContext = createContext(null);

const FIREBASE_CONFIGURED = true;

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState(
    () => dummyInventory.map(i => ({ ...i }))
  );

  useEffect(() => {
    if (!FIREBASE_CONFIGURED) return;

    const unsub = onSnapshot(collection(db, 'inventory'), snapshot => {
      const data = snapshot.docs.map(d => ({ ...d.data(), _firestoreId: d.id }));
      if (data.length > 0) setInventory(data);
    }, () => {});

    return unsub;
  }, []);

  async function useStock(itemName, amount = 1) {
    const item = inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());
    if (!item) return;
    const newQty = Math.max(0, item.quantity - amount);
    setInventory(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i));

    if (FIREBASE_CONFIGURED) {
      try {
        await updateDoc(doc(db, 'inventory', item.id), { quantity: newQty });
      } catch (e) {
        console.warn('Firestore update failed:', e);
      }
    }
  }

  async function updateItem(id, fields) {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...fields } : i));

    if (FIREBASE_CONFIGURED) {
      try {
        await updateDoc(doc(db, 'inventory', id), fields);
      } catch (e) {
        console.warn('Firestore update failed:', e);
      }
    }
  }

  async function addItem(name, quantity, unit) {
    const newItem = { id: String(Date.now()), name, quantity: parseInt(quantity) || 0, unit };
    setInventory(prev => [...prev, newItem]);

    if (FIREBASE_CONFIGURED) {
      try {
        await addDoc(collection(db, 'inventory'), newItem);
      } catch (e) {
        console.warn('Firestore add failed:', e);
      }
    }
  }

  async function deleteItem(id) {
    setInventory(prev => prev.filter(i => i.id !== id));

    if (FIREBASE_CONFIGURED) {
      try {
        await deleteDoc(doc(db, 'inventory', id));
      } catch (e) {
        console.warn('Firestore delete failed:', e);
      }
    }
  }

  return (
    <InventoryContext.Provider value={{ inventory, useStock, updateItem, addItem, deleteItem }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
