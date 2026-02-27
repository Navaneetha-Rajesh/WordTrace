import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("role", role);
    navigate(role === "student" ? "/student" : "/professor");
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80"
      >
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="student">Student</option>
          <option value="professor">Professor</option>
        </select>

        <button className="bg-black text-white p-2 rounded">
          Enter Portal
        </button>
      </form>
    </div>
  );
}