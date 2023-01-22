import React from 'react';
import api from '../../lib/axios';
import { getSpotifyArtistTopTracks } from '../../lib/spotifyApi';
import { NextPageContext } from 'next';
import { Artist } from '../../utils/dtos/Resources';
import Image from 'next/image';
import UserImage from '../../components/userImage/index';

export default function ArtistPage({artist} : {artist: Artist}) {
  console.log(artist)

  return (
    <div className="w-full h-screen">
      <div className="items-center w-full mx-auto mt-8">
        <div className="text-center">
          <img src={artist.picUrl} alt={artist.name} className='h-[200px] rounded-lg' style={{'display':'inline-block'}} />
          <div>
            <h1 className="mt-4 text-5xl font-extrabold text-center">{artist.name}</h1>
          </div>
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

    if(artistData.spId) {
      //const spotifyTopTracks = await getSpotifyArtistTopTracks(artistData.spId);
      //console.log('spotify shit', spotifyTopTracks)
    }

    // Getting listening stats
    const { data: listeningStats } = await api.get(`/artists/${artistId}/listening-stats`);
    console.log('listening stats', listeningStats)

    if (!artistData) throw new Error('Artist not found');
    return {
      props: {
        artist: artistData,
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
