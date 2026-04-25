const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { PDFDocument } = require("pdf-lib");

const BASE_URL = "http://localhost:5000";

// Create PDF with content
async function createTestPDF() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  
  page.drawText("AI Learning Engine Test", { x: 50, y: 750, size: 18 });
  page.drawText(
    "This is a test document for the AI Learning Engine. " +
    "Artificial intelligence is transforming industries worldwide. " +
    "Machine learning models can predict trends, classify data, and automate tasks. " +
    "Deep learning uses neural networks with multiple layers. " +
    "NLP processes human language. " +
    "Computer vision analyzes images and videos.",
    {
      x: 50,
      y: 700,
      size: 12,
      maxWidth: 500,
      lineHeight: 15
    }
  );

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync("verify-test.pdf", pdfBytes);
}

async function runTests() {
  console.log("🧪 Running AI Learning Engine Tests\n");

  // Test 1: Health Check
  try {
    console.log("1️⃣  Testing health endpoint...");
    const response = await axios.get(`${BASE_URL}/`);
    console.log("   ✅ Server is running:", response.data);
  } catch (err) {
    console.error("   ❌ Server not running:", err.message);
    process.exit(1);
  }

  // Test 2: PDF Upload
  try {
    console.log("\n2️⃣  Creating test PDF...");
    await createTestPDF();
    console.log("   ✅ PDF created");

    console.log("\n3️⃣  Testing PDF upload...");
    const form = new FormData();
    form.append("file", fs.createReadStream("verify-test.pdf"));

    const uploadResponse = await axios.post(
      `${BASE_URL}/upload`,
      form,
      { headers: form.getHeaders() }
    );

    console.log("   ✅ Upload successful!");
    console.log("   📊 Chunks extracted:", uploadResponse.data.chunks);
    console.log("   📝 Text length:", uploadResponse.data.textLength, "chars");
  } catch (err) {
    console.error("   ❌ Upload failed:", err.response?.data || err.message);
    process.exit(1);
  }

  // Test 3: Ask Question
  try {
    console.log("\n4️⃣  Testing AI question endpoint...");
    
    if (!process.env.OPENROUTER_API_KEY) {
      console.log("   ⚠️  OPENROUTER_API_KEY not set - skipping AI test");
      console.log("   To enable: Add OPENROUTER_API_KEY to .env file");
    } else {
      const askResponse = await axios.post(
        `${BASE_URL}/ask`,
        { question: "What is artificial intelligence?" }
      );

      console.log("   ✅ AI response received!");
      console.log("   💡 Answer:", askResponse.data.answer.substring(0, 100) + "...");
    }
  } catch (err) {
    console.error("   ⚠️  AI test failed:", err.response?.data || err.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Core functionality is working!");
  console.log("=".repeat(60));
  
  console.log("\n📚 API Endpoints:\n");
  console.log("GET  http://localhost:5000/");
  console.log("     → Health check\n");
  
  console.log("POST http://localhost:5000/upload");
  console.log("     → Upload PDF file");
  console.log("     → Returns: { message, chunks, textLength }\n");
  
  console.log("POST http://localhost:5000/ask");
  console.log("     → Ask question about uploaded PDF");
  console.log("     → Body: { question: 'Your question here' }");
  console.log("     → Returns: { answer }\n");

  console.log("🎯 Next steps:");
  console.log("1. Upload your PDF");
  console.log("2. Ask questions about it");
  console.log("3. Get AI-powered answers from the content\n");
}

runTests();
