import { request } from '../request';

export function searchSuggest(keywords: string, type: string = 'mobile') {
  return request.get('/search/suggest', {
    params: {
      keywords,
      type
    }
  });
}
