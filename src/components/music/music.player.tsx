"use client";
import { formatTime } from "@/utils/utils";
import { useState, useRef, useEffect, useContext } from "react";
import ReactHowler from "react-howler";
import {
  FaStepForward,
  FaStepBackward,
  FaVolumeMute,
  FaVolumeUp,
  FaHeartbeat,
} from "react-icons/fa";
import { FaShuffle, FaRepeat } from "react-icons/fa6";
import ButtonPlayer from "./button.player";
import { useGlobalContext } from "@/library/global.context";
import Image from "next/image";
import { handleUpdateListenerAction } from "@/actions/music.action";
import { AuthContext } from "@/context/AuthContext";

const MusicPlayer = () => {
  const {
    isPlaying,
    setIsPlaying,
    trackCurrent,
    listPlaylist,
    setTrackCurrent,
    flag,
    setFlag
  } = useGlobalContext()!;
  const [volume, setVolume] = useState(1);
  const playerRef = useRef<ReactHowler | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [count, setCount] = useState(0);
  const [second, setSecond] = useState(0);
  const [countTrack, setCountTrack] = useState(0);
  const { user, accessToken } = useContext(AuthContext) ?? {};

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  const toggleMute = () => setVolume(volume > 0 ? 0 : 1);
  const nextTrack = () =>
    setCountTrack((prev) => (prev + 1) % listPlaylist.length);
  const prevTrack = () =>
    setCountTrack(
      (prev) => (prev - 1 + listPlaylist.length) % listPlaylist.length
    );

  useEffect(() => {
    (async () => {
      setCount(count + 1);
      if (count === +seek.toFixed(0)) {
        setSecond(second + 1);
        if (second === 15) {
          if (!flag) {
            if (user) {
              await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/listeninghistory/create-listening-history`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({
                    userId: user._id,
                    musicId: trackCurrent?._id,
                  }),
                }
              );
            }
            await handleUpdateListenerAction(trackCurrent?._id!);
            setFlag(true);
          }
          setSecond(0);
        }
      }
      if (+seek.toFixed(0) !== count) {
        setCount(+seek.toFixed(0) + 1);
        setSecond(0);
      }
    })();
  }, [seek]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (playerRef.current) {
          setSeek(playerRef.current.seek());
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const handleLoad = () => {
    if (playerRef.current) {
      setDuration(playerRef.current.duration());
    }
  };

  useEffect(() => {
    if (listPlaylist && listPlaylist.length > 0) {
      localStorage.setItem(
        "trackCurrent",
        JSON.stringify(listPlaylist[countTrack].musicId)
      );
      setTrackCurrent(listPlaylist[countTrack].musicId);
    }
  }, [listPlaylist, countTrack]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSeek = parseFloat(e.target.value);
    setSeek(newSeek);
    playerRef.current?.seek(newSeek);
  };

  const handleEndMusic = () => {
    setSecond(0);
    setFlag(false);
    if (listPlaylist && listPlaylist.length > 0) {
      if (+listPlaylist.length - 1 === countTrack) {
        setCountTrack(0);
        return;
      }
      setCountTrack((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full h-full  bg-gray-900/80 backdrop-blur-md text-white p-4 rounded-2xl shadow-lg">
      <div className="flex items-center">
        <div className="flex flex-1 gap-5 items-center justify-between">
          <div className="flex gap-1 items-center justify-between">
            {trackCurrent && trackCurrent.musicThumbnail && (
              <Image
                className="rounded-lg"
                src={trackCurrent?.musicThumbnail}
                alt="thumbnail"
                width={60}
                height={60}
              />
            )}
            <span className="ml-4 text-1xl font-semibold truncate w-[20vw] flex items-center gap-5">
              {trackCurrent?.musicDescription}
              <FaHeartbeat size={20} />
            </span>
          </div>
        </div>
        <div className="flex justify-center flex-col gap-2">
          <div className="flex gap-10 items-center justify-center">
            <button className="hover:text-green-400 transition">
              <FaShuffle size={20} />
            </button>

            <button
              onClick={prevTrack}
              className="hover:text-green-400 transition"
            >
              <FaStepBackward size={20} />
            </button>

            <ButtonPlayer
              current={trackCurrent?._id}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
            />

            <button
              onClick={nextTrack}
              className="hover:text-green-400 transition"
            >
              <FaStepForward size={20} />
            </button>

            <button className="hover:text-green-400 transition">
              <FaRepeat size={20} />
            </button>
          </div>
          <div className="flex justify-center items-center gap-5">
            <span>{formatTime(Math.floor(seek))}</span>
            <input
              type="range"
              min={0}
              max={duration}
              value={seek}
              onChange={handleSeekChange}
              className="w-[35vw] h-1"
            />
            <span>{formatTime(Math.floor(duration))}</span>
          </div>
        </div>
        <div className="flex flex-1 justify-end items-center gap-2">
          <button
            onClick={toggleMute}
            className="ml-4 hover:text-green-400 transition"
          >
            {volume > 0 ? <FaVolumeUp size={20} /> : <FaVolumeMute size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="ml-2 w-20 h-1 bg-white rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div hidden>
          {trackCurrent && trackCurrent.musicUrl && (
            <ReactHowler
              src={trackCurrent.musicUrl}
              playing={isPlaying}
              volume={volume}
              ref={playerRef}
              onLoad={handleLoad}
              onEnd={handleEndMusic}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
