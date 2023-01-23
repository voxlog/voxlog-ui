import React, { useState } from 'react';
import Link from 'next/link';
import { useEffect } from 'react';
import api from '../../lib/axios';

import { DateTime, Interval } from 'luxon';
import Avatar from 'react-avatar';
import Image from 'next/image';
import { RecentScrobble, TopAlbums, TopArtists } from './types';
import { UserDTO } from '../../utils/dtos/User';

export default function ProfileStats(userDTO: { user: UserDTO }) {
  const { user: user } = userDTO;
  const { username } = user;

  return (
    <div className="flex flex-wrap items-center justify-center w-full">
      <TopArtists username={username} range={user.artistsRange} />
      <TopAlbums username={username} range={user.albumsRange} />
      <RecentTracks username={username} />
    </div>
  );
}

function TopArtists({ username, range }: { username: string; range: string }) {
  const [artists, setArtists] = useState<TopArtists[]>([]);
  const [filterRange, setFilterRange] = useState<string>(range);
  async function getTopArtists() {
    try {
      const { data } = await api.get(`/users/${username}/top-artists`, {
        params: {
          range: filterRange,
        },
      });
      const { topArtists } = data;
      setArtists(topArtists);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getTopArtists();
    // setArtists([
    //   {
    //     artistId: '1',
    //     artistName: 'Metallica',
    //     artistArtUrl: 'https://i.scdn.co/image/ab6761610000e5eb8101d13bdd630b0889acd2fd',
    //   },
    //   {
    //     artistId: '2',
    //     artistName: 'Hayley Williams',
    //     artistArtUrl: 'https://i.scdn.co/image/ab6761610000e5ebca3aa12c1b46ff911ad53104',
    //   },
    //   {
    //     artistId: '3',
    //     artistName: 'Milton Nascimento',
    //     artistArtUrl: 'https://i.scdn.co/image/ab67706c0000da84bfff8bb61ae0e83a2878df1e',
    //   },
    //   {
    //     artistId: '4',
    //     artistName: 'Novos Baianos',
    //     artistArtUrl: 'https://i.scdn.co/image/ab6761610000e5eb6f2aa6bffd27b505bc2e5b8c',
    //   },
    // ]);
  }, [filterRange]);

  return <ArtistList title="Top Artists" items={artists} filterRange={filterRange} setFilterRange={setFilterRange} />;
}

