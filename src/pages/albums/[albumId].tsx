import React from 'react';
import api from '../../lib/axios';
import { NextPageContext } from 'next';
import { Album } from '../../utils/dtos/Resources';
import { getSpotifyAlbumTracks } from '../../lib/spotifyApi';

export default function AlbumPage({ album, listeningStats, spotifyTracklist }: { album: Album, listeningStats: any, spotifyTracklist: SpotifyApi.AlbumTracksResponse | null }) {
  return (
    <div className="w-full h-screen">
      <div className="items-center w-full mx-auto mt-8">
        <div className="text-center w-4/5 my-0 mx-auto max-w-[1100px]">
          {/* begin main screen*/}
          {album.coverArtUrl ? <img src={album.coverArtUrl} alt={album.title} className='h-[200px] rounded-lg' style={{'display':'inline-block'}} /> : ''}
          <div className='flex justify-center'>
            <h1 className="mt-4 text-5xl font-extrabold text-center max-w-lg">{album.title}</h1>
          </div>
          <div className='flex justify-center'>
            <a href={`/artists/${album.artistId}`} className="hover-link">
              <h2 className="mt-1 text-2xl font-light mb-2">{album.artistName}</h2>
            </a>
          </div>
          {/* Display album stats */}
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
              spotifyTracklist ? (
                <div className="flex flex-col items-center">
                  <h1 className="text-2xl font-bold">Track listing</h1>
                  <span className='mb-5'>(Spotify)</span>
                  <div className='max-w-[400px]'>
                    {
                      spotifyTracklist.items.map((track: any, index: number) => {
                        return (
                          <div key={index} className="flex flex-row items-center mb-3">
                            <h1 className="text-lg mr-5 w-4">{index + 1}</h1>
                            <div className='flex flex-wrap'>
                            <a href={track.external_urls.spotify} className="hover-link grow" target="_blank">
                              <h1 className="text-xl max-w-[300px] font-semibold">{track.name}</h1>
                            </a>
                            <div className="text-lg max-w-[300px] w-full grow">
                            {
                                track.artists.map((artist: any, index: number) => {
                                  return (
                                    <span>
                                      <a href={artist.external_urls.spotify} target="_blank" className='hover-link'>
                                        {artist.name}
                                      </a>
                                      {index == track.artists.length - 1 ? '' : ', '}
                                    </span>
                                  )
                                })
                            }
                            </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              ) : ''
            }
          </div>
          {/* end main screen */}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  try {
    const { albumId } = context.query;
    const { data } = await api.get(`/albums/${albumId}`);
    const {album} = data;
    if (!album) throw new Error('Album not found');

    const {data: listeningStats} = await api.get(`/albums/${albumId}/listening-stats`);

    let spotifyTracklist: SpotifyApi.AlbumTracksResponse | null = null;
    if(album.spId) {
      spotifyTracklist = await getSpotifyAlbumTracks(album.spId);
    }

    return {
      props: {
        album,
        listeningStats,
        spotifyTracklist: spotifyTracklist ? spotifyTracklist : null
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
