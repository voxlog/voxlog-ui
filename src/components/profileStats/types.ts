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

export type TopArtists = {
  artistId: string;
  artistName: string;
  artistArtUrl: string;
};

export type TopAlbums = {
  albumId: string;
  albumTitle: string;
  albumArtUrl: string;
};
