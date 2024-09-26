import { request } from '../request';

export const getPlaylistAllSongs = function (id: number, limit: number = 20, offset: number = 0) {
  return request.get('/playlist/track/all', {
    params: {
      id: id,
      limit: limit,
      offset: offset
    }
  });
};
