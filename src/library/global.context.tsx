'use client'

import { createContext, useContext, useEffect, useState } from "react";
interface IGlobalContext {
    isPlaying: boolean,
    setIsPlaying: (v: boolean) => void,
    trackCurrent: IMusic | null,
    setTrackCurrent: (v: any) => void,
    playlist: IPlaylist[],
    setPlaylist: (v: IPlaylist[]) => void
    refreshPlaylist: boolean,
    setRefreshPlaylist: (v: boolean) => void,
    listPlaylist: IMusicInPlaylist[] | [],
    setListPlayList: (v: any) => void
    flag: boolean,
    setFlag: (v: boolean) => void,
    trackRelatedId: string[],
    setTrackRelatedId: (v: string[]) => void,
    prevList: IMusic[],
    setPrevList: (v: IMusic[]) => void
    musicTagRelated: {
        _id: string,
        fullname: string
    }[],
    setMusicTagRelated: (v: {
        _id: string,
        fullname: string
    }[]) => void,
}

export const GlobalContext = createContext<IGlobalContext | null>(null);

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [trackCurrent, setTrackCurrent] = useState<IMusic | null>(null);
    const [playlist, setPlaylist] = useState<IPlaylist[] | []>([])
    const [refreshPlaylist, setRefreshPlaylist] = useState(false);
    const [listPlaylist, setListPlayList] = useState<IMusicInPlaylist[] | []>([])
    const [flag, setFlag] = useState(false);
    const [trackRelatedId, setTrackRelatedId] = useState<string[] | []>([])
    const [prevList, setPrevList] = useState<IMusic[]>([])
    const [musicTagRelated, setMusicTagRelated] = useState<{
        _id: string,
        fullname: string
    }[] | []>([])


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
            listPlaylist, setListPlayList,
            flag, setFlag,
            trackRelatedId, setTrackRelatedId,
            prevList, setPrevList,
            musicTagRelated, setMusicTagRelated
        }}>
            {children}
        </GlobalContext.Provider>
    )
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalContextProvider");
    }
    return context;
};
