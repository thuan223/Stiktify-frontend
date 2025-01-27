"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname();
  const getLinkClass = (path: string) => {
    return pathname === path
      ? "text-lg font-bold text-red-500"
      : "text-lg text-gray-700 hover:text-red-500";
  };

  return (
    <div className="w-[10%] pt-10 h-screen bg-white shadow-lg p-5">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              href="/page/trending"
              className={getLinkClass("/page/trending")}
            >
              Trending
            </Link>
          </li>
          <li>
            <Link href="/page/music" className={getLinkClass("/page/music")}>
              Music
            </Link>
          </li>
          <li>
            <Link
              href="/page/following"
              className={getLinkClass("/page/following")}
            >
              Following
            </Link>
          </li>
          <li>
            <Link
              href="/page/profile"
              className={getLinkClass("/page/profile")}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link href="/page/live" className={getLinkClass("/page/live")}>
              Live
            </Link>
          </li>
          <li>
            <Link href="/page/chat" className={getLinkClass("/page/chat")}>
              Chat
            </Link>
          </li>
          <li>
            <Link
              href="/page/history"
              className={getLinkClass("/page/history")}
            >
              History
            </Link>
          </li>
        </ul>
      </nav>
      <footer className="mt-[10px] text-center">
        <small className="text-gray-500">© 2025 Stiktify</small>
      </footer>
    </div>
  );
};

export default SideBar;
