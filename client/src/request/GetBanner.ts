import { request } from './request';

export function getBanner(type: number = 1) {
  return request.get('/banner', {
    params: {
      type
    }
  });
}
