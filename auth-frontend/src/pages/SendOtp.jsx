import { useState } from "react";
import { sendOtp } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function SendOtp() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await sendOtp({ email });
      setMsg(res.data.message);
      localStorage.setItem("email", email);
      navigate("/verify-otp");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="card">
      <h2>Send OTP</h2>
      <form onSubmit={handleSendOtp}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button>Send OTP</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
