"use client"

import Image from "next/image"
import ButtonPlayer from "./button.player"
import { useEffect, useState } from "react"
import image from "@/assets/images/gratisography-augmented-reality-800x525.jpg"
import { useRouter } from "next/navigation"
import { useGlobalContext } from "@/library/global.context"
interface IProps {
    handlePlayer: (v: any) => void
    isPlaying: boolean,
    item: IMusic
}

const CardMusic = (props: IProps) => {
    const { handlePlayer, isPlaying, item } = props
    const { trackCurrent } = useGlobalContext()!
    const [hoverPlayer, setHoverPlayer] = useState(false)
    const router = useRouter()
    const handleItem = (track: IMusic) => {
        handlePlayer(track)
    }

    const handleNavigate = (id: string) => {
        router.push(`music/${id}`)
    }

    useEffect(() => {
        if (trackCurrent?._id === item._id) {
            setHoverPlayer(true)
        } else {
            setHoverPlayer(false)
        }
    }, [trackCurrent, item])
    return (
        <div
            onClick={() => handleNavigate(item._id)}
            onMouseLeave={() => {
                trackCurrent?._id !== item._id && setHoverPlayer(false)
            }}
            onMouseEnter={() => setHoverPlayer(true)}
            className="rounded-lg px-1 py-2 shadow-lg hover:bg-slate-100 relative cursor-pointer"
        >
            <Image alt="thumbnail" className="rounded-lg" width={200} height={200} src={item ? item.musicThumbnail : image} />
            <div className="mt-2 text-[20px] font-semibold font-roboto">{item.musicDescription}</div>
            <ButtonPlayer
                current={item._id}
                className={`absolute right-2 bottom-6 transition-all duration-300 transform 
                        ${hoverPlayer ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                isPlaying={isPlaying}
                togglePlay={() => handleItem(item)} />
        </div>
    )
}

export default CardMusic;