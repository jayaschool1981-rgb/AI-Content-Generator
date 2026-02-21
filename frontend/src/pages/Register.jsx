import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/register", {
        email,
        password,
      });

      alert("Account created successfully!");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <form
        onSubmit={handleRegister}
        className="bg-slate-800 p-10 rounded-2xl w-96 shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">
          Create Account
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-cyan-500 py-3 rounded-lg hover:bg-cyan-600 transition font-semibold">
          Register
        </button>

        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;