"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface SideBarProps {
  isGuest: Boolean;
  isHidden?: Boolean;
}

const SideBar: React.FC<SideBarProps> = ({ isGuest, isHidden }) => {
  const pathname = usePathname();
  const getLinkClass = (path: string) => {
    return pathname === path
      ? "text-lg font-bold text-red-500"
      : "text-lg text-gray-700 hover:text-red-500";
  };

  return (
    <div
      className="w-[10%] pt-10 h-screen bg-white shadow-lg p-5"
      style={isHidden && { display: "none" }}
    >
      <nav>
        <ul className="space-y-4">
          {isGuest ? (
            <li>
              <Link
                href="/page/trending-guest"
                className={getLinkClass("/page/trending-guest")}
              >
                Trending
              </Link>
            </li>
          ) : (
            <li>
              <Link
                href="/page/trending-user"
                className={getLinkClass("/page/trending-user")}
              >
                Trending
              </Link>
            </li>
          )}
          {isGuest ? (
            ""
          ) : (
            <li>
              <Link
                href="/page/following"
                className={getLinkClass("/page/following")}
              >
                Following
              </Link>
            </li>
          )}
          <li>
            <Link href="/page/live" className={getLinkClass("/page/live")}>
              Live
            </Link>
          </li>
          <li>
            <Link href="/page/music" className={getLinkClass("/page/music")}>
              Music
            </Link>
          </li>
          {isGuest ? (
            ""
          ) : (
            <li>
              <Link
                href="/page/search-user"
                className={getLinkClass("/page/search-user")}
              >
                Search user
              </Link>
            </li>
          )}
          {isGuest ? (
            ""
          ) : (
            <li>
              <Link href="/page/chat" className={getLinkClass("/page/chat")}>
                Chat
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <footer className="mt-[10px] text-center">
        <small className="text-gray-500">©2025 Stiktify</small>
      </footer>
    </div>
  );
};

export default SideBar;
