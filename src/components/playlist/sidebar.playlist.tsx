"use client"
import { useGlobalContext } from "@/library/global.context";
import Image from "next/image";
import { IoMdAdd } from "react-icons/io";
import noImagePlaylist from "@/assets/images/playlist-no-image.jpg"
import { useContext, useEffect, useState } from "react";
import AddPlayList from "../modal/modal.add.playlist";
import { Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { PiMusicNotesPlusBold } from "react-icons/pi";
import AddMusicModal from "../modal/modal.add.music";
import { handleGetAllCategoryAction } from "@/actions/category.action";
import { AuthContext } from "@/context/AuthContext";

const SideBarPlaylist = () => {
    const { playlist } = useGlobalContext()!
    const { user } = useContext(AuthContext)!
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenModalAddMusic, setIsOpenModalMusic] = useState(false)
    const [listCate, setListCate] = useState([])
    const router = useRouter()

    const handleNavigate = (playlistId: string) => {
        router.push(`music/playlist?playlistId=${playlistId}`)
    }

    useEffect(() => {
        (async () => {
            const res = await handleGetAllCategoryAction()
            if (res?.statusCode === 200) {
                return setListCate(res.data)
            }
            setListCate([])
        })()
    }, [isOpenModalAddMusic])
    return (
        <>
            {user &&
                <>
                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col gap-2 shadow-sm mt-1">
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
                        </div>
                        <Tooltip title={"Add music"} placement="left">
                            <div onClick={() => setIsOpenModalMusic(true)} className="flex items-center justify-center w-14 h-14 bg-slate-700 rounded-md cursor-pointer mb-1">
                                <PiMusicNotesPlusBold color="white" size={20} />
                            </div>
                        </Tooltip>
                    </div >
                    <AddPlayList isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
                    <AddMusicModal listCate={listCate} isCreateModalOpen={isOpenModalAddMusic} setIsCreateModalOpen={setIsOpenModalMusic} />
                </>
            }
        </>
    )
}

export default SideBarPlaylist;