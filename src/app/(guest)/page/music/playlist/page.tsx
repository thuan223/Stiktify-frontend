import { handleGetMusicInPlaylistAction } from "@/actions/playlist.action"
import DisplayPlaylistDetail from "@/components/music/details.playlist"
import TableListMusicInPlaylist from "@/components/playlist/table.music"

const PlaylistPage = async ({ searchParams }: any) => {
    const { playlistId } = searchParams

    const res = await handleGetMusicInPlaylistAction(playlistId)
    const data = res?.data

    return (
        <div >
            <DisplayPlaylistDetail item={data.result} />
            <div className="w-full h-[46vh] overflow-y-auto">
                <TableListMusicInPlaylist playlist={data.result} />
            </div>
        </div>
    )
}

export default PlaylistPage