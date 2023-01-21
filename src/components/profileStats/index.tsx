import React, { useState } from 'react';
import Link from 'next/link';
import { useEffect } from 'react';
import api from '../../lib/axios';

import { UserRecentTracksDTO } from '../../utils/dtos/User';
import { DateTime, Interval } from 'luxon';
import Avatar from 'react-avatar';
import Image from 'next/image';

export default function ProfileStats(username: { username: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center w-full">
      <TopArtists />
      <TopAlbums />
      <RecentTracks username={username.username} />
    </div>
  );
}

const TopArtists = () => {
  const artists = [
    ['Metallica', 'https://i.scdn.co/image/ab6761610000e5eb8101d13bdd630b0889acd2fd', '/artists/metallica'],
    ['Hayley Williams', 'https://i.scdn.co/image/ab6761610000e5ebca3aa12c1b46ff911ad53104', '/artists/hayley-williams'],
    [
      'Milton Nascimento',
      'https://i.scdn.co/image/ab67706c0000da84bfff8bb61ae0e83a2878df1e',
      '/artists/milton-nascimento',
    ],
    ['Novos Baianos', 'https://i.scdn.co/image/ab6761610000e5eb6f2aa6bffd27b505bc2e5b8c', '/artists/novos-baianos'],
  ];

  return <ListingView title="Top Artists" items={artists} />;
};
const TopAlbums = () => {
  const albums = [
    [
      'Metallica - Master of Puppets',
      'https://i.scdn.co/image/ab67616d0000b273668e3aca3167e6e569a9aa20',
      '/albums/xyz',
    ],
    [
      'Hayley Williams - Petals for Armor',
      'https://i.scdn.co/image/ab67616d0000b273896e2483613a566bcb00d324',
      '/albums/xyz',
    ],
    [
      'Milton Nascimento - Clube da Esquina',
      'https://i.scdn.co/image/ab67616d0000b273bfbfbf3201ecd4d56ac3c155',
      '/albums/xyz',
    ],
    [
      'Novos Baianos - Acabou Chorare',
      'https://i.scdn.co/image/ab67616d0000b27327968fcceb7e9541fb2c9d76',
      '/albums/xyz',
    ],
  ];

  return <ListingView title="Top Albums" items={albums} />;
};
type ListingViewProps = {
  title: string;
  items: Array<Array<string>>;
};

const ListingView = ({ title, items }: ListingViewProps) => {
  return (
    <section className="flex flex-col justify-between w-full my-1">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-center md:text-left">{title}</h1>
        <Link
          href="#"
          className="text-xs font-semibold text-neutral-500 hover:text-black dark:text-neutral-400 hover:dark:text-white">
          <h6 className="text-sm font-thin">All Time ⭣</h6>
        </Link>
      </div>
      <div className="flex mx-auto md:mx-0">
        {items.map((item) => {
          const [title, image, link] = item;
          return <Card key={title} title={title} image={image} link={link} />;
        })}
      </div>
    </section>
  );
};

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

type RecentTracksListingProps = {
  title: string;
  items: Array<Array<string>>;
};
const RecentTracks = ({ username }: { username: string }) => {
  let counter = 0;
  const [scrobbles, setScrobbles] = useState<UserRecentTracksDTO[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const url = `/users/${username}/recent-tracks`;
      const response = await api.get(url);
      const scrobbles = response.data as UserRecentTracksDTO[];
      setScrobbles(scrobbles);
    };
    fetchItems();
  }, [username]);

  return (
    <section className="flex flex-col justify-between w-full">
      <h1 className="text-3xl font-bold text-center md:text-left">Recent Tracks</h1>
      <div className="mx-1">
        {scrobbles.map((scrobble) => {
          counter++;
          return <ScrobbleInstance key={counter} scrobble={scrobble}></ScrobbleInstance>;
        })}
      </div>
    </section>
  );
};

const ScrobbleInstance = ({ scrobble }: { scrobble: UserRecentTracksDTO }) => {
  function formatDate(date: Date) {
    const datetime: DateTime = DateTime.fromJSDate(date);

    const diff = Interval.fromDateTimes(datetime, DateTime.local()).toDuration([
      'years',
      'months',
      'days',
      'hours',
      'minutes',
    ]);

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
    <div className="flex items-center w-full p-2 mt-2 transition-all duration-200 ease-in-out md:mt-1 hover:scale-105 hover:shadow-md hover:shadow-neutral-200 hover:dark:shadow-black">
      <div className="flex items-center justify-between w-full">
        {scrobble.track.coverArtUrl && scrobble.album.coverArtUrl ? (
          <Image
            src={scrobble.track.coverArtUrl || scrobble.album.coverArtUrl}
            alt=""
            width={40}
            height={40}
            className="w-10 transition-all ease-in-out rounded-sm hover:scale-150 duration-50 "
          />
        ) : (
          <Avatar
            name={scrobble.track.trackTitle}
            size="40"
            className="w-10 transition-all ease-in-out rounded-sm hover:scale-150 duration-50 "
          />
        )}
        <div className="flex flex-col text-center ">
          <Link href={`/tracks/${scrobble.track.trackId}`}>
            <span className="font-semibold text-md">{scrobble.track.trackTitle}</span>
          </Link>
          <Link href={`/artists/${scrobble.artist.artistId}`}>
            <span className="text-sm font-thin">{scrobble.artist.name}</span>
          </Link>
        </div>
        <span className="hidden text-xs font-semibold md:block">{formatDate(scrobble.scrobbleCreatedAt)}</span>
        <span className="block text-xs font-semibold md:hidden"></span>
      </div>
    </div>
  );
};
