import { searchSong } from './SearchSong';
import { getSongUrl } from './GetSongUrl';
import { checkMusicUsable } from './CheckMusicUsable';
import { getBanner } from './GetBanner';
import { getRecommendedPlaylist } from './SongList/GetRecommendedPlaylist';
import { getPlaylistDetailDynamic } from './SongList/GetPlaylistDetailDynamic';
import { getPlaylistDetail } from './SongList/GetPlaylistDetail';
import { getPlaylistAllSongs } from './SongList/GetPlaylistAllSongs';

export default {
  searchSong,
  getSongUrl,
  checkMusicUsable,
  getBanner,
  getRecommendedPlaylist,
  getPlaylistDetailDynamic,
  getPlaylistDetail,
  getPlaylistAllSongs //获取所有歌单，避免一次性获取太多
};
