"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dropdown, Menu } from "antd";

interface HeaderProps {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  isGuest: Boolean;
}

const Header: React.FC<HeaderProps> = ({
  searchValue,
  setSearchValue,
  isGuest,
}) => {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const menu = (
    <Menu
      onClick={({ key }) => {
        setSelected(key);
        if (key === "my-videos") {
          router.push("/page/my-video");
        }
      }}
      items={[{ key: "my-videos", label: "My Videos" }]}
    />
  );

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center flex-1 justify-center">
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={`w-[30%] md:w-[35%] lg:w-[45%] px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none`}
        />
        <button
          className="flex items-center justify-center p-[10px] rounded-r-lg border border-gray-300"
          aria-label="Search"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6 .1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-xl cursor-pointer">
          {isGuest ? (
            <button
              onClick={() => router.push("/auth/login")}
              className="text-red-500 bg-white border-2 border-red-500 rounded-lg py-1 px-4 hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              Sign In
            </button>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 448 512"
            >
              <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
            </svg>
          )}
        </div>

        <Dropdown overlay={menu} trigger={["click"]}>
          <div className="text-xl cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 448 512"
            >
              <path d="M16 132h416c8.8 0 16-7.2 16-16V76c0-8.8-7.2-16-16-16H16C7.2 60 0 67.2 0 76v40c0 8.8 7.2 16 16 16zm0 160h416c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zm0 160h416c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16z" />
            </svg>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
