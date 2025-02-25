import { handleGetMusicInPlaylistAction } from "@/actions/playlist.action"
import DisplayPlaylistDetail from "@/components/music/details.playlist"

const PlaylistPage = async ({ searchParams }: any) => {
    const { playlistId } = searchParams

    const res = await handleGetMusicInPlaylistAction(playlistId)
    const data = res?.data

    return (
        <div >
            <DisplayPlaylistDetail item={data.result[0]} />
        </div>
    )
}

export default PlaylistPage