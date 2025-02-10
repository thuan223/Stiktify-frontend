"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { notification } from "antd";

interface ChangePasswordModalProps {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  onClose,
}) => {
  const { user, logout } = useContext(AuthContext) || {};
  const [step, setStep] = useState(1);
  const [email] = useState(user?.email || "");
  const [activeCode, setActiveCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSendCode = async () => {
    if (!email) {
      setError("Email is required!");
      return;
    }

    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-password`,
        method: "POST",
        body: { email },
      });

      if (res.statusCode === 201) {
        setStep(2);
        setSuccess(
          "Verification code has been sent, please check your email (including spam)!"
        );
        setError("");
      } else {
        setError(
          res.message || "Failed to send verification code. Please try again!"
        );
      }
    } catch (err) {
      setError("An error occurred! Please try again.");
    }
  };

  const handleChangePassword = async () => {
    if (!activeCode) {
      setError("Verification code is required!");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Confirmation password does not match!");
      return;
    }

    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/change-password`,
        method: "POST",
        body: {
          activeCode,
          userName: user?.email || "",
          password,
          confirmPassword,
        },
      });

      if (res.statusCode === 201) {
        setSuccess("Password changed successfully!");
        setError("");
        setTimeout(() => onClose(), 1000);
        notification.success({
          message: "Change Password Successfully",
          description: res?.message,
          duration: 3,
        });
        logout!();
        router.push("/auth/login");
      } else {
        setError(res.message || "Password change failed. Please try again!");
      }
    } catch (err) {
      setError("An error occurred! Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-xl font-bold mb-4 text-center">
          {step === 1 ? "Verify Email" : "Change Password"}
        </h2>
        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {step === 1 ? (
          <div>
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-200"
            />
            <button
              onClick={handleSendCode}
              className="w-full bg-blue-500 text-white p-2 mt-4 rounded-md"
            >
              Send Verification Code
            </button>
          </div>
        ) : (
          <div>
            <label className="block mb-2">Verification Code:</label>
            <input
              type="text"
              value={activeCode}
              onChange={(e) => setActiveCode(e.target.value)}
              className="w-full p-2 border rounded-md"
            />

            <label className="block mt-4 mb-2">New Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
            />

            <label className="block mt-4 mb-2">Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
            />

            <button
              onClick={handleChangePassword}
              className="w-full bg-green-500 text-white p-2 mt-4 rounded-md"
            >
              Change Password
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gray-500 text-white p-2 mt-4 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
