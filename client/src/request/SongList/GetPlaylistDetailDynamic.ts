import { request } from '../request';

export const getPlaylistDetailDynamic = function (id: number) {
  return request.get('/playlist/detail/dynamic', {
    params: {
      id: id
    }
  });
};
