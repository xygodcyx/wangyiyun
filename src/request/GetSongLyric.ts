import { request } from './request';

export function getSongLyric(id: number) {
  return request.get('/lyric', {
    params: {
      id
    }
  });
}
