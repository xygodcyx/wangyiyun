import { request } from '../request';

export function searchCloud(keywords: string) {
  return request.get('/cloudsearch', {
    params: {
      keywords
    }
  });
}
