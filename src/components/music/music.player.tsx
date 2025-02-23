"use client";
import { formatTime } from "@/utils/utils";
import { useState, useRef, useEffect } from "react";
import ReactHowler from "react-howler";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { FaShuffle, FaRepeat } from "react-icons/fa6";

const tracks = [{ title: "Ac Quỷ Nè", src: "/AcQuyNe.mp3" }];

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [volume, setVolume] = useState(1);
    const playerRef = useRef<ReactHowler | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [seek, setSeek] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleMute = () => setVolume(volume > 0 ? 0 : 1);
    const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % tracks.length);
    const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);


    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                if (playerRef.current) {
                    setSeek(playerRef.current.seek());
                }
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
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

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSeek = parseFloat(e.target.value);
        setSeek(newSeek);
        playerRef.current?.seek(newSeek);
    };

    return (
        <div className="w-full h-full bg-gray-900/80 backdrop-blur-md text-white p-4 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between ">
                <div>
                    <span className="ml-4 text-sm font-semibold">{tracks[currentTrack].title}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-10 items-center justify-center">
                        <button className="hover:text-green-400 transition">
                            <FaShuffle size={20} />
                        </button>

                        <button onClick={prevTrack} className="hover:text-green-400 transition">
                            <FaStepBackward size={20} />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-12 h-12 flex items-center justify-center bg-green-500 hover:bg-green-400 transition rounded-full shadow-md">
                            {isPlaying ? <FaPause size={24} /> : <FaPlay className="ms-1" size={24} />}
                        </button>

                        <button onClick={nextTrack} className="hover:text-green-400 transition">
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

                <div className="flex justify-end items-center gap-2">
                    <button onClick={toggleMute} className="ml-4 hover:text-green-400 transition">
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
                    <ReactHowler
                        src={tracks[currentTrack].src}
                        playing={isPlaying}
                        volume={volume}
                        ref={playerRef}
                        onLoad={handleLoad}
                    />
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
