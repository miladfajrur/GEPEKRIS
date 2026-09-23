import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './ErrorBoundary';
import { purgeAppCacheOnFreshOpen } from './lib/cacheCleaner';
import './index.css';

// Selalu bersihkan cache dan mulai baru saat pertama kali website dibuka
purgeAppCacheOnFreshOpen();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
