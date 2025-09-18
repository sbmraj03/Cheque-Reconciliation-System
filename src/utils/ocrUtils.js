import Tesseract from 'tesseract.js';

// Runs Tesseract OCR on a provided image File/Blob and returns raw text plus parsed fields.
// Accepts an optional onProgress callback to surface worker progress to UI.
export const processchequeImage = async (imageFile, onProgress) => {
  try {
    const result = await Tesseract.recognize(imageFile, 'eng', {
      logger: m => {
        if (onProgress) {
          onProgress(m);
        }
        console.log(m);
      }
    });

    const extractedText = result.data.text;
    console.log('Extracted text:', extractedText);

    // Parse the extracted text to find relevant information
    const chequeData = parsechequeData(extractedText);
    
    return {
      success: true,
      rawText: extractedText,
      parsedData: chequeData,
      confidence: result.data.confidence
    };

  } catch (error) {
    console.error('OCR Error:', error);
    return {
      success: false,
      error: error.message,
      rawText: '',
      parsedData: null
    };
  }
};

// Heuristic parser for common fields found on cheques.
// This is deliberately tolerant: it attempts to extract amount, cheque number,
// memo, payer name, and date using regexes and simple rules.
const parsechequeData = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Initialize cheque data
  const chequeData = {
    amount: null,
    chequeNumber: null,
    memo: null,
    payerName: null,
    date: null
  };

  // Look for amount patterns
  const amountPattern = /\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
  const amounts = [];
  let match;
  
  while ((match = amountPattern.exec(text)) !== null) {
    const amount = parseFloat(match[1].replace(/,/g, ''));
    if (amount > 0 && amount < 100000) { // Reasonable cheque amount range
      amounts.push(amount);
    }
  }

  // The largest amount is likely the cheque amount
  if (amounts.length > 0) {
    chequeData.amount = Math.max(...amounts);
  }

  // Look for cheque number (usually appears near "No." or similar)
  const chequeNumPattern = /(?:no\.?|#)\s*(\d{3,6})/i;
  const chequeNumMatch = text.match(chequeNumPattern);
  if (chequeNumMatch) {
    chequeData.chequeNumber = chequeNumMatch[1];
  }

  // Look for memo line (usually appears after "memo" or "for")
  const memoPattern = /(?:memo|for|re):\s*(.+?)(?:\n|$)/i;
  const memoMatch = text.match(memoPattern);
  if (memoMatch) {
    chequeData.memo = memoMatch[1].trim();
  }

  // Try to extract payer name (usually one of the first readable lines)
  for (let line of lines) {
    // Skip lines that look like addresses, amounts, or cheque numbers
    if (!/^\d+$|^\$|street|ave|road|drive|blvd|\d{5}|\d{4}-\d{4}/i.test(line) && line.length > 3) {
      if (!chequeData.payerName && /^[a-zA-Z\s]{3,}$/.test(line)) {
        chequeData.payerName = line;
        break;
      }
    }
  }

  // Look for date patterns
  const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
  const dateMatch = text.match(datePattern);
  if (dateMatch) {
    chequeData.date = dateMatch[1];
  }

  return chequeData;
};