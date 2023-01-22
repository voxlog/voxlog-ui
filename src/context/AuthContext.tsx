import { createContext, useEffect, useState } from 'react';
import React from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import api from '../lib/axios';
import { UserDTO } from '../utils/dtos/User';
import { DateTime } from 'luxon';

interface AuthContextProps {
  user: UserDTO | null;
  signInError: unknown | null;
  token: string;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState({} as UserDTO | null);
  const [signInError, setSignInError] = useState<unknown | null>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const { 'jwt.lastLogin': lastLogin } = parseCookies();

    if (lastLogin) {
      const userLastLogin: DateTime = DateTime.fromISO(lastLogin);
      const diffInDays = userLastLogin.diffNow('days').days;
      if (diffInDays > 30) {
        signOut();
      }
    } else {
      signOut();
    }

    const { 'jwt.token': tokenStored } = parseCookies();
    const userData = localStorage.getItem('user');

    if (tokenStored) setToken(tokenStored);
    api.defaults.headers['Authorization'] = `Bearer ${tokenStored}`;
    if (userData) setUser(JSON.parse(userData) as UserDTO);
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const body = { username, password };
      const { data } = await api.post('/users/auth', body);
      const { token: tokenUser } = data;

      setCookie(undefined, 'jwt.token', tokenUser, { maxAge: 60 * 60 * 24 * 30 });
      setToken(tokenUser);
      getUser(tokenUser);
    } catch (error) {
      setSignInError(error);
    } finally {
      setLoading(false);
    }
  };

  async function getUser(token: string) {
    if (token) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      setLoading(true);

      try {
        const { data } = await api.get('/users/current');
        const user: UserDTO = data as UserDTO;
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));

        setCookie(undefined, 'jwt.lastLogin', JSON.stringify(DateTime.now()), {
          maxAge: 60 * 60 * 24 * 30,
        });
      } catch (error) {
        setSignInError(error);
        signOut();
      } finally {
        setLoading(false);
      }
    }
  }

  function signOut() {
    destroyCookie(undefined, 'jwt.token');
    destroyCookie(undefined, 'jwt.lastLogin');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signInError,
        token,
        signIn,
        signOut,
        loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
