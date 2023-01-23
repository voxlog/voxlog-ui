import { NextPageContext } from 'next';
import api from '../../lib/axios';

export default function Event({ event }: { event: Event }) {
  return (
    <div className="container">
      <h1>Event</h1>
    </div>
  );
}

type Event = {
  eventId: string;
  name: string;
  description: string;
  url: string | null;
  imageUrl: string | null;
  lat: number;
  lon: number;
  startTime: string;
  endTime: string;
  local: string;
  createdAt: string;
};

export async function getServerSideProps(context: NextPageContext) {
  const { eventId } = context.query;
  const response = await api.get(`/events/${eventId}`);
  const { data } = response;

  return {
    props: {
      event: data.event,
    },
  };
}
