import { createContext, useEffect, useState } from 'react';
import React from 'react';

// store token in a secure cookie
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import api from '../lib/axios';
import { UserDTO } from '../utils/dtos/User';
import { DateTime } from 'luxon';

interface AuthContextProps {
  user: UserDTO | null;
  token: string;
  signIn: (username: string, password: string) => Promise<void>;
  singOut: () => void;
  loading: boolean;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState({} as UserDTO | null);
  const [error, setError] = useState<unknown | null>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const { 'jwt.lastLogin': lastLogin } = parseCookies();
    if (lastLogin) {
      const userLastLogin: DateTime = DateTime.fromISO(lastLogin);
      const diffInDays = userLastLogin.diffNow('days').days;
      if (diffInDays > 30) singOut();
    } else {
      singOut();
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
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (token: string) => {
    if (token) {
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      setLoading(true);
      api
        .get('/users/current')
        .then((response) => {
          const user: UserDTO = response.data as UserDTO;
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));

          setCookie(undefined, 'jwt.lastLogin', JSON.stringify(DateTime.now()), {
            maxAge: 60 * 60 * 24 * 30,
          });
        })

        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const singOut = () => {
    destroyCookie(undefined, 'jwt.token');
    destroyCookie(undefined, 'jwt.lastLogin');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        singOut,
        loading,
        token,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
