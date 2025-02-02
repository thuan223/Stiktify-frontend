interface VideoHistoryProps {
  videoId: IVideo;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IVideo {
  _id: string;
  videoUrl: string;
  totalReaction: number;
  totalViews: number;
  userId: IUser;
  musicId: string;
  videoDescription: string;
  isBlock: boolean;
  videoThumbnail: string;
  videoTag: string[];
  totalComment: number;
  videoType: string;
  createAt: Date;
  isDelete: boolean;
  flag: string[];
}
interface IUser {
  _id: string;
  userName: string;
  fullname: string;
  email: string;
  isBan: boolean;
  status: string;
  role: string;
  accountType: string;
}
