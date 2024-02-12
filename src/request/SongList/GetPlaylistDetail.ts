import { request } from '../request';

export const getPlaylistDetail = function (id: number) {
  return request.get('/playlist/detail', {
    params: {
      id: id
    }
  });
};
