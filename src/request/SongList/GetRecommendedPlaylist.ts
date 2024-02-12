import { request } from '../request';
export function getRecommendedPlaylist(unique: boolean = false, limit: number = 6) {
  const time = Date.now();
  return request.get(`/personalized?${unique ? `time=${time}` : ''}`, {
    params: {
      limit: limit
    }
  });
}
