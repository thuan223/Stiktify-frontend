import Image from "next/image"
import noImagePlaylist from "@/assets/images/playlist-no-image.jpg"

interface IProps {
    item: IMusic
    onClick: (v: string) => void
}

const TagMusic = (props: IProps) => {
    const { item, onClick } = props
    return (
        <div onClick={() => onClick(item._id)} className="flex items-center gap-2">
            <Image height={50} width={50} className="rounded-md" alt="thumbnail" src={!item.musicThumbnail || item.musicThumbnail === "" ? noImagePlaylist : item.musicThumbnail} />
            <div className="w-full overflow-hidden whitespace-nowrap  text-white py-2">
                <div className="font-roboto text-white font-bold text-1xl inline-block animate-marquee">{item.musicDescription}</div>
                {/* <div className="font-roboto text-gray-400 text-[10px]  max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{item.musicDescription}</div> */}
            </div>
        </div>
    )
}

export default TagMusic