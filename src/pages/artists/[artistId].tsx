import React from 'react';
import api from '../../lib/axios';
import { getSpotifyArtistTopTracks,getSpotifyArtistRecentAlbums } from '../../lib/spotifyApi';
import { NextPageContext } from 'next';
import { Artist } from '../../utils/dtos/Resources';

export default function ArtistPage(
  {artist, listeningStats,spotifyTopTracks, spotifyRecentAlbums} : 
  {
    artist: Artist, 
    listeningStats: any,
    spotifyTopTracks: SpotifyApi.ArtistsTopTracksResponse | null,
    spotifyRecentAlbums: SpotifyApi.ArtistsAlbumsResponse | null
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
          {/* voxlog top albums */}
          <div className='mt-5'>
            <div className='mb-[5px]'>
              <span className='font-bold text-3xl'>Top albums</span><br></br>
              <span className='text-xl'>(voxlog)</span>
            </div>
            <div className="flex flex-column justify-center mt-5">
              {
                listeningStats.topAlbums.map((album: any, index: number) => {
                  return (
                    <div key={index} className={`bg-neutral-100 rounded-lg p-5 ${index == listeningStats.topAlbums.length - 1 ? '' : 'mr-5'}`}>
                      <img src={album.albumCoverArtUrl} alt={album.albumTitle} style={{'width':'200px'}} />
                      <a href={`/albums/${album.albumId}`} className="text-lg hover-link">
                        <h1 className="text-md mt-2 max-w-[200px]">{album.albumTitle.length < 30 ? album.albumTitle : album.albumTitle.substring(0, 25) + '...'}</h1>
                        </a>
                      <h1 className='text-sm'>{Math.round(album.totalHoursListened * 100) / 100}h</h1>
                    </div>
                  )
                })
              }
            </div>
          </div>
            
          {
          spotifyRecentAlbums ? (
          <div className='mt-10'>
            <div className='mb-[5px]'>
              <span className='font-bold text-3xl'>Recent albums</span><br></br>
              <span className='text-xl'>(Spotify)</span>
            </div>
            <div className="flex flex-column justify-center mt-5">
              {
                  spotifyRecentAlbums.items.map((album: any, index: number) => {
                    return (
                      <div key={index} className={`bg-neutral-100 rounded-lg p-5 ${index == spotifyRecentAlbums.items.length - 1 ? '' : 'mr-5'}`}>
                        <img src={album.images[0].url} alt={album.name} style={{'width':'200px', 'maxWidth':'none'}} />
                        <a href={album.external_urls.spotify} className="text-lg hover-link" target="_blank">
                          <h1 className="text-md mt-2 max-w-[200px]">{album.name.length < 30 ? album.name : album.name.substring(0, 25) + '...'}</h1>
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
      </div>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  try {
    const { artistId } = context.query;
    const { data: voxArtistData }: { data: any } = await api.get(`/artists/${artistId}`);
    const { artist: artistData } : {artist: Artist} = voxArtistData;

    if (!artistData) throw new Error('Artist not found');

    const { data: listeningStats } = await api.get(`/artists/${artistId}/listening-stats`);

    let spotifyTopTracks: SpotifyApi.ArtistsTopTracksResponse | null = null;
    let spotifyRecentAlbums: SpotifyApi.ArtistsAlbumsResponse | null = null;
    if(artistData.spId) {
      spotifyTopTracks = await getSpotifyArtistTopTracks(artistData.spId);
      spotifyRecentAlbums = await getSpotifyArtistRecentAlbums(artistData.spId);
    }

    return {
      props: {
        artist: artistData,
        listeningStats: listeningStats,
        spotifyTopTracks: spotifyTopTracks ? spotifyTopTracks : null,
        spotifyRecentAlbums: spotifyRecentAlbums ? spotifyRecentAlbums : null,
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
