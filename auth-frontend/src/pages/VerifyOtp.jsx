import { useState } from "react";
import { verifyOtp } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtp({ email, otp });
      setMsg(res.data.message);
      navigate("/signup");
    } catch (err) {
      setMsg(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="card">
      <h2>Verify OTP</h2>
      <form onSubmit={handleVerify}>
        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button>Verify</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
