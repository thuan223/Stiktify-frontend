import { Image } from "antd";
import { useState } from "react";
interface IProps {
    videoUrl: string,
    videoThumbnail: string
}

const VideoCustomize = (props: IProps) => {
    const { videoThumbnail, videoUrl } = props
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div
            style={{
                width: "150px",
                aspectRatio: "16/9",
                borderRadius: "3px",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                textAlign: "center",
                overflow: "hidden"
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {!isHovered ?
                <img
                    src={videoThumbnail}
                    alt="Video Thumbnail"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                />
                :
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "black", // Màu chữ nổi bật
                        fontWeight: "bold",
                        fontSize: "16px"
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${videoThumbnail})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(5px)", // Làm mờ ảnh
                            opacity: 0.7, // Điều chỉnh độ trong suốt
                            zIndex: -1 // Đảm bảo ảnh nền nằm phía sau nội dung
                        }}
                    ></div>
                    Watch Video
                </div>
            }


        </div >


    )
}

export default VideoCustomize;