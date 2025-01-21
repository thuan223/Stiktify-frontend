interface IShortVideo {
    _id: string,
    videoUrl: string,
    totalFavorite: number,
    totalReaction: number,
    totalViews: number,
    userId: {
        _id: string,
        userName: string
    },
    musicId: string,
    videoDescription: string,
    isBlock: boolean,
    videoThumbnail: string,
    videoTag: any[]
}