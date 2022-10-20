import Home from './screens/Home';
import { useState } from 'react';
import { AuthStateProvider } from './providers/AuthProvider';





export default function App() {
  
  const [$event, $setEvent] = useState({});
  return (
    <AuthStateProvider>
      <Home></Home>
    </AuthStateProvider>
  );
}


