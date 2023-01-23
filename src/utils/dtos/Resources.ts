export type Artist = {
  artistId: string,
  createdAt: string,
  mbId: string,
  name: string,
  picUrl: string,
  spId: string
};

export type Album = {
  albumId: string,
  title: string,
  artistId: string,
  artistName: string,
  coverArtUrl: string | null,
  spId: string
};

export type Track = {
  trackId: string;
  title: string;
  coverArtUrl: string | null;
  durationInSeconds: number;
  album: {
    albumId: string;
    title: string;
    coverArtUrl: string | null;
  };
  artist: Artist;
};
