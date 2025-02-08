import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';

interface IProps {
    isModalOpen: boolean,
    setIsModalOpen: (v: boolean) => void
    videoUrl: string
}
const ModalWatchVideo = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, videoUrl } = props

    const [size, setSize] = useState({
        width: typeof window !== "undefined" ? window.innerWidth / 1.5 : 0,
        height: typeof window !== "undefined" ? window.innerHeight / 1.3 : 0
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => setSize({ width: window.innerWidth / 1.5, height: window.innerHeight / 1.3 });

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };



    return (
        <>
            <Modal
                width={size.width}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                styles={{
                    content: { marginTop: 0, top: 0, padding: 0 },
                    body: { height: size.height, overflow: "hidden", }
                }}
                footer={false}
                closable={false}
            >
                <div style={{ width: "100%", height: "100%", display: "flex" }}>
                    <iframe
                        src={videoUrl}
                        title="YouTube video player"
                        style={{ flex: 1, border: "none" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </div>
            </Modal>

        </>
    );
};

export default ModalWatchVideo;