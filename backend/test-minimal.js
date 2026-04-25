const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

async function testMinimal() {
  const form = new FormData();
  form.append("file", fs.createReadStream("test.pdf"));
  
  try {
    const res = await axios.post("http://localhost:5001/upload", form, { 
      headers: form.getHeaders() 
    });
    console.log("✅ SUCCESS:", res.data);
  } catch (err) {
    console.error("❌ FAILED:", err.response?.data || err.message);
  }
}

testMinimal();
