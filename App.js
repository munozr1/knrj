import Home from './screens/Home';
import * as React from 'react';
import { AuthStateProvider } from './providers/AuthProvider';
import { FirestoreProvider } from './providers/FirestoreProvider';
import { SpotifyProvider } from './providers/SpotifyProvider';


export default function App() {
  
  const [$event, $setEvent] = React.useState({});
  return (
    <AuthStateProvider>
      <FirestoreProvider>
        <SpotifyProvider>
          <Home></Home>
        </SpotifyProvider>
      </FirestoreProvider>
    </AuthStateProvider>
  );
}


