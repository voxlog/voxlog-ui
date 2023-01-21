import api from '../../lib/axios';

// Page: www.voxlog.com/tracks/

export function getPopularTracks() {
  // Get today's N most popular tracks.
  const quantity = 10;
  return api.get('/tracks/popular', { params: { quantity } });
}

export function getTrackByName(name: string) {
  // Get a track by its name. As a user, it would be great if it made a full text search.
  return api.get(`/tracks/search?name=${name}`);
}

// Page www.voxlog.com/tracks/:id
export function getTrackById(id: string) {
  // Get a track by its id.
  return api.get(`/tracks/${id}`);
}

// Page www.voxlog.com/albums/
export function getPopularAlbums() {
  // Get today's N most popular albums.
  const quantity = 10;
  return api.get('/albums/popular', { params: { quantity } });
}

export function getAlbumByName(name: string) {
  // Get an album by its name. As a user, it would be great if it made a full text search.
  return api.get(`/albums/search?name=${name}`);
}

// Page www.voxlog.com/albums/:id
export function getAlbumById(id: string) {
  // Get an album by its id.
  return api.get(`/albums/${id}`);
}

// Page www.voxlog.com/artists/
export function getPopularArtists() {
  // Get today's N most popular artists.
  const quantity = 10;
  return api.get('/artists/popular', { params: { quantity } });
}

export function getArtistByName(name: string) {
  // Get an artist by its name. As a user, it would be great if it made a full text search.
  return api.get(`/artists/search?name=${name}`);
}

// Page www.voxlog.com/artists/:id
export function getArtistById(id: string) {
  // Get an artist by its id.
  return api.get(`/artists/${id}`);
}

// Page www.voxlog.com/users/

export function getUserByUsername(username: string) {
  // Get a user by its username.
  return api.get(`/users/search?username=${username}`);
}

// Page www.voxlog.com/signin/
export function signIn(username: string, password: string) {
  // Sign in a user.
  return api.post('/users/signin', { username, password });
}

// Page www.voxlog.com/signup/
export function signUp(
  username: string,
  password: string,
  email: string,
  birthdate: string,
  realname: string,
  bio: string,
) {
  // Sign up a user.
  return api.post('/users/signup', {
    username,
    password,
    email,
    birthdate,
    realname,
    bio,
  });
}

// Page www.voxlog.com/users/:id
// todo!() -> This function is not fully implemented yet. It is not possible to
// update a user's password yet.

export function uploadAvatar(id: string, avatar: File) {
  // Upload a user's avatar.
  const formData = new FormData();
  formData.append('avatar', avatar);
  return api.put(`/users/${id}/avatar`, formData);
}

export function updateUser(
  id: string,
  username: string,
  email: string,
  birthdate: string,
  realname: string,
  bio: string,
) {
  // Update a user's data.
  return api.put(`/users/${id}`, {
    username,
    email,
    birthdate,
    realname,
    bio,
  });
}

export function deleteUser(id: string) {
  // Delete a user.
  return api.delete(`/users/${id}`);
}

export function getUserById(id: string) {
  // Get a user by its id.
  return api.get(`/users/${id}`);
}
