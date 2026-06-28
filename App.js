import { MachinesProvider } from './src/context/MachinesContext';
import AppNavigator from './src/app-routing/AppNavigator';

export default function App() {
  return (
    <MachinesProvider>
      <AppNavigator />
    </MachinesProvider>
  );
}
