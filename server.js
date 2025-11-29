import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const HF_KEY = process.env.HF_KEY;

app.post("/generate-logo", async (req, res) => {
  try {
    const prompt = req.body.prompt || req.body.inputs;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", "image/png");
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).send("Backend error");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Backend running"));
