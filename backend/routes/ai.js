const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Campaign = require("../models/Campaign");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   GEMINI INITIALIZATION
========================= */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* =========================
   GENERATE AI CAMPAIGN
========================= */

router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const { product } = req.body;

    if (!product || product.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Valid product name is required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL, // gemini-2.5-flash
    });

    const prompt = `
Act as a professional SaaS marketing strategist.

Generate:
1. 3 powerful Instagram captions
2. 10 high-converting hashtags
3. A short compelling call-to-action

Product: ${product}
Tone: Modern, confident, startup-focused
Output clearly structured sections.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    /* =========================
       SAVE CAMPAIGN TO DATABASE
    ========================= */

    const newCampaign = await Campaign.create({
      user: req.user.id,
      product,
      content: text,
    });

    res.status(200).json({
      success: true,
      campaignId: newCampaign._id,
      content: text,
    });

  } catch (error) {
    console.error("❌ Gemini Generation Error:", error.message);

    res.status(500).json({
      success: false,
      message: "AI content generation failed",
    });
  }
});

/* =========================
   GET USER CAMPAIGNS
========================= */

router.get("/campaigns", authMiddleware, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: campaigns.length,
      campaigns,
    });

  } catch (error) {
    console.error("❌ Fetch Campaign Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
    });
  }
});

/* =========================
   GET SINGLE CAMPAIGN
========================= */

router.get("/campaign/:id", authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      campaign,
    });

  } catch (error) {
    console.error("❌ Fetch Single Campaign Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch campaign",
    });
  }
});

/* =========================
   DELETE CAMPAIGN
========================= */

router.delete("/campaign/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Campaign.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
    });

  } catch (error) {
    console.error("❌ Delete Campaign Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete campaign",
    });
  }
});

module.exports = router;