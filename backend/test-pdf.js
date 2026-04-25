const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

// Create a minimal PDF for testing
const { PDFDocument } = require("pdf-lib");

async function createTestPDF() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  page.drawText("Hello World - Test PDF", { x: 50, y: 350 });
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync("test.pdf", pdfBytes);
}

async function testUpload() {
  try {
    await createTestPDF();
    console.log("Created test.pdf");

    const form = new FormData();
    form.append("file", fs.createReadStream("test.pdf"));

    const response = await axios.post(
      "http://localhost:5000/upload",
      form,
      { headers: form.getHeaders() }
    );

    console.log("✅ Upload Success:", response.data);
  } catch (error) {
    console.error("❌ Upload Failed:", error.response?.data || error.message);
  }
}

testUpload();
