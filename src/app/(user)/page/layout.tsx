"use client";
import SideBar from "@/components/page/sidebar";
import { useShowComment } from "@/context/ShowCommentContext";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { showComments } = useShowComment();

  return (
    <div className="flex">
      {!showComments && <SideBar isGuest={false} />}
      <main className="flex-grow p-5">{children}</main>
    </div>
  );
};

export default PageLayout;
