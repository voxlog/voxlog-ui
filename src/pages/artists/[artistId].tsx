import React from 'react';
import api from '../../lib/axios';
import { getSpotifyArtistTopTracks } from '../../lib/spotifyApi';
import { NextPageContext } from 'next';
import { Artist } from '../../utils/dtos/Resources';
import Image from 'next/image';
import UserImage from '../../components/userImage/index';

export default function ArtistPage(
  {artist, listeningStats,spotifyTopTracks} : 
  {
    artist: Artist, 
    listeningStats: any,
    spotifyTopTracks: SpotifyApi.ArtistsTopTracksResponse | null
  }
  ) {
  return (
    <div className="w-full h-screen">
      <div className="items-center w-full mx-auto mt-8">
        <div className="text-center w-4/5 my-0 mx-auto max-w-[1100px]">
          <img src={artist.picUrl} alt={artist.name} className='h-[200px] rounded-lg' style={{'display':'inline-block'}} />
          <div>
            <h1 className="mt-4 text-5xl font-extrabold text-center">{artist.name}</h1>
          </div>
          {/* Display artist stats */}
          <div className="flex flex-row justify-center mt-4">
          <div className="flex flex-col items-center mr-10">
              <h1 className="text-2xl font-bold">{listeningStats.uniqueListeners}</h1>
              <h1 className="text-lg">Unique listeners</h1>
          </div> 
          <div className="flex flex-col items-center mr-10">
              <h1 className="text-2xl font-bold">{listeningStats.totalScrobbles}</h1>
              <h1 className="text-lg">Total scrobbles</h1>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold">{Math.round(listeningStats.totalHoursListened * 100) / 100}</h1>
              <h1 className="text-lg">Total hours listened</h1>
            </div>
          </div>
          {/* voxlog top tracks and Spotify's top tracks */}
          <div className="flex flex-row justify-between mt-10 text-left">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold">Top tracks</h1>
              <span className='mb-5'>(voxlog)</span>
              <div>
                {
                  listeningStats.topTracks.map((track: any, index: number) => {
                    return (
                      <div key={index} className="flex flex-row items-center mb-3">
                        <h1 className="text-lg w-[30px] ml-5">{index + 1}</h1>
                        <img src={track.albumCoverArtUrl} alt={track.trackTitle} width={50} height={50} />
                        <a href={`/tracks/${track.trackId}`} className="text-lg ml-2 hover-link">
                          <h1 className="text-lg ml-2 max-w-[300px]">{track.trackTitle}</h1>
                        </a>
                        <h1 className="text-lg ml-2 w-[100px]">({Math.round(track.totalHoursListened * 100) / 100}h)</h1>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            {
              spotifyTopTracks ? (
                <div className="flex flex-col items-center">
                  <h1 className="text-2xl font-bold">Top tracks</h1>
                  <span className='mb-5'>(Spotify)</span>
                  <div>
                    {
                      spotifyTopTracks.tracks.map((track: any, index: number) => {
                        return (
                          <div key={index} className="flex flex-row items-center mb-3">
                            <h1 className="text-lg w-[30px] ml-5">{index + 1}</h1>
                            <img src={track.album.images[0].url} alt={track.name} width={50} height={50} />
                            <a href={track.external_urls.spotify} className="text-lg ml-2 hover-link" target="_blank">
                              <h1 className="text-lg ml-2 max-w-[300px]">{track.name}</h1>
                            </a>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              ) : ''
            }
          </div>
          {/* voxlog top listeners */}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  try {
    const { artistId } = context.query;
    const { data: voxArtistData }: { data: any } = await api.get(`/artists/${artistId}`);
    const { data: listeningStats } = await api.get(`/artists/${artistId}/listening-stats`);
    const { artist: artistData } : {artist: Artist} = voxArtistData;

    let spotifyTopTracks: SpotifyApi.ArtistsTopTracksResponse | null = null;
    if(artistData.spId) {
      spotifyTopTracks = await getSpotifyArtistTopTracks(artistData.spId);
    }

    if (!artistData) throw new Error('Artist not found');
    return {
      props: {
        artist: artistData,
        listeningStats: listeningStats,
        spotifyTopTracks: spotifyTopTracks ? spotifyTopTracks : null,
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
