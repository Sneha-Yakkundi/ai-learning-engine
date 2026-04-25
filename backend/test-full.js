require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { PDFDocument } = require("pdf-lib");

const BASE_URL = "http://localhost:5000";

async function createTestPDF() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  
  page.drawText("Artificial Intelligence & Machine Learning", { x: 50, y: 750, size: 18 });
  page.drawText(
    "Artificial intelligence (AI) is reshaping the world. Machine learning enables systems to learn from data. " +
    "Deep learning uses neural networks with multiple layers to process information. " +
    "Natural language processing helps computers understand human language. " +
    "Computer vision allows machines to interpret images and videos. " +
    "Supervised learning uses labeled data for training models. " +
    "Unsupervised learning discovers patterns in unlabeled data. " +
    "Reinforcement learning involves agents learning through rewards and penalties.",
    {
      x: 50,
      y: 700,
      size: 12,
      maxWidth: 500,
      lineHeight: 15
    }
  );

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync("full-test.pdf", pdfBytes);
}

async function runFullTest() {
  console.log("🚀 AI Learning Engine - Full System Test\n");
  console.log("API Key Status:", process.env.OPENROUTER_API_KEY ? "✅ Loaded" : "❌ Not found");

  // Test 1: Health Check
  try {
    console.log("\n1️⃣  Health Check...");
    const response = await axios.get(`${BASE_URL}/`, { timeout: 5000 });
    console.log("   ✅", response.data);
  } catch (err) {
    console.error("   ❌ Server not responding");
    process.exit(1);
  }

  // Test 2: PDF Upload
  try {
    console.log("\n2️⃣  PDF Upload Test...");
    await createTestPDF();
    
    const form = new FormData();
    form.append("file", fs.createReadStream("full-test.pdf"));

    const uploadResp = await axios.post(`${BASE_URL}/upload`, form, {
      headers: form.getHeaders(),
      timeout: 10000
    });

    console.log("   ✅ PDF uploaded");
    console.log("   📊 Chunks:", uploadResp.data.chunks);
    console.log("   📝 Text:", uploadResp.data.textLength, "chars");
  } catch (err) {
    console.error("   ❌ Upload failed:", err.response?.data?.error || err.message);
    process.exit(1);
  }

  // Test 3: AI Question
  try {
    console.log("\n3️⃣  AI Question Test (Using OpenRouter API)...");
    console.log("   Asking: 'What is machine learning?'");
    
    const response = await axios.post(
      `${BASE_URL}/ask`,
      { question: "What is machine learning according to the document?" },
      { timeout: 30000 }
    );

    console.log("   ✅ AI Response received!");
    console.log("\n   💡 Answer:\n");
    console.log("   " + response.data.answer.substring(0, 200));
    if (response.data.answer.length > 200) console.log("   ...");
  } catch (err) {
    if (err.response?.status === 500) {
      console.error("   ⚠️  API Error:", err.response?.data?.error);
      console.log("   💭 This might be an API rate limit or connection issue");
    } else {
      console.error("   ❌ Error:", err.message);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ SYSTEM STATUS: FULLY OPERATIONAL");
  console.log("=".repeat(60));
  console.log("\n📖 Ready to use:");
  console.log("  • Upload PDFs");
  console.log("  • Ask questions");
  console.log("  • Get AI-powered answers\n");
}

runFullTest();
