"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format } from "date-fns";
import ChangePasswordModal from "./ChangePasswordModal";
import { useRouter } from "next/navigation";
import { notification } from "antd";

interface UserProfileProps {
  profile?: {
    fullname: string;
    dob: string;
    email: string;
    userName: string;
    phone: string;
    address: string;
  };
  onUpdateProfile: (updatedProfile: any) => void;
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

  const context = useContext(AuthContext);
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

  const [editProfile, setEditProfile] = useState({
    fullname: profile.fullname || "",
    dob: profile.dob ? parseISO(profile.dob) : null, // Chuyển đổi từ string thành Date object
    email: profile.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Xử lý khi chọn ngày mới
  const handleDateChange = (date: Date | null) => {
    setEditProfile({
      ...editProfile,
      dob: date,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfile({
      ...editProfile,
      [name]: value,
    });
  };

  const validateInputs = () => {
    setErrorMessage("");

    // Kiểm tra ngày sinh
    if (!editProfile.dob) {
      setErrorMessage("Date of Birth cannot be empty.");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Xóa giờ để so sánh chính xác

    const year = editProfile.dob.getFullYear();
    if (year < 1900) {
      setErrorMessage("Date of Birth must be after the year 1900.");
      return false;
    }
    if (editProfile.dob >= today) {
      setErrorMessage("Date of Birth cannot be today or in the future.");
      return false;
    }

    // Kiểm tra số điện thoại
    if (!editProfile.phone) {
      setErrorMessage("Phone number cannot be empty.");
      return false;
    }
    if (!/^\d{10}$/.test(editProfile.phone)) {
      setErrorMessage("Phone number must be exactly 10 digits.");
      return false;
    }
    if (profile.phone?.includes(editProfile.phone)) {
      setErrorMessage("Phone number already exists.");
      return false;
    }

    // Kiểm tra địa chỉ (tối đa 150 từ)
    if (editProfile.address.split(" ").length > 150) {
      setErrorMessage("Address cannot exceed 150 words.");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!user?._id) {
      console.error("User ID is missing!");
      return;
    }

    if (!validateInputs()) {
      notification.error({ message: errorMessage });

      return;
    }

    const { email, ...profileWithoutEmail } = editProfile;
    const profileWithId = {
      ...profileWithoutEmail,
      _id: user._id,
      dob: editProfile.dob ? format(editProfile.dob, "yyyy-MM-dd") : null, // Format lại để lưu vào database
    };

    onUpdateProfile(profileWithId);
    setSuccessMessage("Profile updated successfully!");
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-gray-600">
            {editProfile.fullname ? editProfile.fullname.charAt(0) : "?"}
          </span>
        </div>
        <p className="text-gray-500">@{profile.userName || "No username"}</p>
      </div>

      <div className="mt-6 space-y-4">
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

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Email:</span>
          <input
            type="email"
            name="email"
            value={editProfile.email}
            onChange={handleChange}
            className="flex-1 p-2 border border-gray-300 rounded-md text-gray-900"
            disabled
          />
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Date of Birth:</span>
          <DatePicker
            selected={editProfile.dob}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            className="p-2 border border-gray-300 rounded-md text-gray-900 w-full"
            placeholderText="Select a date"
          />
        </div>

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
