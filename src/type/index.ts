export type TRecommendedSongType = {
  id: number;
  alg: string;
  canDislike: boolean;
  copywriter: '';
  highQuality: false;
  name: string;
  picUrl: string;
  playCount: number;
  trackCount: number;
  trackNumberUpdateTime: number;
  type: number;
};
export type TPlayListDynamicType = {
  commentCount: number;
  shareCount: number;
  playCount: number;
  bookedCount: number;
  subscribed: boolean;
  remarkName: string;
  followed: boolean;
  gradeStatus: string;
  remixVideo: any;
};
export type TFormattingUnitReturnType = {
  number: number;
  unit: string;
};

//轨道里的歌单id
export type TTrackIdType = {
  id: number;
  uid: number;
};
//track里的歌曲名字、显示图片，id功能暂时不知道
export type TArType = {
  id: number;
  name: string;
  picUrl: string;
};
export type TTrackType = {
  id: number;
  name: string;
  dt: number;
  publishTime: number;
  fee: 0 | 1;
  ar: Array<TSongAuthorType>;
  al: TArType;
};
export type TSongAuthorType = {
  id: number;
  name: string;
};
export type TPlayListCreatorType = {
  userId: number;
  avatarImgId: number;
  avatarUrl: string;
  backgroundUrl: string;
  nickname: string;
  signature: string;
};
export type TPlayListDetailType = {
  id: number;
  name: string;
  userId: number;
  updateTime: number;
  description: string;
  coverImgUrl: string;
  createTime: number;
  creator: TPlayListCreatorType;
  trackCount: number;
  trackNumberUpdateTime: number;
  trackUpdateTime: number;
  trackIds: Array<TTrackIdType>;
  tracks: Array<TTrackType>;
};
export type TPlayListAllSongs = {
  songs: Array<TTrackIdType>;
};

export type TSongLyric = {
  lrc: {
    lyric: string;
  };
  lyricUser: {
    nickname: string;
    uptime: number;
  };
};
