import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        // Verify token is valid JSON
        const decoded = JSON.parse(atob(storedToken.split('.')[1]));
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          // Set user from token if available
          if (decoded.userId) {
            setUser({ id: decoded.userId, email: decoded.email });
          }
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Invalid token found, removing:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(`${config.API_URL}/api/auth/login`, { email, password });
    const { token: authToken, user } = response.data;
    localStorage.setItem('token', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    setToken(authToken);
    setUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const response = await axios.post(`${config.API_URL}/api/auth/register`, { name, email, password });
    const { token: authToken, user } = response.data;
    localStorage.setItem('token', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    setToken(authToken);
    setUser(user);
    return user;
  };

  const googleLogin = async (googleToken) => {
    const response = await axios.post(`${config.API_URL}/api/auth/google`, { token: googleToken });
    const { token: jwtToken, user } = response.data;
    localStorage.setItem('token', jwtToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    setToken(jwtToken);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};