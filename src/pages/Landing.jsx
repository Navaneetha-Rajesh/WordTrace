import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">
        Verify Effort, Not Just Output
      </h1>
      <Link
        to="/login"
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Login
      </Link>
    </div>
  );
}