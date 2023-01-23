import axios from 'axios';

export async function getTrackLyrics(isrc: string): Promise<string| null> {
  try {
    return axios.get(`http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=${process.env.MUSIXMATCH_API_KEY}&track_isrc=${isrc}`)
    .then(function (response) {
      const lyrics = response.data.message.body.lyrics;
      const returnLyrics = lyrics.lyrics_body.split('*******')[0];
      return returnLyrics;
    })
    .catch(function (error) {
      console.log(error);
      throw error;
    });
  } catch (error: unknown) {
    throw error;
  }
}