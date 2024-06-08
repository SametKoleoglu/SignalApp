import React from 'react';
import StackNavigator from './src/navigation/StackNavigator';
import {AuthProvider} from './src/context/AuthContext';
import {SocketContextProvider} from './src/context/SocketContext';

const App = () => {
  return (
    <AuthProvider>
      <SocketContextProvider>
        <StackNavigator />
      </SocketContextProvider>
    </AuthProvider>
  );
};

export default App;
