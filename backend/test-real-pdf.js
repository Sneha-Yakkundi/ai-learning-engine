const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

// Download a real PDF to test with
async function downloadTestPDF() {
  try {
    console.log("📥 Downloading test PDF...");
    const response = await axios({
      method: "GET",
      url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-files/Table-of-contents.pdf",
      responseType: "arraybuffer",
      timeout: 10000
    });
    
    fs.writeFileSync("real-test.pdf", response.data);
    console.log("✅ Downloaded real PDF:", response.data.length, "bytes");
    return true;
  } catch (err) {
    console.log("⚠️  Could not download, using local PDF");
    return false;
  }
}

async function testUpload() {
  try {
    // First, try to download a real PDF
    const hasRealPDF = await downloadTestPDF();
    const pdfFile = hasRealPDF ? "real-test.pdf" : "test.pdf";
    
    if (!fs.existsSync(pdfFile)) {
      console.error("❌ No PDF file found!");
      return;
    }

    console.log(`\n📤 Testing upload with ${pdfFile}...`);
    
    const form = new FormData();
    form.append("file", fs.createReadStream(pdfFile));

    const response = await axios.post(
      "http://localhost:5000/upload",
      form,
      { 
        headers: form.getHeaders(),
        timeout: 10000
      }
    );

    console.log("✅ Upload Success:", response.data);
    
    if (response.data.chunks > 0) {
      console.log(`📊 Extracted ${response.data.chunks} chunks from PDF`);
    }
  } catch (error) {
    if (error.response?.data) {
      console.error("❌ Upload Error:", error.response.data);
    } else {
      console.error("❌ Error:", error.message);
    }
  }
}

// Start server first, wait a bit, then test
setTimeout(() => {
  testUpload();
}, 500);
