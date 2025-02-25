import MusicPlayer from "@/components/music/music.player";

const MusicGuestLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="flex flex-col min-h-screen border-none">
            <div className="flex-auto">
                {children}
            </div>
            <div className="w-full flex-none h-[14vh] bg-gray-900/80 rounded-lg shadow-gray-400/50"><MusicPlayer /></div>
        </div>
    );
};

export default MusicGuestLayout;  