import Home from './screens/Home';
import { useState } from 'react';
import { AuthStateProvider } from './providers/AuthProvider';
import { FirestoreProvider } from './providers/FirestoreProvider';


export default function App() {
  
  const [$event, $setEvent] = useState({});
  return (
    <AuthStateProvider>
      <FirestoreProvider>
        <Home></Home>
      </FirestoreProvider>
    </AuthStateProvider>
  );
}


