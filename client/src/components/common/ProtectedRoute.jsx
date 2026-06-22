import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false, children }) => {
  const { authLoading, isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <div className="page-shell page-loader">Checking your session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={adminOnly ? '/adm/login' : '/login'} replace state={{ from: location }} />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/products" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  adminOnly: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
