import { useEffect } from 'react';
import { router } from 'expo-router';
import AuthScreen from './auth';

export default function IndexScreen() {
  // This is the initial route - show the auth screen
  return <AuthScreen />;
}