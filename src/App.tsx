import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Route from './routes';

import GlobalStyle from './styles/global';

import AppProvider from './hooks';

const App: React.FC = () => {
  return (
    <>
      <AppProvider>
        <BrowserRouter>
          <Route />
        </BrowserRouter>
      </AppProvider>

      <GlobalStyle />
    </>
  );
};

export default App;
