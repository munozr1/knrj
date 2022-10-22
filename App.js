import Home from './screens/Home';
import { useState } from 'react';
import { AuthStateProvider } from './providers/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';





export default function App() {
  
  const [$event, $setEvent] = useState({});
  return (
    <AuthStateProvider>
        <Home></Home>
    </AuthStateProvider>
  );
}


