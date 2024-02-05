import { request } from './request';
export function getRecommendedPlaylist(unique: boolean = false) {
  const time = Date.now();
  return request.get(`/personalized?${unique ? `time=${time}` : ''}`, {});
}
