import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { UserAuthProvider } from './context/UserAuthContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <UserAuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </UserAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
