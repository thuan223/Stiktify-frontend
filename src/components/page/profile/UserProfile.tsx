"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext"; // Đảm bảo rằng AuthContext đã được import đúng
import { useRouter } from "next/navigation";
import ChangePasswordModal from "./ChangePasswordModal";

interface UserProfileProps {
  profile?: {
    fullname: string;
    dob: string;
    email: string;
    userName: string;
    phone: string;
    address: string;
  };
  onUpdateProfile: (updatedProfile: any) => void; // Hàm callback khi cập nhật thông tin
}

const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  onUpdateProfile,
}) => {
  if (!profile) {
    return (
      <div className="text-center text-red-500">Profile data is missing.</div>
    );
  }

  // Lấy user từ AuthContext
  const context = useContext(AuthContext);

  // Kiểm tra nếu context không có giá trị
  if (!context) {
    console.error("AuthContext is not available");
    return <div>Error: AuthContext is not available</div>;
  }

  const { user, logout } = context; // Lấy user từ context
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout(), router.replace("/auth/login");
  };
  console.log("User from context:", user);

  // State để lưu thông tin chỉnh sửa
  const [editProfile, setEditProfile] = useState({
    fullname: profile.fullname || "",
    dob: profile.dob || "",
    email: profile.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
  });

  // State để lưu thông báo thành công
  const [successMessage, setSuccessMessage] = useState("");

  // Hàm xử lý khi người dùng chỉnh sửa thông tin
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfile({
      ...editProfile,
      [name]: value,
    });
  };

  // Hàm xử lý khi nhấn nút Cập nhật
  const handleSave = () => {
    if (!user?._id) {
      console.error("User ID is missing!");
      return;
    }

    // Bỏ qua email trong phần cập nhật (không thay đổi email)
    const { email, ...profileWithoutEmail } = editProfile;

    // Kết hợp user _id vào profile để gửi lên backend
    const profileWithId = { ...profileWithoutEmail, _id: user._id };

    // Gọi hàm onUpdateProfile truyền dữ liệu
    onUpdateProfile(profileWithId);
    setSuccessMessage("Profile updated successfully!"); // Thêm thông báo thành công
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-gray-600">
            {editProfile.fullname ? editProfile.fullname.charAt(0) : "?"}{" "}
          </span>
        </div>
        <p className="text-gray-500">@{profile.userName || "No username"}</p>
      </div>

      <div className="mt-6 space-y-4">
        {/* Fullname */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Fullname:</span>
          <input
            type="text"
            name="fullname"
            value={editProfile.fullname}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-md text-gray-900"
          />
        </div>

        {/* Email */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Email:</span>
          <input
            type="email"
            name="email"
            value={editProfile.email}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-md text-gray-900"
            disabled // Không cho chỉnh sửa email
          />
        </div>

        {/* Date of Birth */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Date of Birth:</span>
          <input
            name="dob"
            value={editProfile.dob}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-md text-gray-900"
          />
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Phone:</span>
          <input
            type="text"
            name="phone"
            value={editProfile.phone}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-md text-gray-900"
          />
        </div>

        {/* Address */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Address:</span>
          <input
            type="text"
            name="address"
            value={editProfile.address}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-md text-gray-900"
          />
        </div>

        <div className="mt-6 flex justify-between">
          <div className="mt-6 flex justify-start">
            <button
              onClick={handleOpenModal}
              className="bg-blue-500 text-white mr-4 px-4 py-2 rounded"
            >
              Change Password
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleLogout}
              className="bg-orange-500 text-white mr-4 px-4 py-2 rounded"
            >
              Logout
            </button>

            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save Profile
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mt-4 text-center text-green-500">
            {successMessage}
          </div>
        )}
      </div>
      {isModalOpen && <ChangePasswordModal onClose={handleCloseModal} />}
    </div>
  );
};

export default UserProfile;
