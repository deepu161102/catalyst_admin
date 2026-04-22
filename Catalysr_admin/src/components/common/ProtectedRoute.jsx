// ============================================================
// PROTECTED ROUTE — Guards routes by auth status and role
// Redirects unauthenticated users to login
// ============================================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  // Show nothing while session is being restored
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #e5e7eb', borderTopColor: '#0d9488', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/" replace />;

  // Wrong role → redirect to their dashboard
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'mentor' ? '/mentor/dashboard' : '/operations/dashboard'} replace />;
  }

  return children;
}
