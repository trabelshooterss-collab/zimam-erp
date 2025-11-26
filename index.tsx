import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './AppFixed';
import './index.css'; // <--- ده السطر السحري اللي كان ناقص!
import { StoreProvider } from './context/StoreContext';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <StoreProvider>
        <App />
      </StoreProvider>
    </React.StrictMode>
  );
}