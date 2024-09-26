import { request } from './request';

export function searchSong(keywords: string) {
  return request.get('/search', {
    params: {
      keywords
    }
  });
}
