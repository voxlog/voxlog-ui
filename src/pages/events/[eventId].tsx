import { NextPageContext } from 'next';
import api from '../../lib/axios';
import { EventFullOut, EventsProps } from './types';
import Link from 'next/link';
import { useAuth } from '../../hooks/auth';
import { DateTime } from 'luxon';
import { useState } from 'react';
import Map from '../../components/map';

export default function Event({ event }: { event: EventFullOut }) {
  const { user } = useAuth();

  const [attendButtonDisabled, setAttendButtonDisabled] = useState(false);
  async function handleAttend(e: any) {
    e.preventDefault();
    try {
      const res = await api.post(`/events/${event.eventId}/attend`);
      setAttendButtonDisabled(true);
      console.log(res);
    } catch (error) {}
  }

  function setCenter() {}

  return (
    <>
      <div className="w-full mt-6">
        <div className="container flex items-center justify-between max-w-4xl px-4 py-2 mx-auto -mb-3">
          <h1 className="text-5xl font-bold text-center md:text-left">{event.name}</h1>
        </div>
      </div>
      {/* horizontal line */}
      <div className="w-full">
        <div className="container max-w-4xl p-4 mx-auto">
          <div className="w-full h-px bg-gray-300"></div>
        </div>
      </div>

      {event.imageUrl && (
        <>
          <div className="w-full">
            <div className="container p-4 mx-auto">
              <img src={event.imageUrl} alt={event.name} className="w-full rounded-lg h-[320px] object-cover" />
            </div>
          </div>

          {/* horizontal line */}
          <div className="w-full">
            <div className="container max-w-4xl p-4 mx-auto">
              <div className="w-full h-px bg-gray-300"></div>
            </div>
          </div>
        </>
      )}
      {/* event info */}
      <div className="w-full">
        <div className="container max-w-4xl p-4 mx-auto">
          <h2 className="text-3xl font-bold ">Event Info</h2>
          {event.url && event.url.startsWith('http') && (
            <Link href={event.url} className="w-full px-4 my-1 md:w-1/2 lg:w-1/2">
              <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg bg-primary-500 hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <span>Go to event page</span>
              </button>
            </Link>
          )}
          {user && (
            <Link href={`/events/${event.eventId}/attend`} className="w-full px-4 my-1 md:w-1/2 lg:w-1/2">
              <button
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg bg-primary-500 hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 disabled:opacity-50 disabled:bg-neutral-300"
                onClick={handleAttend}
                disabled={attendButtonDisabled}>
                <span>Attend</span>
              </button>
            </Link>
          )}

          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 my-1 md:w-1/2 lg:w-1/2">
              <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-neutral-500">Description</span>
                  <span className="text-lg font-semibold text-neutral-900">{event.description}</span>
                </div>
              </div>
            </div>
            <div className="w-full px-4 my-1 md:w-1/2 lg:w-1/2">
              <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-neutral-500">Date start</span>
                  <span className="text-lg font-semibold text-neutral-900">
                    {DateTime.fromISO(event.startTime).toFormat('dd/MM/yyyy')}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-neutral-500">Date end</span>
                  <span className="text-lg font-semibold text-neutral-900">
                    {DateTime.fromISO(event.endTime).toFormat('dd/MM/yyyy')}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full px-4 my-1 md:w-1/2 lg:w-1/2">
              <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-neutral-500">Local</span>
                  <span className="text-lg font-semibold text-neutral-900">{event.local}</span>
                </div>
              </div>
            </div>
            <div className="w-full px-4 my-1 md:w-1/2 lg:w-1/2">
              <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-neutral-500">Created by</span>
                  <Link href={`/users/${event.creator.username}`}>
                    <span className="text-lg font-semibold text-neutral-900">{event.creator.name}</span>
                  </Link>
                </div>
              </div>
            </div>
            {event.artists.length > 0 && (
              <div className="w-full px-4 my-1 md:w-1/2 lg:w-1/2">
                <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-500">Artists</span>
                    <span className="text-lg font-semibold text-neutral-900">
                      {event.artists.map((artist) => (
                        <Link href={`/artists/${artist.artistId}`} key={artist.artistId}>
                          <span className="text-lg font-semibold text-neutral-900">{artist.name}</span>
                        </Link>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="w-full px-4 my-1 mb-8 md:w-1/2 lg:w-1/2">
              <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-neutral-500">Going</span>
                  <span className="text-lg font-semibold text-neutral-900">{event.peopleCount}</span>
                </div>
              </div>
            </div>
            <Map center={{ lat: event.lat, lng: event.lon }} zoom={15} setCenter={setCenter} shouldUpdate={false} />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const { eventId } = context.query;

  async function getLocal(event: EventFullOut): Promise<EventFullOut> {
    const { lat, lon } = event;
    const response = await api.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
    const { data } = response;
    const { display_name } = data;
    event.local = 'Unknown';
    if (display_name) event.local = display_name;
    return event;
  }

  try {
    const response = await api.get(`/events/${eventId}`);
    const event = response.data;
    const eventWithLocal = await getLocal(event);
    if (!eventWithLocal.local) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        event: eventWithLocal,
      },
    };
  } catch (error) {
    console.log(error);
  }
}
