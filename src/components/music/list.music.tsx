"use client";

import { useGlobalContext } from "@/library/global.context";
import CardMusic from "./card.music";
import InputCustomize from "../input/input.customize";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import DropdownCustomizeFilterVideo from "../dropdown/dropdownFilterVide";
import { useEffect, useState } from "react";
import { handleFilterSearchMusic } from "@/actions/music.action";

interface IProps {
  data: IMusic[];
}

const ListMusic = (props: IProps) => {
  const { setTrackCurrent, trackCurrent, isPlaying, setIsPlaying } =
    useGlobalContext()!;
  const { data } = props;
  const [search, setSearch] = useState<string>("");
  const [filterReq, setFilterReq] = useState<string>("");
  const [filteredData, setFilteredData] = useState<IMusic[]>(data);

  useEffect(() => {
    const fetchData = async () => {
      if (search.trim() === "") {
        setFilteredData(data);
        return;
      }
      try {
        const response = await handleFilterSearchMusic("1", "30");
        if (!response || !response.data || !response.data.result) {
          setFilteredData([]);
          return;
        }
        if (Array.isArray(response.data.result)) {
          const filtered = response.data.result.filter((music: IMusic) =>
            music.musicDescription.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredData(filtered);
        } else {
          setFilteredData([]);
        }
      } catch (error) {
        setFilteredData([]);
      }
    };
    fetchData();
  }, [search, data]);

  const handlePlayer = (track: IMusic) => {
    if (trackCurrent?._id !== track._id) {
      const data = {
        _id: track._id,
        musicDescription: track.musicDescription,
        musicThumbnail: track.musicThumbnail,
        musicUrl: track.musicUrl,
      };
      setTrackCurrent(data);
      localStorage.setItem("trackCurrent", JSON.stringify(data));
      return setIsPlaying(isPlaying ? true : !isPlaying);
    }
    return setIsPlaying(!isPlaying);
  };
  return (
    <div className="flex flex-wrap justify-start gap-5 my-3 mx-3">
      <div className="ml-[200px] flex justify-start gap-2">
        <div className="w-[700px]">
          <InputCustomize
            setValue={(val: any) => setSearch(val)}
            value={search}
            icon={<SearchOutlined />}
          />
        </div>
        <div>
          <DropdownCustomizeFilterVideo
            title="Filter"
            selected={filterReq}
            setSelect={(value: any) => setFilterReq(value)}
            icon={<FilterOutlined />}
          />
        </div>
      </div>
      {filteredData.length > 0 ? (
        filteredData.map((item) => (
          <CardMusic
            key={item._id}
            handlePlayer={handlePlayer}
            isPlaying={isPlaying}
            item={item}
          />
        ))
      ) : (
        <p className="text-gray-500 ml-[200px]">Không tìm thấy bài hát nào.</p>
      )}
    </div>
  );
};

export default ListMusic;
