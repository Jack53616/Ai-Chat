
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = "AIzaSyCejVRPRp7p8mMTSJL8qJVXGEUCnDfjJiY";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Jack.html"));
});

app.use(cors());
app.use(bodyParser.json());

app.post("/api/gemini", async (req, res) => {
    const userText = req.body.message;
    if (!userText) return res.status(400).json({ error: "Missing message" });

    const payload = {
        contents: [
            {
                parts: [{ text: userText }]
            }
        ]
    };

    try {
        const response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("📩 Gemini Response:", JSON.stringify(data, null, 2));

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
        res.json({ reply });

    } catch (error) {
        console.error("❌ Gemini Error:", error);
        res.status(500).json({ error: "Failed to contact Gemini API." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Gemini 2.0 Flash Server running at: http://localhost:${PORT}`);
});
