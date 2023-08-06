import React from 'react';
import Weather from './components/Weather';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
      <Weather />
      <Toaster />
    </>
  );
};

export default App;