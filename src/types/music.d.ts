interface IMusic {
    _id: string,
    musicUrl: string,
    totalFavorite: number,
    userId: {
        _id: string,
        userName: string,
        fullname: string,
        email: string,
    },
    musicDescription: string,
    isBlock: boolean,
    musicThumbnail: string,
    musicTag: string[],
    totalListener: number,
    totalComment: number,
    totalReactions: number,
    musicLyric: string,
    createdAt: string,
    updatedAt: string,
}