require("dotenv").config();
const axios = require("axios");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });
let chunks = [];

function splitText(text) {
  return text.split(/\n\s*\n/).filter(chunk => chunk.length > 100);
}

function getRelevantChunks(chunks, question) {
  return chunks
    .map(chunk => ({
      chunk,
      score: question.split(" ").filter(word => chunk.toLowerCase().includes(word.toLowerCase())).length
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.chunk);
}

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// SIMPLE WORKING PDF UPLOAD
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer = fs.readFileSync(req.file.path);
    const { PDFParse } = require("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result.text || "";

    if (!text || text.trim().length < 20) {
      return res.status(400).json({ error: "No readable text found in PDF" });
    }

    chunks = splitText(text);
    fs.unlinkSync(req.file.path);

    res.json({
      message: "PDF uploaded successfully",
      chunks: chunks.length,
      textLength: text.length
    });
  } catch (err) {
    res.status(500).json({ error: `Upload failed: ${err.message}` });
  }
});

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!chunks.length) {
    return res.json({ answer: "Upload a PDF first" });
  }

  const context = getRelevantChunks(chunks, question).join("\n\n");

  try {
    console.log("🤖 Calling AI API with question:", question);
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Answer ONLY from the context provided." },
          { role: "user", content: `Context:\n${context}\n\nQ: ${question}` }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    console.log("✅ AI API responded successfully");
    res.json({ answer: response.data.choices[0].message.content });
  } catch (err) {
    console.error("❌ AI API Error:", {
      status: err.response?.status,
      message: err.response?.data?.error || err.message,
      url: err.config?.url
    });
    res.status(500).json({ error: `AI failed: ${err.response?.data?.error || err.message}` });
  }
});

// Generate Summary
app.post("/generate-summary", async (req, res) => {
  try {
    if (!chunks.length) {
      return res.json({ summary: "Upload a PDF first" });
    }

    const context = chunks.join("\n\n").substring(0, 3000); // Limit context length

    console.log("📝 Generating summary...");
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Create a concise summary with key points." },
          { role: "user", content: `Summarize:\n${context}` }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    const summary = response.data.choices[0].message.content;
    console.log("✅ Summary generated");
    res.json({ summary });
  } catch (err) {
    console.error("❌ Summary error:", err.message);
    res.status(500).json({ error: `Summary failed: ${err.message}` });
  }
});

// Generate Quiz
app.post("/generate-quiz", async (req, res) => {
  try {
    if (!chunks.length) {
      return res.json({ questions: [] });
    }

    const context = chunks.slice(0, 5).join("\n\n").substring(0, 3000);

    console.log("🧠 Generating quiz...");
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Generate exactly 5 multiple choice questions with 4 options each. Return ONLY valid JSON array starting with [. Each question has: question (string), options (array of 4 strings), correct (0-3 for correct option index)." },
          { role: "user", content: `Generate 5 quiz questions from this content:\n\n${context}\n\nReturn only JSON array, no markdown or extra text:` }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    let content = response.data.choices[0].message.content.trim();
    console.log("Raw response:", content.substring(0, 200));
    
    // Try to parse JSON
    let questions = [];
    try {
      // Remove markdown code blocks if present
      content = content.replace(/```json\n?|```\n?/g, '').replace(/```/g, '').trim();
      
      // Extract JSON array
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
        // Filter out any incomplete questions
        questions = questions.filter(q => q.question && q.options && q.options.length === 4 && q.correct !== undefined);
      }
    } catch (parseErr) {
      console.error("JSON parse failed:", parseErr.message);
    }

    console.log("✅ Quiz generated:", questions.length, "questions");
    // Return at least placeholder if parsing failed completely
    res.json({ questions: questions.length > 0 ? questions : createFallbackQuestions() });
  } catch (err) {
    console.error("❌ Quiz error:", err.message);
    res.status(500).json({ error: `Quiz failed: ${err.message}` });
  }
});

function createFallbackQuestions() {
  return [
    {
      question: "Review the document content to generate real quiz questions",
      options: ["Upload a PDF with content", "Try again", "Check connection", "Refresh page"],
      correct: 0
    }
  ];
}

// Generate Concept Graph
app.post("/generate-concept-graph", async (req, res) => {
  try {
    if (!chunks.length) {
      return res.json({ nodes: [], edges: [] });
    }

    const context = chunks.slice(0, 3).join("\n\n").substring(0, 2000);

    console.log("🔗 Generating concept graph...");
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Extract 5-8 key concepts and connections. Return ONLY valid JSON. No extra text." },
          { role: "user", content: `From:\n${context}\n\nReturn: {"nodes":[{"id":1,"label":"concept","type":"main"}],"edges":[{"source":1,"target":2}]}` }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    let content = response.data.choices[0].message.content.trim();
    console.log("Raw response:", content);
    
    let graph = { nodes: [], edges: [] };
    try {
      content = content.replace(/```json\n?|\n?```/g, '').trim();
      graph = JSON.parse(content);
    } catch (parseErr) {
      console.error("JSON parse failed, extracting object...");
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        graph = JSON.parse(jsonMatch[0]);
      }
    }

    console.log("✅ Graph generated:", graph.nodes?.length, "nodes");
    res.json(graph);
  } catch (err) {
    console.error("❌ Graph error:", err.message);
    res.status(500).json({ error: `Graph failed: ${err.message}` });
  }
});

// Generate Flashcards
app.post("/generate-flashcards", async (req, res) => {
  try {
    if (!chunks.length) {
      return res.json({ flashcards: [] });
    }

    const context = chunks.slice(0, 3).join("\n\n").substring(0, 2000);

    console.log("📚 Generating flashcards...");
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Generate 5 flashcard pairs. Return ONLY valid JSON array. No extra text." },
          { role: "user", content: `From:\n${context}\n\nReturn JSON: [{"front":"Question?","back":"Answer"}]` }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    let content = response.data.choices[0].message.content.trim();
    console.log("Raw response:", content);
    
    let flashcards = [];
    try {
      content = content.replace(/```json\n?|\n?```/g, '').trim();
      flashcards = JSON.parse(content);
    } catch (parseErr) {
      console.error("JSON parse failed, extracting array...");
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0]);
      }
    }

    console.log("✅ Flashcards generated:", flashcards.length, "cards");
    res.json({ flashcards });
  } catch (err) {
    console.error("❌ Flashcards error:", err.message);
    res.status(500).json({ error: `Flashcards failed: ${err.message}` });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
