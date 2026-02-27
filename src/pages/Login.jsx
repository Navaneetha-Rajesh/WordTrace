import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import hatchBg from "../assets/y-hatch.png";
import borderImg from "../assets/y-border.png"; 

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("role", role);
    navigate(role === "student" ? "/student" : "/professor");
  };

  const buttonStyle = {
    borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
    backgroundImage: `url(${hatchBg})`,
    backgroundSize: '150%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="min-h-screen bg-[#FFFEF4] flex flex-col items-center justify-center font-['Schoolbell'] text-[#1a1a1a] p-4 relative overflow-hidden">
      
      {/* Back Arrow */}
      <Link to="/" className="absolute top-10 left-10 text-4xl hover:opacity-70 transition-opacity">
        ←
      </Link>

      {/* Reduced bottom margin to pull the box closer */}
      <h1 className="text-5xl mb-0 relative z-10 translate-y-4 ">login</h1>

      {/* Main Container */}
      <div 
        className="w-full max-w-[800px] aspect-[16/9] flex items-center justify-center mt-[40px]"
        style={{
          backgroundImage: `url(${borderImg})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '5% 10% 10% 10%' // Reduced top padding to move inputs up
        }}
      >
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 flex flex-col items-center mt-14">
          
          {/* Username Field */}
          <div className="flex items-center w-full gap-4">
            <label className="text-2xl w-24 text-right">username:</label>
            <input
              type="email"
              required
              className="flex-1 border-2 border-black bg-white h-10 px-4 focus:outline-none"
              style={{ borderRadius: "10px 150px 10px 150px/150px 10px 150px 10px" }}
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center w-full gap-4">
            <label className="text-2xl w-24 text-right">password:</label>
            <input
              type="password"
              required
              className="flex-1 border-2 border-black bg-white h-10 px-4 focus:outline-none"
              style={{ borderRadius: "150px 10px 150px 10px/10px 150px 10px 150px" }}
            />
          </div>

          {/* Role Selection */}
          <div className="flex items-center w-full gap-4">
            <label className="text-2xl w-24 text-right">role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex-1 border-2 border-black bg-white h-10 px-4 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="student">student</option>
              <option value="professor">professor</option>
            </select>
          </div>

          {/* Signup Button */}
          <button 
            type="submit"
            className="mt-2 px-10 py-1 border-2 border-black text-2xl"
            style={buttonStyle}
          >
            signup
          </button>
        </form>
      </div>
    </div>
  );
}