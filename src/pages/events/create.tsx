import { useState, useEffect } from 'react';
import Link from 'next/link';
import Map from '../../components/map';
import { useAuth } from '../../hooks/auth';
import api from '../../lib/axios';
import Router, { useRouter } from 'next/router';
type EventCreate = {
  name: string;
  description: string;
  url?: string | undefined;
  imageUrl?: string | undefined;
  lat: number;
  lon: number;
  artistsIds: string[];
  startTime: string;
  endTime: string;
  creatorId: string;
};

type Artist = {
  artistId: string;
  name: string;
  picUrl?: string;
};

type Marker = {
  lat: number;
  lng: number;
};

export default function CreateEvent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Artist[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);

  const [formData, setFormData] = useState<EventCreate>({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    artistsIds: [],
    lat: 0,
    lon: 0,
    url: '',
    imageUrl: '',
    creatorId: user?.userId || '',
  });

  const { name, description, url, imageUrl, startTime, endTime } = formData;

  async function searchArtists() {
    try {
      const params = new URLSearchParams([['name', searchTerm]]);
      const response = await api.get('/artists/search', { params });
      const artists: Artist[] = await response.data.artists;

      setSearchResults(artists);
    } catch (error) {
      console.log(error);
    }
  }

  const [center, setCenter] = useState<Marker>({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    searchArtists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  const router = useRouter();

  async function makeRequest() {
    const artistsIds = selectedArtists.map((artist) => artist.artistId);

    try {
      const response = await api.post('/events', {
        ...formData,
        artistsIds,
        lat: center.lat,
        lon: center.lng,
      });
      const data = await response.data;
      console.log(data);
      const { eventId } = data;
      router.push(`/events/${eventId}`);
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    makeRequest();
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  if (user?.userId === undefined || user?.userId === '') {
    return (
      <div className="container w-10/12 max-w-screen-md mx-auto my-0">
        <h1 className="w-full my-4 text-4xl font-bold">Create Event</h1>
        <p className="mb-4 text-xl">You need to be logged in to create an event</p>
        <Link href="/signin">
          <span className="p-2 text-white bg-purple-500 rounded-lg">Sign in</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container w-10/12 max-w-screen-md mx-auto my-0">
        <h1 className="w-full my-4 text-4xl font-bold">Create Event</h1>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col mb-6 -mx-3">
            <div>
              <label htmlFor="name">Event Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
                className="w-full px-3 py-2 mb-3 leading-tight border rounded shadow appearance-none text-neutral-700 focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                }}
                maxLength={2048}
                className="w-full px-3 py-2 leading-tight border rounded shadow appearance-none text-neutral-700 focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="date">Starting</label>
              <input
                type="date"
                id="date"
                name="date"
                value={startTime}
                onChange={(e) => {
                  setFormData({ ...formData, startTime: e.target.value });
                }}
                className="block w-full px-4 py-3 pr-8 leading-tight border rounded appearance-none text-neutral-700 bg-neutral-100 border-neutral-200 focus:outline-none focus:bg-white focus:border-neutral-500"
              />
            </div>
            <div className="my-4">
              <label htmlFor="time">Finishing</label>
              <input
                type="date"
                id="date"
                name="date"
                value={endTime}
                onChange={(e) => {
                  setFormData({ ...formData, endTime: e.target.value });
                }}
                className="block w-full px-4 py-3 pr-8 leading-tight border rounded appearance-none text-neutral-700 bg-neutral-100 border-neutral-200 focus:outline-none focus:bg-white focus:border-neutral-500"
              />
            </div>
            <div className="clear-both">
              <label htmlFor="artists">Artists</label>
              <input
                type="text"
                name="artists"
                id="artists"
                placeholder="search for artists"
                className="w-full px-3 py-2 leading-tight border rounded shadow appearance-none text-neutral-700 focus:outline-none focus:shadow-outline"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
              {/* dropdown if there are artists results */}
              {searchTerm.length > 0 && (
                <div className="absolute z-[9999] w-full mt-1 bg-white rounded shadow md:w-4/12">
                  {searchResults.length > 0 &&
                    searchResults.map((artist) => (
                      <div
                        key={artist.artistId}
                        className="flex items-center justify-between p-2 border-b cursor-pointer"
                        onClick={() => {
                          // don't allow duplicates
                          setSelectedArtists((old) => {
                            if (old.some((a) => a.artistId === artist.artistId)) {
                              return old;
                            }
                            return [...old, artist];
                          });
                          setSearchResults([]);
                        }}>
                        <span>{artist.name}</span>
                        <button type="button" className="font-bold">
                          <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            {/* plus sign */}
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
            {selectedArtists.length > 0 && (
              <div className="mt-4">
                <label htmlFor="artists">Selected Artists</label>
                <ul className="flex flex-wrap">
                  {selectedArtists.map((artist) => (
                    <li key={artist.artistId} className="flex items-center justify-between w-full p-2 border-b">
                      <span>{artist.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedArtists(selectedArtists.filter((a) => a.artistId !== artist.artistId));
                        }}>
                        {/* make an X */}
                        <svg
                          className="w-6 h-6 text-red-500 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20">
                          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4">
              <label htmlFor="location">Location</label>
              {/* add marker to map */}
              <Map center={center} zoom={5} className="w-full h-64" setCenter={setCenter} />
            </div>
            <div className="mt-4">
              <label htmlFor="url">More Info URL</label>
              <input
                type="text"
                id="url"
                name="url"
                value={url}
                onChange={(e) => {
                  setFormData({ ...formData, url: e.target.value });
                }}
                className="w-full px-3 py-2 mb-3 leading-tight border rounded shadow appearance-none text-neutral-700 focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={imageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, imageUrl: e.target.value });
                }}
                className="w-full px-3 py-2 mb-3 leading-tight border rounded shadow appearance-none text-neutral-700 focus:outline-none focus:shadow-outline"
              />
            </div>

            <button className="px-4 py-2 mx-auto my-5 text-white bg-purple-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline">
              Create event
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
