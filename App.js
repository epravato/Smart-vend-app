import { MachinesProvider } from './src/context/MachinesContext';
import { InventoryProvider } from './src/context/InventoryContext';
import AppNavigator from './src/app-routing/AppNavigator';

export default function App() {
  return (
    <MachinesProvider>
      <InventoryProvider>
        <AppNavigator />
      </InventoryProvider>
    </MachinesProvider>
  );
}
