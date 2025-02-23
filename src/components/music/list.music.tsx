"use client"

import { useGlobalContext } from "@/library/global.context"
import CardMusic from "./card.music"

interface IProps {
    data: IMusic[]
}

const ListMusic = (props: IProps) => {
    const { setTrackCurrent, trackCurrent, isPlaying, setIsPlaying } = useGlobalContext()!
    const { data } = props

    const handlePlayer = (track: IMusic) => {
        if (trackCurrent?._id !== track._id) {
            const data = {
                _id: track._id,
                musicDescription: track.musicDescription,
                musicThumbnail: track.musicThumbnail,
                musicUrl: track.musicUrl
            }
            setTrackCurrent(data);
            localStorage.setItem("trackCurrent", JSON.stringify(data));
            return setIsPlaying(isPlaying ? true : !isPlaying)
        }
        return setIsPlaying(!isPlaying)
    }
    return (
        <div className="flex flex-wrap justify-start gap-5 my-3 mx-3">
            {data && data.length > 0 && data.map(item => (
                <CardMusic key={item._id} handlePlayer={handlePlayer} isPlaying={isPlaying} item={item} />
            ))}
        </div>
    )
}

export default ListMusic