import React from 'react';
import api from '../../lib/axios';
import { NextPageContext } from 'next';
import { Album } from '../../utils/dtos/Resources';
import Image from 'next/image';

export default function AlbumPage({ album }: { album: Album }) {
  return (
    <div className="w-full h-screen">
      <div className="items-center w-full mx-auto mt-8">
        <div className="">
          {album.coverArtUrl && (
            <Image
              src={album.coverArtUrl}
              alt={album.title}
              width={200}
              height={200}
              className="mx-auto rounded-md shadow-xl dark:shadow-none"
            />
          )}
          <div>
            <h1 className="mt-4 text-5xl font-extrabold text-center">{album.title}</h1>
            <h1 className="text-2xl font-semibold tracking-tight text-center">{album.fromArtist.name}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  try {
    const { trackId } = context.query;
    const { data } = await api.get(`/albums/${trackId}`);
    const album = JSON.parse(data);
    if (!album) throw new Error('Album not found');
    return {
      props: {
        album,
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
