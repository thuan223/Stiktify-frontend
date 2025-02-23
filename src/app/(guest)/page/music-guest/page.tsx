import { handleGetAllMusic } from "@/actions/music.action"
import ListMusic from "@/components/music/list.music";

const MusicGuestPage = async ({ searchParams }: any) => {
    const { current, pageSize } = await searchParams
    const result = current ? current : 1;
    const LIMIT = pageSize ? pageSize : 20;

    const res = await handleGetAllMusic(result, LIMIT)
    const data = res?.data
    return (
        <div className="h-[86vh] overflow-y-auto border p-4">
            <ListMusic data={data ? data.result : []} />
        </div>
    )
}

export default MusicGuestPage