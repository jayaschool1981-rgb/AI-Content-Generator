import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://ai-content-generator-1q4k.onrender.com/api";

const Dashboard = () => {
  const [product, setProduct] = useState("");
  const [content, setContent] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🚨 If no token → redirect to login
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

  // 🔥 Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${API}/campaigns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCampaigns(res.data.campaigns || []);
    } catch (error) {
      console.error("Fetch campaigns error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCampaigns();
    }
  }, [token]);

  // 🔥 Generate campaign
  const handleGenerate = async () => {
    if (!product.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/generate`,
        { product },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent(res.data.content);
      setProduct("");
      fetchCampaigns(); // refresh history
    } catch (error) {
      console.error("Generate error:", error.response?.data || error.message);
      alert("Generation failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-10">
      <h1 className="text-3xl font-bold mb-6">AI Campaign Generator</h1>

      {/* Generator Section */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter product name..."
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="flex-1 p-3 rounded bg-[#1e293b] outline-none border border-slate-700"
        />
        <button
          onClick={handleGenerate}
          className="px-6 py-3 bg-purple-600 rounded hover:bg-purple-700 transition"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Latest Generated Campaign */}
      {content && (
        <div className="bg-[#1e293b] p-6 rounded mb-10 whitespace-pre-wrap border border-slate-700">
          {content}
        </div>
      )}

      {/* Campaign History */}
      <h2 className="text-2xl font-semibold mb-4">Your Campaigns</h2>

      {campaigns.length === 0 ? (
        <p className="text-gray-400">No campaigns generated yet.</p>
      ) : (
        <div className="space-y-6">
          {campaigns.map((camp) => (
            <div
              key={camp._id}
              className="bg-[#1e293b] p-5 rounded border border-slate-700"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{camp.product}</h3>
                <span className="text-sm text-gray-400">
                  {new Date(camp.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="text-sm whitespace-pre-wrap">
                {camp.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;