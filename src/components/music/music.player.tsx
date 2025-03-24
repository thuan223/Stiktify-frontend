"use client";
import { formatTime } from "@/utils/utils";
import { useState, useRef, useEffect, useContext, useCallback } from "react";
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
import { getTrackRelatedAction, handleListenNeo4j, handleUpdateListenerAction } from "@/actions/music.action";
import { AuthContext } from "@/context/AuthContext";
import Cookies from "js-cookie";

const MusicPlayer = () => {
  const {
    isPlaying,
    setIsPlaying,
    trackCurrent,
    listPlaylist,
    setTrackCurrent,
    flag,
    setFlag,
    trackRelatedId,
    setTrackRelatedId,
    prevList,
    setPrevList,
    musicTagRelated,
    setMusicTagRelated
  } = useGlobalContext()!;
  const [volume, setVolume] = useState(1);
  const playerRef = useRef<ReactHowler | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [count, setCount] = useState(0);
  const [second, setSecond] = useState(0);
  const [isMusicPaused, setIsMusicPaused] = useState(false);
  const [countTrack, setCountTrack] = useState(0);
  const { user, accessToken } = useContext(AuthContext) ?? {};

  useEffect(() => {
    if (trackCurrent) {
      if (!trackRelatedId.some((x: any) => x === trackCurrent._id)) {
        setTrackRelatedId([...trackRelatedId, trackCurrent._id])
        setPrevList([...prevList, trackCurrent])

        const newTags = trackCurrent.musicTag.filter(
          (tag) => !musicTagRelated.some((existingTag) => existingTag._id === tag._id)
        );

        if (newTags.length > 0) {
          setMusicTagRelated([...musicTagRelated, ...newTags]);
        }


      }
    }
  }, [trackCurrent])

  useEffect(() => {
    setIsMusicPaused(Cookies.get("isMusicPause") === "true");
  }, []);

  const togglePlay = useCallback(() => setIsPlaying(!isPlaying), [isPlaying, setIsPlaying]);
  const toggleMute = useCallback(() => setVolume((prev) => (prev > 0 ? 0 : 1)), []);
  // const nextTrack = useCallback(() => setCountTrack((prev) => (prev + 1) % listPlaylist.length), [listPlaylist.length]);
  // const prevTrack = useCallback(() => setCountTrack((prev) => (prev - 1 + listPlaylist.length) % listPlaylist.length), [listPlaylist.length]);

  const nextTrack = useCallback(() => {
    setCountTrack((prev) => (prev + 1) % listPlaylist.length);

    if (listPlaylist.length > 0) {
      const nextTrack = listPlaylist[(countTrack + 1) % listPlaylist.length];

    }
  }, [listPlaylist, countTrack]);
  console.log(prevList);

  const prevTrack = useCallback(async () => {
    if (listPlaylist.length > 0) {
      setCountTrack((prev) => (prev - 1 + listPlaylist.length) % listPlaylist.length)
    } else if (prevList.length > 0) {
      setCountTrack((prev) => (prev - 1 + prevList.length) % prevList.length)
    }

  }, [listPlaylist.length]);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (playerRef.current) setSeek(playerRef.current.seek());
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, seek]);

  useEffect(() => {
    if (!trackCurrent || flag || second < 15) return;
    (async () => {
      if (!flag) {
        if (user) {
          await handleListenNeo4j(trackCurrent._id, user._id);

          if (!isMusicPaused) {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/listeninghistory/create-listening-history`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
              body: JSON.stringify({ userId: user._id, musicId: trackCurrent._id }),
            });
          }
        }
        await handleUpdateListenerAction(trackCurrent._id);
        setFlag(true);
      }
      setSecond(0);
    })();
  }, [second, trackCurrent, user, isMusicPaused, accessToken, flag]);

  useEffect(() => {
    setCount((prev) => prev + 1);

    if (count === Math.round(seek)) {
      setSecond((prev) => prev + 1);
    }

    if (Math.round(seek) !== count) {
      setCount(Math.round(seek) + 1);
      setSecond(0);
    }
  }, [seek]);
  console.log(seek.toFixed(0));
  console.log(+duration.toFixed(0) - 2);

  useEffect(() => {
    if (+seek.toFixed(0) === +duration.toFixed(0)) {
      (async () => {
        if (listPlaylist.length > 0) {
          setCountTrack((prev) => (prev + 1) % listPlaylist.length);
        } else if (prevList.length > 0) {
          const res = await getTrackRelatedAction(trackRelatedId, musicTagRelated);
          setTrackCurrent(res?.data);
        }
      })()
    }
  }, [second, duration])

  useEffect(() => {
    if (listPlaylist.length > 0) {
      const newTrack = listPlaylist[countTrack]?.musicId;
      if (newTrack) {
        localStorage.setItem("trackCurrent", JSON.stringify(newTrack));
        setTrackCurrent(newTrack);
      }
    }
  }, [listPlaylist, countTrack, setTrackCurrent]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSeek = parseFloat(e.target.value);
    setSeek(newSeek);

    if (playerRef.current) {
      playerRef.current.seek(newSeek);
      setIsPlaying(false);
      setTimeout(() => {
        setIsPlaying(true);
      }, 100);
    }
  };

  const handleLoad = useCallback(() => {
    if (playerRef.current) setDuration(playerRef.current.duration());
  }, []);

  const handleEndMusic = useCallback(async () => {
    setSecond(0);
    setFlag(false);
  }, [prevList, listPlaylist.length, trackRelatedId, musicTagRelated, setTrackCurrent]);


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
