// Minimal test - no dotenv
const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("1️⃣ File received:", req.file.originalname);
    
    const buffer = fs.readFileSync(req.file.path);
    console.log("2️⃣ Buffer size:", buffer.length);

    const { PDFParse } = require("pdf-parse");
    console.log("3️⃣ PDFParse imported");
    
    const parser = new PDFParse({ data: buffer });
    console.log("4️⃣ Parser created");
    
    const result = await parser.getText();
    console.log("5️⃣ Text extracted:", result.text.substring(0, 50));

    fs.unlinkSync(req.file.path);
    res.json({ text: result.text.substring(0, 100) });
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5001, () => console.log("Test server on :5001"));
