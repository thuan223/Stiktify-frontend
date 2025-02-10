interface IShortVideo {
    _id: string,
    videoUrl: string,
    totalFavorite: number,
    totalReaction: number,
    totalViews: number,
    userId: IUserID,
    musicId: string,
    videoDescription: string,
    isBlock: boolean,
    videoThumbnail: string,
    videoTag: any[],
    isDelete: boolean,
    flag: boolean,
    createAt: string,
    updatedAt: string
}

interface IUserID {
    _id: string,
    userName: string
}