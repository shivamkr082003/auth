import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await signup({ ...form, email });
      setMsg(res.data.message);
      localStorage.removeItem("email");
      navigate("/signin");
    } catch (err) {
      setMsg(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="card">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button>Create Account</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
