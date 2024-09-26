import { request } from './request';

export function getSongUrlNew(id: number, level: string = 'jymaster') {
  return request.get('/song/url/v1', {
    params: {
      id,
      level
    }
  });
}
