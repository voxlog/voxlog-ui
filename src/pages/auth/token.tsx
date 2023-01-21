import React, { useEffect } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../hooks/auth';
import Link from 'next/link';

export default function GetApiToken() {
  const { token, user } = useAuth();
  const [apiToken, setApiToken] = React.useState<string | null>(null);

  async function getApiToken() {
    try {
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      const { data } = await api.get('/users/auth/token');
      setApiToken(data.token);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      {/* centralize a header with "Api Token" */}
      {/* and a protected field with the token */}
      <div className="flex flex-col items-center justify-center w-3/12 bg-neutral-100 rounded-xl">
        <h1 className="my-5 text-2xl font-bold">Voxlog API Token</h1>
        <div className="flex flex-col items-center justify-center w-full h-1/2">
          {apiToken === null ? (
            user ? (
              <button className="p-3 text-white bg-red-800 rounded-md" onClick={getApiToken}>
                Get API Token
              </button>
            ) : (
              <Link href="/signin">
                <span className="p-3 text-white bg-red-800 rounded-md">Sign in to get your token</span>
              </Link>
            )
          ) : (
            <input
              className="w-1/2 text-center text-gray-900 border-2 border-gray-300 rounded-md h-1/2"
              type="text"
              value={apiToken !== '' ? apiToken : 'You need to login to get your token'}
              readOnly
            />
          )}
          <p className="my-5 text-sm text-center text-gray-500">
            Please, copy this token and use it in your requests to the API.
            <br />
            Do not share this token with anyone.
          </p>
        </div>
      </div>
    </div>
  );
}
