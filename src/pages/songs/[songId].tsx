import React from 'react';
import api from '../../lib/axios';
import { NextPageContext } from 'next';
import { Track } from '../../utils/dtos/Resources';
import Image from 'next/image';

export default function TrackPage({ track }: { track: Track }) {
  return (
    <div className="w-full h-screen">
      <div className="items-center w-full mx-auto mt-8">
        <div className="">
          {track.coverArtUrl && (
            <Image
              src={track.coverArtUrl}
              alt={track.title}
              width={200}
              height={200}
              className="mx-auto rounded-md shadow-xl dark:shadow-none"
            />
          )}
          <div>
            <h1 className="mt-4 text-5xl font-extrabold text-center">{track.title}</h1>
            <h1 className="text-2xl font-semibold tracking-tight text-center">{track.artist.name}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  try {
    const { trackId } = context.query;
    const { data: track }: { data: Track } = await api.get(`/tracks/${trackId}`);

    if (!track) throw new Error('User not found');
    return {
      props: {
        track,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }
}
