import { request } from '../request';

export function searchDefaultKeyWord(unique: boolean = false) {
  return request.get('/search/default', {
    params: {
      time: unique ? Date.now() : 1
    }
  });
}
