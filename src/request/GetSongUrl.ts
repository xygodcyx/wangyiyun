import { request } from './request';

export function getSongUrl(id: number, br: number = 999000) {
  return request.get('/song/url', {
    params: {
      id,
      br
    }
  });
}
