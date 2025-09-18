import React, { useState, useEffect } from 'react';
import { processchequeImage } from '../utils/ocrUtils';
import { truncateText, formatCurrency } from '../utils/formatters';

const OCRProcessor = ({ imageFile, onProcessingComplete }) => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ status: '', progress: 0 });
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (imageFile) {
      processImage();
    }
  }, [imageFile]);

  const processImage = async () => {
    setProcessing(true);
    setProgress({ status: 'Initializing OCR...', progress: 0 });
    setResult(null);

    try {
      const ocrResult = await processchequeImage(imageFile, (m) => {
        if (m.status === 'recognizing text') {
          setProgress({
            status: 'Reading cheque data...',
            progress: Math.round(m.progress * 100)
          });
        }
      });

      setResult(ocrResult);
      setProcessing(false);
      
      // Pass result back to parent component
      onProcessingComplete(ocrResult);

    } catch (error) {
      console.error('Processing error:', error);
      setResult({
        success: false,
        error: 'Failed to process image. Please try again.',
        rawText: '',
        parsedData: null
      });
      setProcessing(false);
    }
  };

  const retryProcessing = () => {
    if (imageFile) {
      processImage();
    }
  };

  if (!imageFile) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">
        OCR Processing Results
      </h2>

      {processing && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">Processing Cheque Image</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-blue-700 text-sm">{progress.status}</p>
            <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
            <p className="text-blue-600 text-xs text-right">{progress.progress}%</p>
          </div>
        </div>
      )}

      {result && !processing && (
        <div className="space-y-6">
          {result.success ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-green-600 text-xl">✅</span>
                <h3 className="text-lg font-semibold text-green-800">
                  OCR Processing Complete
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Extracted Data */}
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">Extracted Cheque Data:</h4>
                  <div className="bg-white rounded-lg border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Amount:</span>
                      <span className="font-medium">
                        {result.parsedData.amount ? formatCurrency(result.parsedData.amount) : 'Not found'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">cheque Number:</span>
                      <span className="font-medium">
                        {result.parsedData.chequeNumber || 'Not found'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Payer Name:</span>
                      <span className="font-medium">
                        {result.parsedData.payerName || 'Not found'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Memo:</span>
                      <span className="font-medium">
                        {result.parsedData.memo || 'Not found'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Date:</span>
                      <span className="font-medium">
                        {result.parsedData.date || 'Not found'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Raw OCR Text */}
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">Raw OCR Text:</h4>
                  <div className="bg-slate-50 rounded-lg border p-4">
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {truncateText(result.rawText, 500)}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p>Confidence Level: {Math.round(result.confidence)}%</p>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-red-600 text-xl">❌</span>
                <h3 className="text-lg font-semibold text-red-800">
                  Processing Failed
                </h3>
              </div>
              
              <p className="text-red-700 mb-4">
                {result.error || 'Unable to process the cheque image. Please try with a clearer image.'}
              </p>
              
              <button
                onClick={retryProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Retry Processing
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OCRProcessor;