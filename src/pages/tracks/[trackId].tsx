import React from 'react';
import api from '../../lib/axios';
import { NextPageContext } from 'next';
import { Track } from '../../utils/dtos/Resources';
import Image from 'next/image';
import { getSpotifyTrack } from '../../lib/spotifyApi';

export default function TrackPage({ track, listeningStats, spotifyTrack }: { track: Track, listeningStats: any, spotifyTrack: SpotifyApi.TrackObjectFull | null }) {
  return (
    <div className="w-full h-screen">
      <div className="items-center w-full mx-auto mt-8">
        <div className="text-center w-4/5 my-0 mx-auto max-w-[900px]">
          {/* begin main screen*/}
          <div className='flex justify-center'>
            <h1 className="mt-4 text-5xl font-extrabold text-center max-w-lg">{track.title}</h1>
          </div>
          {
            spotifyTrack ? (
              <div className='flex justify-center text-2xl gap-[8px] mt-2'>
                <span className='font-bold'>by</span>
                {
                  spotifyTrack.artists.map((artist, index) => {
                    return (
                      <span>
                        <a href={artist.external_urls.spotify} target="_blank" className='hover-link'>
                          {artist.name}
                        </a>
                        {index == spotifyTrack.artists.length - 1 ? '' : ', '}
                      </span>
                    )
                  })
                }
              </div>
            ) : ''
          }
          <div className="flex flex-row justify-center mt-2 text-2xl gap-[8px]">
            <span className="font-bold">from</span>
            <a href={`/albums/${track.albumId}`} className="hover-link">
              <h1>{track.fromAlbum.title}</h1>
            </a>
            <span className="font-bold">by</span>
            <a href={`/artists/${track.fromAlbum.artistId}`} className="hover-link">
              <h1>{track.fromAlbum.fromArtist.name}</h1>
            </a>
          </div>
          {/* Display track stats */}
          <div className="flex flex-row justify-center mt-4">
          <div className="flex flex-col items-center mr-10">
              <h1 className="text-2xl font-bold">{listeningStats.uniqueListeners}</h1>
              <h1 className="text-lg">Unique listeners</h1>
          </div> 
          <div className="flex flex-col items-center mr-10">
              <h1 className="text-2xl font-bold">{listeningStats.totalScrobbles}</h1>
              <h1 className="text-lg">Total scrobbles</h1>
            </div>
            <div className="flex flex-col items-center mr-10">
              <h1 className="text-2xl font-bold">{Math.round(track.duration * listeningStats.totalScrobbles / 36) / 100}</h1>
              <h1 className="text-lg">Total hours listened</h1>
            </div>
            <div className="flex flex-col items-center">
              {/*TODO: songs with more than a hour length WILL glitch */}
              <h1 className="text-2xl font-bold">{new Date(track.duration * 1000).toISOString().slice(14, 19)}</h1>
              <h1 className="text-lg">Track length</h1>
            </div>
          </div>

          
          <div className="flex flex-row justify-between mt-10 text-left">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold">Sample</h1>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold">Lyrics</h1>
            </div>
          </div>
          {/* end main screen */}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  try {
    const { trackId } = context.query;
    const { data: track }: { data: Track } = await api.get(`/tracks/${trackId}`);

    if (!track) throw new Error('Track not found');

    console.log(track)

    const {data: listeningStats} = await api.get(`/tracks/${trackId}/listening-stats`);

    let spotifyTrack: SpotifyApi.TrackObjectFull | null = null;
    if(track.spId) {
      spotifyTrack = await getSpotifyTrack(track.spId);
    }

    return {
      props: {
        track,
        listeningStats,
        spotifyTrack,
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
