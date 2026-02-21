import { useState } from "react";
import axios from "axios";

function CampaignForm() {
  const [product, setProduct] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCampaign = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/generate",
        { product },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent(res.data.content);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("Generation failed");
    }
  };

  return (
    <div className="bg-slate-900 p-8 rounded-2xl shadow-lg max-w-3xl">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter your product name..."
          className="flex-1 p-3 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          onChange={(e) => setProduct(e.target.value)}
        />

        <button
          onClick={generateCampaign}
          className="bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {content && (
        <div className="bg-slate-800 p-6 rounded-lg whitespace-pre-wrap text-slate-200">
          {content}
        </div>
      )}
    </div>
  );
}

export default CampaignForm;