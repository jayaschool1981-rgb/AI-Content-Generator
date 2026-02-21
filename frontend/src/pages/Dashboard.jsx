import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [product, setProduct] = useState("");
  const [content, setContent] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const API = "https://ai-content-generator-1q4k.onrender.com/";

  // 🔥 Fetch campaigns on load
  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${API}/campaigns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCampaigns(res.data.campaigns);
    } catch (err) {
      console.error("Error fetching campaigns");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // 🔥 Generate Campaign
  const handleGenerate = async () => {
    if (!product) return;

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
      fetchCampaigns(); // refresh list
    } catch (err) {
      alert("Generation failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-10">
      <h1 className="text-3xl font-bold mb-6">AI Campaign Generator</h1>

      {/* Generator Box */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter product name..."
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="flex-1 p-3 rounded bg-[#1e293b] outline-none"
        />
        <button
          onClick={handleGenerate}
          className="px-6 py-3 bg-purple-600 rounded hover:bg-purple-700"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Latest Generated */}
      {content && (
        <div className="bg-[#1e293b] p-6 rounded mb-10 whitespace-pre-wrap">
          {content}
        </div>
      )}

      {/* Campaign History */}
      <h2 className="text-2xl font-semibold mb-4">Your Campaigns</h2>

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
    </div>
  );
};

export default Dashboard;