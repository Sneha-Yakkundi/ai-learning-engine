const axios = require("axios");
const fs = require("fs");

const API_URL = "http://localhost:5000";

async function testEndpoints() {
  try {
    console.log("\n📋 Testing new endpoints...\n");

    // First, upload a test PDF
    console.log("1️⃣  Uploading test PDF...");
    const pdfPath = "test-valid-pdf.pdf";
    if (!fs.existsSync(pdfPath)) {
      console.log("❌ Test PDF not found. Creating dummy PDF for testing...");
      // For now just test with mock data
      console.log("Skipping upload, will test endpoints assuming PDF already uploaded\n");
    } else {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(pdfPath));
      
      const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
        headers: formData.getHeaders()
      });
      console.log("✅ PDF uploaded:", uploadRes.data);
    }

    // Test Summary
    console.log("\n2️⃣  Testing /generate-summary...");
    try {
      const summaryRes = await axios.post(`${API_URL}/generate-summary`);
      console.log("✅ Summary:", summaryRes.data.summary?.substring(0, 100) + "...");
    } catch (err) {
      console.log("❌ Summary error:", err.response?.data || err.message);
    }

    // Test Quiz
    console.log("\n3️⃣  Testing /generate-quiz...");
    try {
      const quizRes = await axios.post(`${API_URL}/generate-quiz`);
      console.log("✅ Quiz questions:", quizRes.data.questions?.length || 0);
      if (quizRes.data.questions?.length > 0) {
        console.log("   Q:", quizRes.data.questions[0].question?.substring(0, 50) + "...");
      }
    } catch (err) {
      console.log("❌ Quiz error:", err.response?.data || err.message);
    }

    // Test Concept Graph
    console.log("\n4️⃣  Testing /generate-concept-graph...");
    try {
      const graphRes = await axios.post(`${API_URL}/generate-concept-graph`);
      console.log("✅ Graph nodes:", graphRes.data.nodes?.length || 0);
      console.log("   Edges:", graphRes.data.edges?.length || 0);
    } catch (err) {
      console.log("❌ Graph error:", err.response?.data || err.message);
    }

    // Test Flashcards
    console.log("\n5️⃣  Testing /generate-flashcards...");
    try {
      const flashRes = await axios.post(`${API_URL}/generate-flashcards`);
      console.log("✅ Flashcards:", flashRes.data.flashcards?.length || 0);
      if (flashRes.data.flashcards?.length > 0) {
        console.log("   Q:", flashRes.data.flashcards[0].front?.substring(0, 50) + "...");
      }
    } catch (err) {
      console.log("❌ Flashcards error:", err.response?.data || err.message);
    }

    console.log("\n✅ All tests completed!\n");
  } catch (err) {
    console.error("❌ Test error:", err.message);
  }
}

testEndpoints();
