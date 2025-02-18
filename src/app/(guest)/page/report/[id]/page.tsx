"use client";

import { useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { Send } from "lucide-react";

const ReportPage = () => {
  const { id } = useParams();
  const { accessToken } = useContext(AuthContext) ?? {};
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter(); 

  const handleReportSubmit = async () => {
    if (!reason.trim()) {
      setMessage("Please enter a reason for the report.");
      return;
    }
    setLoading(true);
    try {
      await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reports/${id}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: { videoId: id, reasons: [reason] },
      });
      setMessage("Report submitted successfully.");
      setReason("");
      
      // Show success message in green
      setTimeout(() => {
        setMessage(""); 
        router.push("/page/trending-user"); // Redirect to homepage  
      }, 2000); // 3 seconds delay before redirection
    } catch (err) {
      setMessage("Failed to submit report.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto border border-gray-400 rounded-2xl shadow-2xl bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Report Video</h1>
      <div className="border border-gray-300 p-6 rounded-lg shadow-md bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Please Enter Your Report Reason</h2>
        <textarea
          className="w-full h-40 border p-4 rounded-lg text-lg focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>
        {message && (
          <p
            className={`text-lg mt-3 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}
          >
            {message}
          </p>
        )}
        <button
          className="mt-4 w-full bg-blue-500 text-white py-3 text-lg rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600"
          onClick={handleReportSubmit}
          disabled={loading}
        >
          <Send size={20} /> {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );
};

export default ReportPage;
