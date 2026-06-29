import React from 'react';
import MachineGridEditor from './MachineGridEditor';
import { useMachines } from '../../context/MachinesContext';

export default function EditGridScreen({ route, navigation }) {
  const { machine } = route.params;
  const { updateMachine } = useMachines();

  function handleSave(slots) {
    const itemsInStock = slots.reduce((sum, s) => sum + (s.stock || 0), 0);
    updateMachine(machine.id, { slots, itemsInStock });
    navigation.goBack();
  }

  return (
    <MachineGridEditor
      initialSlots={machine.slots || []}
      onSave={handleSave}
      onCancel={() => navigation.goBack()}
    />
  );
}
