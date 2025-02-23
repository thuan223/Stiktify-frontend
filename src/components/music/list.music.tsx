"use client"

import Image from "next/image"

interface IProps {
    data: IMusic[]
}

const ListMusic = (props: IProps) => {
    const { data } = props
    const item = data[0]
    return (
        <div className="">
            <Image alt="thumbnail" width={200} height={200} src={item.musicThumbnail} />
            <div className=""></div>
        </div>
    )
}

export default ListMusic