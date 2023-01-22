import React, { useEffect, useState, useTransition } from 'react';
import { DateTime } from 'luxon';
import api from '../../lib/axios';
import { TrackOut } from './types';

export default function TracksPage() {
  //  Use ajax to get the tracks from the backend
  // search while typing

  const [tracks, setTracks] = useState<TrackOut[]>([]);
  const [search, setSearch] = useState('');
  const [lastSearch, setLastSearch] = useState<DateTime>();
  const [isPending, startTransition] = useTransition();

  const fetchTracks = async () => {
    try {
      if (search.length === 0) return;
      const params = new URLSearchParams([['name', search]]);
      const url = '/tracks/search/';
      const response = await api.get(url, { params });
      const tracksReturned = response.data as TrackOut[];

      setTracks(tracksReturned);
    } catch (error) {
      console.log(error);
    }
  };

  const onSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    //  If the user is typing fast, we don't want to make a request for every keypress
    //  So we wait 500ms after the last keypress to make the request
    if (lastSearch && DateTime.now().diff(lastSearch).as('milliseconds') < 500) return;

    setLastSearch(DateTime.now());
    startTransition(() => {
      fetchTracks();
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-center bg-cover bg-opacity-30 bg-guitar-bg">
      <div className="absolute w-full h-full bg-black opacity-70 " />
      <div className="z-10 w-full max-w-sm mx-auto rounded-xl ">
        <div className="px-10 py-4 bg-white rounded-xl dark:bg-neutral-900">
          <h1 className="mb-5 text-lg font-bold text-center text-black dark:text-white">Search for tracks</h1>
          <input
            type="search"
            value={search}
            onChange={onSearchChange}
            placeholder="Search for a track"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 focus:border-blue-500 focus:outline-none focus:shadow-outline-blue"
          />
          <div className="flex flex-col">
            {isPending ? (
              <div className="flex items-center justify-center w-full h-20 text-gray-500">Loading...</div>
            ) : (
              tracks.map((track) => <div key={track}>{track}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
