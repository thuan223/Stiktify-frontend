"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";

interface Music {
  musicUrl: string | undefined;
}

const ShareMusic = () => {
  const { id } = useParams();
  const [musicData, setMusicData] = useState<Music | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchMusicShare();
    } else {
      setError("Invalid music ID");
      setLoading(false);
    }
  }, [id]);

  const fetchMusicShare = async () => {
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/share/${id}`,
        method: "GET",
      });

      if (res?.data?.musicUrl) {
        setMusicData({ musicUrl: res.data.musicUrl });
      } else {
        setError("Music not found");
      }
    } catch (err) {
      setError("Failed to fetch music");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!musicData)
    return <p className="text-center text-gray-600">No music data</p>;

  return (
    <div className="p-6 max-w-lg mx-auto border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Music Player</h1>

      {/* Audio Player */}
      <audio className="w-full" controls>
        <source src={musicData.musicUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default ShareMusic;
