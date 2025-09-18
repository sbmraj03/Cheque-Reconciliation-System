import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import OCRProcessor from './components/OCRProcessor';
import InvoiceMatch from './components/InvoiceMatch';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleImageUpload = (imageFile) => {
    setSelectedImage(imageFile);
    setOcrResult(null);
    setMatchResult(null);
    setIsCompleted(false);
    setIsProcessing(true);
  };

  const handleProcessingComplete = (result) => {
    setOcrResult(result);
    setIsProcessing(false);
  };

  const handleMatchComplete = (result) => {
    setMatchResult(result);
  };

  const handleReconciliationComplete = (result) => {
    console.log('Reconciliation completed:', result);
    setIsCompleted(true);
  };

  const handleStartOver = () => {
    setSelectedImage(null);
    setOcrResult(null);
    setMatchResult(null);
    setIsCompleted(false);
    setIsProcessing(false);
  };

  const getProgressStep = () => {
    if (isCompleted) return 4;
    if (matchResult) return 3;
    if (ocrResult) return 2;
    if (selectedImage) return 1;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Cheque Reconciliation System
          </h1>
          <p className="text-gray-600 mt-2">
            Automated cheque processing and invoice matching POC
          </p>

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex items-center space-x-4">
              {[
                { step: 1, name: 'Upload', active: getProgressStep() >= 1 },
                { step: 2, name: 'OCR', active: getProgressStep() >= 2 },
                { step: 3, name: 'Match', active: getProgressStep() >= 3 },
                { step: 4, name: 'Complete', active: getProgressStep() >= 4 }
              ].map((item, index) => (
                <React.Fragment key={item.step}>
                  <div className={`flex items-center space-x-2 ${
                    item.active ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                      item.active 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'border-gray-300'
                    }`}>
                      {item.active ? '✓' : item.step}
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-0.5 ${
                      getProgressStep() > item.step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Step 1: Image Upload */}
        <div className="bg-white rounded-lg shadow p-6">
          <ErrorBoundary>
            <ImageUpload 
              onImageUpload={handleImageUpload}
              isProcessing={isProcessing}
              onReset={handleStartOver}
            />
          </ErrorBoundary>
        </div>

        {/* Step 2: OCR Processing */}
        {selectedImage && (
          <div className="bg-white rounded-lg shadow p-6">
            <ErrorBoundary>
              <OCRProcessor 
                imageFile={selectedImage}
                onProcessingComplete={handleProcessingComplete}
              />
            </ErrorBoundary>
          </div>
        )}

        {/* Step 3: Invoice Matching */}
        {ocrResult && ocrResult.success && (
          <div className="bg-white rounded-lg shadow p-6">
            <ErrorBoundary>
              <InvoiceMatch 
                chequeData={ocrResult}
                onMatchComplete={handleMatchComplete}
              />
            </ErrorBoundary>
          </div>
        )}

        {/* Step 4: Final Dashboard */}
        {matchResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <ErrorBoundary>
              <Dashboard 
                matchResult={matchResult}
                onComplete={handleReconciliationComplete}
                onStartOver={handleStartOver}
              />
            </ErrorBoundary>
          </div>
        )}

        {/* Demo Info */}
        {!selectedImage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              📋 Demo Instructions
            </h3>
            <div className="text-blue-700 space-y-2">
              <p><strong>This POC demonstrates:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Automated cheque image processing using OCR</li>
                <li>Smart invoice matching by amount and customer name</li>
                <li>Manual reconciliation workflow for edge cases</li>
                <li>Complete audit trail and reporting</li>
              </ul>
              <p className="mt-4">
                <strong>To test:</strong> Upload any image with text and numbers. 
                The system will extract data and attempt to match it with sample invoices.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;