import { useState } from "react";
import { signin } from "../api/auth";

export default function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await signin(form);
      localStorage.setItem("token", res.data.token);
      setMsg("Login successful");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="card">
      <h2>Signin</h2>
      <form onSubmit={handleSignin}>
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button>Login</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
