const { PDFParse } = require("pdf-parse");

// Takes a Cloudinary PDF URL, returns extracted text
const extractTextFromPDF = async (fileUrl) => {
  let parser;
  try {
    // pdf-parse v2 can fetch directly from a URL
    parser = new PDFParse({ url: fileUrl });

    const result = await parser.getText();

    return result.text;
  } catch (error) {
    console.log("PDF EXTRACTION ERROR:", error);
    throw new Error("Failed to extract text from PDF");
  } finally {
    if (parser) {
      await parser.destroy(); // cleanup, recommended by the library
    }
  }
};

module.exports = extractTextFromPDF;
