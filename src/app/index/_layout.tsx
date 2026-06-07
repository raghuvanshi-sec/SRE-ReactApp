import { Stack } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';

export default function HomeStack() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.backgroundElement,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'SRE Dashboard' }}
      />
      <Stack.Screen
        name="Customers"
        options={{ title: 'Risk Profiles' }}
      />
      <Stack.Screen
        name="DigitalTwin"
        options={{ title: 'Digital Twin Simulation' }}
      />
      <Stack.Screen
        name="Agents"
        options={{ title: 'AI Control Room' }}
      />
      <Stack.Screen
        name="Approvals"
        options={{ title: 'Governance Approvals' }}
      />
    </Stack>
  );
}
