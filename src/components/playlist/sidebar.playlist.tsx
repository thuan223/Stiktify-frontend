"use client"
import { useGlobalContext } from "@/library/global.context";
import Image from "next/image";
import { IoMdAdd } from "react-icons/io";
import noImagePlaylist from "@/assets/images/playlist-no-image.jpg"
import { useState } from "react";
import AddPlayList from "../modal/modal.add.playlist";
import { Tooltip } from "antd";
import { useRouter } from "next/navigation";

const SideBarPlaylist = () => {
    const { playlist } = useGlobalContext()!
    const [isOpenModal, setIsOpenModal] = useState(false)
    const router = useRouter()

    const handleNavigate = (playlistId: string) => {
        router.push(`playlist?playlistId=${playlistId}`)
    }
    return (
        <div className="flex flex-col gap-2 shadow-sm">
            {playlist && playlist.length > 0 && playlist.map((item) => (
                <Tooltip
                    placement="left"
                    overlayInnerStyle={{ background: "white", color: "#1e272e" }}
                    title={item.name} >
                    <div onClick={() => handleNavigate(item._id)} className="cursor-pointer flex items-center justify-center w-14 h-14 bg-white rounded-md">
                        <Image width={100} height={100} className="rounded-md w-full h-full" alt="thumbnail" src={!item.image || item.image === "" ? noImagePlaylist : item.image} />
                    </div>
                </Tooltip>
            ))
            }
            <div onClick={() => setIsOpenModal(true)} className="flex items-center justify-center w-14 h-14 bg-white rounded-md cursor-pointer">
                <IoMdAdd color="gray" size={20} />
            </div>
            <AddPlayList isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
        </div >
    )
}

export default SideBarPlaylist;