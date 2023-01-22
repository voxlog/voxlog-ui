import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function getAccessToken() {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body["access_token"]);
};

export async function getSpotifyArtistTopTracks(artistId: string): Promise<SpotifyApi.ArtistsTopTracksResponse> {
    try {
      const data = await spotifyApi.getArtistTopTracks(artistId, 'BR');
      return data.body;
    } catch (error: unknown) {
      
      const statusCode = (error as any).statusCode;
      if (statusCode === 401) {
        await getAccessToken();
        return getSpotifyArtistTopTracks(artistId);
      }
      throw error;
    }
}

export async function getSpotifyArtistRecentAlbums(artistId: string): Promise<SpotifyApi.ArtistsAlbumsResponse> {
    try {
      const data = await spotifyApi.getArtistAlbums(artistId,  { include_groups : 'album', country : 'BR', limit : 5 });
      return data.body;
    } catch (error: unknown) {
      
      const statusCode = (error as any).statusCode;
      if (statusCode === 401) {
        await getAccessToken();
        return getSpotifyArtistRecentAlbums(artistId);
      }
      throw error;
    }
}

export default { getSpotifyArtistTopTracks, getSpotifyArtistRecentAlbums };