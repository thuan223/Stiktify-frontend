import SideBar from "@/components/page/sidebar";

const PageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex">
      <SideBar />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default PageLayout;  