export type UserCreateDTO = {
  username: string;
  email: string;
  password: string;
  birthdate: string;
  bio: string;
  realname: string;
};

export type UserDTO = {
  userId: string;
  username: string;
  email: string;
  birthDate: string;
  bio?: string;
  realName?: string;
  profilePictureUrl?: string;
  artistsRange: string;
  albumsRange: string;
  tracksRange: string;
  createdAt: string;
  updatedAt: string;
};

export type RecentScrobble = {
  scrobble: {
    createdAt: string;
  };
  track: {
    trackId: string;
    title: string;
  };
  album: {
    coverArtUrl: string | null;
    albumId: string;
  };
  artist: {
    artistId: string;
    name: string;
  };
};
