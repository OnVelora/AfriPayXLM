import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [merchant, setMerchant] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token)
            api.get('/auth/me').then((r) => setMerchant(r.data)).catch(() => localStorage.removeItem('token'));
    }, []);
    async function login(email, password) {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setMerchant(data.merchant);
    }
    function logout() {
        localStorage.removeItem('token');
        setMerchant(null);
    }
    return _jsx(AuthContext.Provider, { value: { merchant, login, logout }, children: children });
}
export const useAuth = () => useContext(AuthContext);
