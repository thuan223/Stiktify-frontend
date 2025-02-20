"use client";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";

const SendMailPage = () => {
  const { accessToken } = useContext(AuthContext) ?? {};
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleSendMail = async () => {
    if (!accessToken) {
      setResponseMessage("Authentication required.");
      return;
    }

    setLoading(true);
    try {
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/mail`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: {}, // No body required for this request
      });
      setResponseMessage("Email sent successfully! Please check your email.");
    } catch (error) {
      setResponseMessage("Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 shadow-lg rounded-lg">
      <h2 className="text-3xl font-extrabold text-white text-center mb-6">Send Mail</h2>
      <p className="text-white text-lg text-center mb-4">
      </p>
      {loading ? (
        <p className="text-white text-center">Sending email...</p>
      ) : (
        <p className="text-white text-center mt-4">{responseMessage}</p>
      )}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSendMail}
          className="px-6 py-3 bg-white text-blue-600 rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Send Mail
        </button>
      </div>
    </div>
  );
};

export default SendMailPage;
