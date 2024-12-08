import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getAccessToken, setAccessToken } from '@/tokenManager';
import { fetchAPI } from '@/services/apiServices';
import { API_LOGIN, API_USER } from '@/types/ApiTypes';
import { IUser, UserContextType } from '@/types/UserTypes';

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const login = useCallback(() => {
    window.location.href = API_LOGIN;
  }, []);

  const logout = useCallback(() => {
    setUserInfo(null);
    setAccessToken(null);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');

    if (urlToken) {
      setAccessToken(urlToken);
      window.history.replaceState({}, document.title, location.pathname);
    } else {
      setLoading(false);
    }
  }, [location]);

  const fetchUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await fetchAPI<IUser>(API_USER);

      setUserInfo(user);
    } catch (error) {
      setError(`Error fetching user info, ${error}`);
      setAccessToken(null);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedAccessToken = getAccessToken();
    if (!storedAccessToken) return setLoading(false);
    setError(null);
    fetchUserInfo();
  }, [fetchUserInfo]);

  return <UserContext.Provider value={{ userInfo, loading, error, login, logout }}>{children}</UserContext.Provider>;
};
