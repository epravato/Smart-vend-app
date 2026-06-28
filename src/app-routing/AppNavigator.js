import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import FleetScreen from '../screens/FleetScreen';
import MachineScreen from '../screens/MachineScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import NotificationSettingsScreen from '../screens/settings/NotificationSettingsScreen';
import AddMachineScreen from '../screens/settings/AddMachineScreen';
import HelpScreen from '../screens/settings/HelpScreen';
import MyInventoryScreen from '../screens/settings/MyInventoryScreen';
import CourierLoginScreen from '../screens/courier/CourierLoginScreen';
import CourierHomeScreen from '../screens/courier/CourierHomeScreen';
import CourierRestockScreen from '../screens/courier/CourierRestockScreen';
import EditMachineScreen from '../screens/settings/EditMachineScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#1e40af',
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Fleet"
          component={FleetScreen}
          options={({ navigation }) => ({
            headerShown: false,
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ padding: 8 }}>
                <Text style={{ fontSize: 22 }}>⚙️</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Machine"
          component={MachineScreen}
          options={{ title: 'Machine Detail', headerBackTitle: 'Fleet' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'My Profile', headerBackTitle: 'Settings' }}
        />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettingsScreen}
          options={{ title: 'Notifications', headerBackTitle: 'Settings' }}
        />
        <Stack.Screen
          name="AddMachine"
          component={AddMachineScreen}
          options={{ title: 'Add New Machine', headerBackTitle: 'Settings' }}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{ title: 'Help & Support', headerBackTitle: 'Settings' }}
        />
        <Stack.Screen
          name="MyInventory"
          component={MyInventoryScreen}
          options={{ title: 'My Warehouse Inventory', headerBackTitle: 'Settings' }}
        />
        <Stack.Screen
          name="CourierLogin"
          component={CourierLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CourierHome"
          component={CourierHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CourierRestock"
          component={CourierRestockScreen}
          options={{ title: 'Restock Machine', headerBackTitle: 'Machines' }}
        />
        <Stack.Screen
          name="EditMachine"
          component={EditMachineScreen}
          options={{ title: 'Edit Machine Details', headerBackTitle: 'Back' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
