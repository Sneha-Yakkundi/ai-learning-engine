const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { PDFDocument } = require("pdf-lib");
const { rgb } = require("pdf-lib");

// Create a real, valid PDF with proper content using pdf-lib
async function createRealPDF() {
  const pdfDoc = await PDFDocument.create();

  // Add multiple pages with content
  const page1 = pdfDoc.addPage([600, 800]);
  page1.drawText("Machine Learning Basics", {
    x: 50,
    y: 750,
    size: 20,
    color: rgb(0, 0, 0)
  });

  page1.drawText(
    "Machine learning is a subset of artificial intelligence. " +
    "It focuses on the development of algorithms and statistical models " +
    "that enable computers to improve their performance on tasks through experience. " +
    "There are several types of machine learning approaches. " +
    "The field has grown exponentially over the past decade. " +
    "Recent advances in deep learning have revolutionized many applications.",
    {
      x: 50,
      y: 700,
      size: 12,
      maxWidth: 500,
      lineHeight: 15
    }
  );

  // Add second page
  const page2 = pdfDoc.addPage([600, 800]);
  page2.drawText("Types of Machine Learning", {
    x: 50,
    y: 750,
    size: 18,
    color: rgb(0, 0, 0)
  });

  page2.drawText(
    "Supervised Learning: Learning from labeled data. The algorithm learns to map inputs to outputs. " +
    "Examples include classification and regression tasks. This is the most common type of machine learning. " +
    "Unsupervised Learning: Learning from unlabeled data. The algorithm discovers patterns and structures. " +
    "Examples include clustering and dimensionality reduction. " +
    "Reinforcement Learning: Learning through interaction with an environment. " +
    "The algorithm learns to take actions that maximize rewards. " +
    "This approach is used in robotics and game playing AI.",
    {
      x: 50,
      y: 650,
      size: 12,
      maxWidth: 500,
      lineHeight: 15
    }
  );

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync("valid-test.pdf", pdfBytes);
  console.log("✅ Created valid PDF with 2 pages");
}

async function testUpload() {
  try {
    console.log("📝 Creating valid PDF with content...");
    await createRealPDF();

    console.log("\n📤 Testing upload...");
    
    const form = new FormData();
    form.append("file", fs.createReadStream("valid-test.pdf"));

    const response = await axios.post(
      "http://localhost:5000/upload",
      form,
      { 
        headers: form.getHeaders(),
        timeout: 10000
      }
    );

    console.log("✅ Upload Success!");
    console.log("   Message:", response.data.message);
    console.log("   Chunks extracted:", response.data.chunks);
    console.log("   Text length:", response.data.textLength, "characters");
    
    if (response.data.chunks > 0) {
      console.log("\n🎉 PDF parsed successfully!");
    }
  } catch (error) {
    if (error.response?.data) {
      console.error("❌ Server Error:", error.response.data);
    } else {
      console.error("❌ Error:", error.message);
    }
  }
}

testUpload();
