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
  albumId: string;
  duration: number;
  mbId: string | null;
  spId: string | null;
  fromAlbum: {
    albumId: string;
    artistId: string;
    title: string;
    coverArtUrl: string | null;
    mbId: string | null;
    spId: string | null;
    fromArtist: {
      artistId: string;
      name: string;
      picUrl: string | null;
      mbId: string | null;
      spId: string | null;
      createdAt: Date;
    };
  };
}