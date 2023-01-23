import { NextPageContext } from 'next';
import api from '../../lib/axios';
import Link from 'next/link';
import { DateTime } from 'luxon';

type EventsProps = {
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

export default function Events({ events }: { events: EventsProps[] }) {
  return (
    <>
      <div className="w-full">
        <div className="container flex items-center justify-between max-w-4xl px-4 py-2 mx-auto -mb-3">
          <h1 className="text-5xl font-bold">Events</h1>
          <Link href="/events/create">
            <span className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Create Event</span>
          </Link>
        </div>
      </div>
      {/* horizontal line */}
      <div className="w-full">
        <div className="container max-w-4xl p-4 mx-auto">
          <div className="w-full h-px bg-gray-300"></div>
        </div>
      </div>
      {/* upcoming events */}
      <div className="w-full">
        <div className="container max-w-4xl p-4 mx-auto">
          <h2 className="mb-4 text-3xl font-bold">Upcoming Events</h2>
          <div className="flex flex-wrap -mx-4">
            {events.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id} className="w-full px-4 my-1 md:w-1/2 lg:w-1/2">
                <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50">
                  <div className="w-8/12">
                    <h3 className="text-xl font-bold">{event.name}</h3>
                    <p className="text-sm text-gray-500">
                      {event.artists.join(', ')}
                      {event.artists.length > 0 && ' - '}
                      {DateTime.fromISO(event.startDate).toFormat('dd/MM/yyyy')}
                    </p>
                    <p className="text-sm text-gray-500">{event.local}</p>
                    <p className="text-sm text-gray-500">{event.peopleCount} people</p>
                  </div>
                  {event.imageUrl && (
                    <div className="">
                      <img src={event.imageUrl} alt={event.name} width={100} height={100} className="rounded-full" />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  let events: EventsProps[] = [];
  try {
    const response = await api.get('/events');
    events = response.data;
  } catch (error) {
    console.log(error);
  }

  async function getLocal(event: EventsProps): Promise<EventsProps> {
    const { lat, lon } = event;
    const response = await api.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
    const { data } = response;
    const { address, display_name, name } = data;
    if (address) {
      event.local = address.man_made;
    } else if (display_name) {
      event.local = display_name;
    } else if (name) {
      event.local = name;
    }

    return event;
  }

  events = await Promise.all(events.map(getLocal));
  events = events.filter((event) => event.local);

  events = events.filter((event) => {
    const startDate = DateTime.fromISO(event.startDate);
    const now = DateTime.now();
    return startDate > now;
  });

  return {
    props: {
      events,
    },
  };
}