function TopAlbums({ username, range }: { username: string; range: string }) {
  const [albums, setAlbums] = useState<TopAlbums[]>([]);
  const [filterRange, setFilterRange] = useState<string>(range);
  async function getTopAlbums() {
    try {
      const { data } = await api.get(`/users/${username}/top-albums`, {
        params: {
          range: filterRange,
        },
      });
      const { topAlbums } = data;
      setAlbums(topAlbums);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    // console.log('range', filterRange);
    getTopAlbums();
    // setAlbums([
    //   {
    //     albumId: '1',
    //     albumTitle: 'Master of Puppets',
    //     albumArtUrl: 'https://i.scdn.co/image/ab67616d0000b273668e3aca3167e6e569a9aa20',
    //   },
    //   {
    //     albumId: '2',
    //     albumTitle: 'Petals for Armor',
    //     albumArtUrl: 'https://i.scdn.co/image/ab67616d0000b273896e2483613a566bcb00d324',
    //   },
    //   {
    //     albumId: '3',
    //     albumTitle: 'Clube da Esquina',
    //     albumArtUrl: 'https://i.scdn.co/image/ab67616d0000b273bfbfbf3201ecd4d56ac3c155',
    //   },
    //   {
    //     albumId: '4',
    //     albumTitle: 'Acabou Chorare',
    //     albumArtUrl: 'https://i.scdn.co/image/ab67616d0000b27327968fcceb7e9541fb2c9d76',
    //   },
    // ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRange]);

  return <AlbumsList title="Top Albums" items={albums} filterRange={filterRange} setFilterRange={setFilterRange} />;
}

function ArtistList({
  title,
  items,
  filterRange,
  setFilterRange,
}: {
  title: string;
  items: TopArtists[];
  filterRange: string;
  setFilterRange: (range: string) => void;
}) {
  const rangeOptions = ['Week', 'Month', 'Quarter', 'HalfYear', 'Year', 'AllTime'];
  const rangeOptionsMap: { [key: string]: string } = {
    Week: '7 days',
    Month: '1 month',
    Quarter: '3 months',
    HalfYear: '6 months',
    Year: '1 year',
    AllTime: 'All time',
  };

  useEffect(() => {
    setFilterRange(filterRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRange]);

  const [selectedRange, setSelectedRange] = useState<string>(filterRange);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [artists, setArtists] = useState<TopArtists[]>(items);
  return (
    <section className="flex flex-col justify-between w-full my-1">
      <div className="flex items-center">
        {/* <button className="text-lg text-neutral-500 hover:text-black" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {rangeOptionsMap[selectedRange]} ⭣
        </button> */}
        <h1 className="mr-2 text-3xl font-bold text-center md:text-left">{title}</h1>
        {dropdownOpen && (
          // under the button
          <div className="absolute flex flex-col items-center justify-center w-32 mt-2 bg-white border rounded-md shadow-md  border-neutral-200">
            {rangeOptions.map((range) => (
              <button
                key={range}
                className="block px-4 py-2 text-sm text-left text-neutral-500 hover:text-black"
                onClick={() => {
                  setSelectedRange(range);
                  setDropdownOpen(false);
                  setFilterRange(range);
                }}>
                {rangeOptionsMap[range]}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex mx-auto md:mx-0">
        {artists.length > 0 ? (
          artists.map((artist) => {
            const { artistId, artistName, artistArtUrl } = artist;
            return <Card key={title} title={artistName} image={artistArtUrl} link={`/artists/${artistId}`} />;
          })
        ) : (
          <h1 className="text-xl font-light text-center md:text-left">No artists scrobbled yet</h1>
        )}
      </div>
    </section>
  );
}

function AlbumsList({
  title,
  items,
  filterRange,
  setFilterRange,
}: {
  title: string;
  items: TopAlbums[];
  filterRange: string;
  setFilterRange: (range: string) => void;
}) {
  const rangeOptions = ['Week', 'Month', 'Quarter', 'HalfYear', 'Year', 'AllTime'];
  const rangeOptionsMap: { [key: string]: string } = {
    Week: '7 days',
    Month: '1 month',
    Quarter: '3 months',
    HalfYear: '6 months',
    Year: '1 year',
    AllTime: 'All time',
  };

  useEffect(() => {
    setFilterRange(filterRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRange]);

  const [selectedRange, setSelectedRange] = useState<string>(filterRange);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [albums, setAlbums] = useState<TopAlbums[]>(items);
  return (
    <section className="flex flex-col justify-between w-full my-1">
      <div className="flex items-center">
        {/* <button className="text-lg text-neutral-500 hover:text-black" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {rangeOptionsMap[selectedRange]} ⭣
        </button> */}
        <h1 className="mr-2 text-3xl font-bold text-center md:text-left">{title}</h1>
        {dropdownOpen && (
          <div className="absolute flex flex-col items-center justify-center w-32 mt-2 bg-white border rounded-md shadow-md -10 i border-neutral-200">
            {rangeOptions.map((range) => (
              <button
                key={range}
                className="block px-4 py-2 text-sm text-left text-neutral-500 hover:text-black"
                onClick={() => {
                  setSelectedRange(range);
                  setDropdownOpen(false);
                  setFilterRange(range);
                }}>
                {rangeOptionsMap[range]}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex mx-auto md:mx-0">
        {albums.length > 0 ? (
          albums.map((album) => {
            const { albumId, albumTitle, albumArtUrl } = album;
            return <Card key={title} title={albumTitle} image={albumArtUrl} link={`/albums/${albumId}`} />;
          })
        ) : (
          <h1 className="text-xl font-light text-center md:text-left">No album scrobbled yet</h1>
        )}
      </div>
    </section>
  );
}

type CardProps = {
  title: string;
  image: string;
  link: string;
};

const Card = ({ title, image, link }: CardProps) => {
  return (
    <div className="flex items-center justify-center mx-0 md:mx-1">
      <Link href={link}>
        <img
          src={image}
          alt={title}
          className="w-32 transition-all duration-200 ease-in-out rounded-none md:rounded-sm hover:scale-125"
        />
      </Link>
    </div>
  );
};

function RecentTracks({ username }: { username: string }) {
  let counter = 0;
  const [scrobbles, setScrobbles] = useState<RecentScrobble[]>([]);

  const fetchItems = async () => {
    const url = `/users/${username}/recent-scrobbles`;
    const response = await api.get(url);
    const scrobbles = response.data as RecentScrobble[];
    setScrobbles(scrobbles);
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <section className="flex flex-col justify-between w-full">
      <h1 className="mr-2 text-3xl font-bold md:text-left">Recent Tracks</h1>
      <div className="mx-1">
        {scrobbles.map((scrobble) => {
          counter++;
          return <ScrobbleInstance key={counter} scrobble={scrobble}></ScrobbleInstance>;
        })}
      </div>
    </section>
  );
}

function ScrobbleInstance({ scrobble }: { scrobble: RecentScrobble }) {
  function formatDate(date: string) {
    const datetime: DateTime = DateTime.fromISO(date);

    if (datetime.hasSame(DateTime.local(), 'day')) {
      return datetime.toFormat('HH:mm');
      // if same week, show day of week
    } else if (datetime.hasSame(DateTime.local(), 'week')) {
      return datetime.toFormat('ccc');
      // if same year, show month and day
    } else if (datetime.hasSame(DateTime.local(), 'year')) {
      return datetime.toFormat('MMM dd');
      // else show full date
    } else {
      return datetime.toFormat('MMM dd yyyy');
    }
  }

  return (
    <div className="flex items-center w-full p-2 mt-2 md:mt-1">
      <div className="flex items-center justify-between w-full">
        {scrobble.album.coverArtUrl ? (
          <Link href={`/albums/${scrobble.album.albumId}`}>
            <img src={scrobble.album.coverArtUrl} alt={scrobble.track.title} className="w-[60px]" />
          </Link>
        ) : (
          <Avatar name={scrobble.track.title} size="40" className="w-10" />
        )}
        <div className="flex flex-col text-center ">
          <Link href={`/tracks/${scrobble.track.trackId}`}>
            <span className="font-semibold text-md hover-link">{scrobble.track.title}</span>
          </Link>
          <Link href={`/artists/${scrobble.artist.artistId}`}>
            <span className="text-sm font-extralight hover-link">{scrobble.artist.name}</span>
          </Link>
        </div>
        <span className="hidden text-sm font-semibold md:block">{formatDate(scrobble.scrobble.createdAt)}</span>
        <span className="block text-sm font-semibold md:hidden"></span>
      </div>
    </div>
  );
}
