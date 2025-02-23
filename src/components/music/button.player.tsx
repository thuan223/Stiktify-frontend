"use client"

import { useGlobalContext } from "@/library/global.context"
import { useEffect } from "react"
import { FaPause, FaPlay } from "react-icons/fa"

interface IProps {
    togglePlay: (v: any) => void
    isPlaying: boolean
    className?: string,
    current?: string
}
const ButtonPlayer = (props: IProps) => {
    const { trackCurrent } = useGlobalContext()!
    const { togglePlay, isPlaying, className, current } = props

    return (
        <button
            onClick={togglePlay}
            className={`w-12 h-12 flex items-center justify-center bg-green-500 hover:bg-green-400 transition rounded-full shadow-md ${className}`}>
            {isPlaying && (trackCurrent?._id === current) ? <FaPause size={24} /> : <FaPlay className="ms-1" size={24} />}
        </button>
    )
}

export default ButtonPlayer