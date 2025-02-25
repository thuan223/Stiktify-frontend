'use client'

import { createContext, useContext, useEffect, useState } from "react";
interface IGlobalContext {
    isPlaying: boolean;
    setIsPlaying: (v: boolean) => void;
    trackCurrent: IMusic | null,
    setTrackCurrent: (v: any) => void,
    playlist: IPlaylist[],
    setPlaylist: (v: IPlaylist[]) => void
    refreshPlaylist: boolean,
    setRefreshPlaylist: (v: boolean) => void,
    listPlaylist: IMusicInPlaylist[] | [],
    setListPlayList: (v: any) => void
}

export const GlobalContext = createContext<IGlobalContext | null>(null);

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackCurrent, setTrackCurrent] = useState<IMusic | null>(null);
    const [playlist, setPlaylist] = useState<IPlaylist[] | []>([])
    const [refreshPlaylist, setRefreshPlaylist] = useState(false);
    const [listPlaylist, setListPlayList] = useState<IMusicInPlaylist[] | []>([])

    useEffect(() => {
        if (typeof window !== "undefined") {
            const track = localStorage.getItem("trackCurrent");
            if (track) {
                setTrackCurrent(JSON.parse(track));
            }
        }
    }, []);
    return (
        <GlobalContext.Provider value={{
            isPlaying, setIsPlaying,
            trackCurrent, setTrackCurrent,
            playlist, setPlaylist,
            refreshPlaylist, setRefreshPlaylist,
            listPlaylist, setListPlayList
        }}>
            {children}
        </GlobalContext.Provider>
    )
};

export const useGlobalContext = () => useContext(GlobalContext);