import React, { createContext, useContext, useState } from 'react';
import { machines as initialMachines } from '../fake-data/dummyData';

const MachinesContext = createContext(null);

export function MachinesProvider({ children }) {
  const [machines, setMachines] = useState(
    () => initialMachines.map(m => ({ ...m, slots: m.slots.map(s => ({ ...s })) }))
  );

  function restockMachine(machineId, filledMap) {
    setMachines(prev => prev.map(machine => {
      if (machine.id !== machineId) return machine;

      const newSlots = machine.slots.map(slot => {
        const added = parseInt(filledMap[slot.id] || '0', 10);
        if (!added || isNaN(added)) return slot;
        return { ...slot, stock: Math.min(slot.capacity, slot.stock + added) };
      });

      const alerts = newSlots.filter(
        s => s.stock === 0 || s.stock / s.capacity <= 0.3
      ).length;

      const itemsInStock = newSlots.reduce((sum, s) => sum + s.stock, 0);

      return { ...machine, slots: newSlots, alerts, itemsInStock };
    }));
  }

  return (
    <MachinesContext.Provider value={{ machines, restockMachine }}>
      {children}
    </MachinesContext.Provider>
  );
}

export function useMachines() {
  return useContext(MachinesContext);
}
