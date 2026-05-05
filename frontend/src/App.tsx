import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import PaymentPage from './pages/PaymentPage';
import Settings from './pages/Settings';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { merchant } = useAuth();
  return merchant ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pay/:id" element={<PaymentPage />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="payments" element={<Payments />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
