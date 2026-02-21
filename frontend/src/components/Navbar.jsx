import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-10 py-4 bg-slate-900 border-b border-slate-800">
      <h1 className="text-xl font-bold text-purple-400">
        RankPilot AI 🚀
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;