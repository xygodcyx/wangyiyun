import { request } from './request';

export function checkMusicUsable(id: number, br: number = 999000) {
  return request.get('/check/music', {
    params: {
      id,
      br
    }
  });
}
