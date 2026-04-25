const pdfParse = require("pdf-parse");
const pdfjsLib = require("pdfjs-dist");
const path = require("path");
const fs = require("fs");

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(
  path.dirname(require.resolve("pdfjs-dist/package.json")),
  "build",
  "pdf.worker.min.js"
);

console.log("Worker path:", pdfjsLib.GlobalWorkerOptions.workerSrc);
console.log("Worker exists:", fs.existsSync(pdfjsLib.GlobalWorkerOptions.workerSrc));

// Test with a simple PDF buffer
async function test() {
  try {
    // This is a minimal PDF in hex
    const minimalPDF = Buffer.from(
      "255044462d312e340a25e2e3cfd30a312030206f626a0a3c3c2f547970652f4361746c6f672f50616765732031203020523e3e0a656e646f626a0a322030206f626a0a3c3c2f547970652f50616765732f4b6964735b332030205d2f436f756e7420313e3e0a656e646f626a0a332030206f626a0a3c3c2f547970652f506167652f506172656e74203220302052202f5265736f75726365733c3c2f466f6e743c3c2f46313c3c2f547970652f466f6e742f537562747970652f547970654f6e652f42617365466f6e742f48656c7665746963613e3e3e3e3e2f4d65646961426f7820235b302030203631322037323535d0a2f436f6e74656e74732034203020523e3e0a656e646f626a0a342030206f626a0a3c3c2f4c656e677468203434203e3e0a737472656d0a424540f20a2f46312031322054660a28546573742050DF2054657874290a45540a656e64737472656d0a656e646f626a0a787265660a302035200a303030303030303030302036353533352066200a303030303030303037372030303030302066200a303030303031343630203030303030206e200a303030303031373033203030303030206e200a303030303030303030203030303030206e0a747261696c65720a3c3c2f53697a6520352f526f6f7420312030205230a3e3e0a73746172747872656620300a2525454f46",
      "hex"
    );

    console.log("\n✅ Testing pdfParse...");
    const data = await pdfParse(minimalPDF);
    console.log("✅ pdfParse success:", data.numpages, "pages");
    console.log("Text extracted:", data.text.substring(0, 100));

    console.log("\n✅ Testing pdfjs...");
    const loadingTask = pdfjsLib.getDocument({ data: minimalPDF });
    const pdf = await loadingTask.promise;
    console.log("✅ pdfjs success:", pdf.numPages, "pages");

  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err.stack);
  }
}

test();
