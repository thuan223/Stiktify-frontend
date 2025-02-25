interface IPlaylist {
    _id: string,
    userId: string,
    name: string,
    description: string,
    image: string,
    createdAt: string,
    updatedAt: string,
}

interface IMusicInPlaylist {
    _id: string,
    playlist: IPlaylist
    music: IMusic[]
}