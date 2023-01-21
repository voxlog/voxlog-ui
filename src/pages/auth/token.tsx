import React from 'react';
import api from '../../lib/axios';

export default async function GetApiToken({token}: {token: string}) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      {/* centralize a header with "Api Token" */}
      {/* and a protected field with the token */}
      <div className="flex flex-col items-center justify-center w-1/2 h-1/2">
        <h1 className="text-2xl font-bold">Voxlog API Token</h1>
        <div className="flex items-center justify-center w-full h-1/2">
            <input
            className="w-1/2 border-2 border-gray-300 rounded-md h-1/2"
            type="text"
            value={token !== '' ? token : 'You need to login to get your token'}
            readOnly
          />        
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { data } = await api.get('/users/auth/token', {
    headers: {
      Authorization: `Bearer ${context.req.cookies.token}`,
    },
  });
  return {
    props: {
      token: data.token || '',
    },
  };
}
