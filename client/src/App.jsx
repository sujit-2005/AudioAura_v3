import { BrowserRouter, useLocation } from 'react-router-dom';

import SiteHeader from './components/layout/SiteHeader';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';

const AppFrame = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/adm');

  return (
    <div className="app-frame">
      {!isAdminRoute && <SiteHeader />}
      <AppRoutes />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AppFrame />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
