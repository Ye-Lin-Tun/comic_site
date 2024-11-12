async function pdf2img(inputPDF, outputDir) {
    const { fromPath } = require("pdf2pic");
    const fs = require("fs");
    const path = require("path");
  
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  
    try {
      // Check if the PDF file exists
      if (!fs.existsSync(inputPDF)) {
        return { status: false, msg: "PDF does not exist!" };
      }
  
      // Set up the pdf2pic conversion options
      const convert = fromPath(inputPDF, {
        density: 300,         // Image resolution (DPI)
        saveFilename: "page", // Output file prefix
        savePath: outputDir,  // Directory to store images
        format: "png",        // Output format
        width: 1200,          // Resize width to 1200 pixels
      });
  
      let page = 1;
      let result;
      let convertedPages = [];
  
      // Convert each page until no more pages are found
      while (true) {
        try {
          result = await convert(page);
          if (!result || !fs.existsSync(result.path)) {
            console.log(`No more pages after page ${page - 1}`);
            break;  // Stop if no result for the current page
          }
          console.log(`Page ${page} converted: ${result.path}`);
          convertedPages.push(result.path);  // Track converted pages
          page++;
        } catch (conversionError) {
          console.log(`Error converting page ${page}:`, conversionError.message);
          return { status: false, msg: `Error on page ${page}: ${conversionError.message}` };
        }
      }
  
      // Check if any images were generated
      if (convertedPages.length === 0) {
        return { status: false, msg: "Failed to convert any pages!" };
      }
  
      return { status: true, msg: "PDF successfully converted to images!", files: convertedPages };
    } catch (err) {
      console.log(err);
      return { status: false, msg: err.message };
    }
  }
  
  // Example usage:
  pdf2img("./data/deadpool01.pdf", "./data/img").then((val) => {
    console.log(val);
  }).catch((err) => {
    console.log(err);
  });
  
  module.exports.pdf2img = pdf2img;
  