"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";

interface Music {
  MusicUrl: string | undefined;
}

const ShareMusic = () => {
  const { id } = useParams();
  const { accessToken } = useContext(AuthContext) ?? {};
  const [musicData, setMusicData] = useState<Music | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && accessToken) {
      fetchMusicShare();
    } else {
      setError("Missing music ID or access token");
      setLoading(false);
    }
  }, [id, accessToken]);

  const fetchMusicShare = async () => {
    try {
      const res = await sendRequest<{ musicUrl: string }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/musics/share/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res && res.musicUrl) {
        setMusicData({ MusicUrl: res.musicUrl });
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

      {/* Music Player */}
      <audio className="w-full mt-4" controls>
        <source src={musicData.MusicUrl} type="audio/mp3" />
        Your browser does not support the audio tag.
      </audio>

      {/* Display Music URL */}
      <p className="mt-4 text-sm text-gray-600">
        <strong>Music URL:</strong> {musicData.MusicUrl}
      </p>
    </div>
  );
};

export default ShareMusic;
