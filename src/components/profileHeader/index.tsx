import React, { useEffect, useState } from 'react';
import UserImage from '../userImage';
import { UserDTO } from '../../utils/dtos/User';
import api from '../../lib/axios';

type UserProfileProps = {
  username: string;
  realName?: string;
  profilePictureUrl?: string;
  bio?: string;
};

type UserStatsProps = {
  hours: number;
  artists: number;
  albums: number;
  tracks: number;
};

export default function ProfileHeader({ user }: { user: UserDTO }) {
  const [userStats, setUserStats] = useState<UserStatsProps>({
    hours: 0,
    artists: 0,
    albums: 0,
    tracks: 0,
  });

  const userProfile: UserProfileProps = {
    username: user.username,
    realName: user.realName || undefined,
    profilePictureUrl: user.profilePictureUrl,
    bio: user.bio,
  };

  async function fetchUserStats() {
    const { data } = await api.get(`/users/${user.username}/stats`);
    const { totalHours, totalArtists, totalAlbums, totalTracks } = data;

    setUserStats({
      hours: totalHours,
      artists: totalArtists,
      albums: totalAlbums,
      tracks: totalTracks,
    });
  }

  useEffect(() => {
    fetchUserStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const userStats: UserStatsProps = {
  //   hours: 350234,
  //   artists: 695,
  //   albums: 1112,
  //   tracks: 403506,
  // };

  return (
    <div className="w-full px-4 py-6 from-white via-neutral-200 to-white bg-gradient-to-tl dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-800">
      <section className="flex flex-wrap items-center justify-between w-full">
        <ProfileInfo info={userProfile} />
        <ProfileMusicStatus info={userStats} />
      </section>
      {user.bio && <ProfileBio bio={user.bio} />}
    </div>
  );
}

function ProfileInfo({ info }: { info: UserProfileProps }) {
  const { username, realName, profilePictureUrl } = info;
  return (
    <div className="flex justify-center">
      <UserImage url={profilePictureUrl} name={realName || username} sizeInPixels={128} />
      <div className="flex flex-col justify-center px-5">
        <h1 className="text-3xl font-bold">{realName}</h1>
        <h1 className="text-xl">@{username}</h1>
      </div>
    </div>
  );
}

function ProfileMusicStatus({ info }: { info: UserStatsProps }) {
  const { hours, artists, albums, tracks } = info;
  const intToAbbrev = (num: number, fixed: number = 0) => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(fixed) + 'T';
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(fixed) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(fixed) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(fixed) + 'K';
    } else {
      return num.toFixed(fixed).toString();
    }
  };

  return (
    <section className="justify-center mx-auto mt-5 text-center md:mx-0 md:mt-0">
      <h1 className="text-xl font-bold">{intToAbbrev(hours, 2)} hours listened</h1>
      <div className="flex mt-2 justify-evenly">
        <div className="flex flex-col items-center">
          <p className="-m-2 text-lg">{intToAbbrev(artists)}</p>
          <p className="text-sm font-light">artists</p>
        </div>
        <div className="flex flex-col">
          <p className="-m-2 text-lg">{intToAbbrev(albums)}</p>
          <p className="text-sm font-light">albums</p>
        </div>
        <div className="flex flex-col">
          <p className="-m-2 text-lg">{intToAbbrev(tracks)}</p>
          <p className="text-sm font-light">tracks</p>
        </div>
      </div>
    </section>
  );
}

function ProfileBio({ bio }: { bio: string }) {
  return (
    <section className="flex flex-col justify-center w-full mt-5 text-center">
      <h1 className="text-xl font-bold">Bio</h1>
      <p className="mt-2">{bio}</p>
    </section>
  );
}
