import { Stack } from 'expo-router';
import { AuthProvider } from '../context/authcontext';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}