import React from 'react';
import UserImage from '../userImage';
import { UserDTO } from '../../utils/dtos/User';

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

export default function ProfileHeader({ user }: { user?: UserDTO }) {
  if (!user) return <></>;

  const userProfile: UserProfileProps = {
    username: user.username,
    realName: user.realName || undefined,
    profilePictureUrl: user.profilePictureUrl,
    bio: user.bio,
  };

  const userStats: UserStatsProps = {
    hours: 350234,
    artists: 695,
    albums: 1112,
    tracks: 403506,
  };

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
  const intToAbbrev = (num: number, fixed = 1) => {
    const abbrev = ['', 'K', 'M', 'B', 'T'];
    const exp = Math.floor(Math.log(num) / Math.log(1000));
    const result = num / Math.pow(1000, exp);
    if (exp === 0) return `${result.toFixed(0)}${abbrev[exp]}`;
    return `${result.toFixed(fixed)}${abbrev[exp]}`;
  };
  return (
    <section className="justify-center mx-auto mt-5 text-center md:mx-0 md:mt-0">
      <h1 className="text-xl font-bold">{intToAbbrev(hours, 0)} hours listening</h1>
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
