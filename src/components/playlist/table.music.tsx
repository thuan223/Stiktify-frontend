"use client"
import { formatTime, timeAgo } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";

interface IProps {
    playlist: IMusicInPlaylist[] | []
}

const TableListMusicInPlaylist = (props: IProps) => {
    const { playlist } = props

    const getDuration = (url: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const audio = new Audio(url);
            audio.addEventListener("loadedmetadata", () => {
                resolve(formatTime(Math.floor(audio.duration)));
            });
            audio.addEventListener("error", () => {
                reject("Error loading audio");
            });
        });
    };

    const [durations, setDurations] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        playlist.forEach((item) => {
            getDuration(item.musicId.musicUrl!).then((duration) => {
                setDurations((prev: any) => ({ ...prev, [item.musicId.musicUrl!]: duration }));
            });
        });
    }, [playlist]);

    return (
        <div>
            <table className="w-full">
                <thead className="border-b border-gray-200">
                    <tr>
                        <th className="w-1/15 text-left px-4 py-2">#</th>
                        <th className="w-5/15 text-left px-4 py-2">Title</th>
                        <th className="w-3/15 text-left px-4 py-2">Album</th>
                        <th className="w-3/15 text-left px-4 py-2">Date added</th>
                        <th className="w-2/15 text-left px-4 py-2"><FaRegClock className="font-bold" size={20} /></th>
                    </tr>
                </thead>
                <tbody>
                    {playlist && playlist.length > 0 && playlist.map((item, index) => (
                        <tr key={index} >
                            <td className="w-1/15 px-4 py-2 font-medium">{index + 1}</td>
                            <td className="w-5/15 px-4 py-2 flex items-center gap-2">
                                <Image
                                    className="rounded-lg"
                                    src={item.musicId.musicThumbnail}
                                    alt="thumbnail"
                                    width={50}
                                    height={50}
                                />
                                <span className="text-1xl font-semibold">
                                    {item.musicId.musicDescription}
                                </span>
                            </td>
                            <td className="w-3/15 px-4 py-2 font-medium">{item.musicId.musicDescription}</td>
                            <td className="w-3/15 px-4 py-2 font-medium">{timeAgo(item.createdAt)}</td>
                            <td className="w-2/15 px-4 py-2 font-medium">{durations[item.musicId.musicUrl!]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
    )
}

export default TableListMusicInPlaylist