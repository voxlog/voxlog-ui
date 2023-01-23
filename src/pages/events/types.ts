export type EventsProps = {
  id: string;
  name: string;
  artists: string[];
  startDate: string;
  local: string;
  lat: number;
  lon: number;
  peopleCount: number;
  imageUrl?: string;
};

export type EventFullOut = {
  eventId: string;
  name: string;
  description: string;
  url: string | null;
  imageUrl: string | null;
  lat: number;
  lon: number;
  local: string | null;
  startTime: string;
  endTime: string;
  creator: {
    username: string;
    name: string;
  };
  artists: {
    artistId: string;
    name: string;
    picUrl: string | null;
  }[];
  pictures: {
    pictureId: string;
    url: string;
    uploader: {
      userId: string;
      name: string;
    };
  }[];
  peopleCount: number;
};
