import MusicPlayer from "@/components/music/music.player";

const MusicGuestLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-auto">{children}</div>
            <div className="w-full flex-none h-24 border-gray-200 border bg-[#f1f1f1] rounded-lg shadow-gray-400/50"><MusicPlayer /></div>
        </div>
    );
};

export default MusicGuestLayout;  