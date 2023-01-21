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
  birthdate: string;
  bio?: string;
  realName?: string;
  profilePictureUrl?: string;
  defaultTopArtistsRange: string;
  defaultTopAlbumsRange: string;
  defaultTopTracksRange: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserRecentTracksDTO = {
  scrobbleCreatedAt: Date;
  track: {
    trackId: string;
    trackTitle: string;
    coverArtUrl: string;
  };
  album: {
    coverArtUrl: string;
  };
  artist: {
    artistId: string;
    name: string;
  };
};
