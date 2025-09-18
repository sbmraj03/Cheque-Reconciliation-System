import React, { useState, useRef } from 'react';

const ImageUpload = ({ onImageUpload, isProcessing, onReset }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Please select an image under 10MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setUploadedImage(previewUrl);

    // Pass file to parent component
    onImageUpload(file);
  };

  const handleButtonClick = () => {
    // Reset entire flow to initial state before picking a new file
    onReset?.();
    // small timeout ensures parent state resets before dialog opens
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const clearImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Also reset the parent wizard state
    onReset?.();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">
        Upload Cheque Image
      </h2>

      {!uploadedImage ? (
        <div
          className={`
            border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
            ${dragOver 
              ? 'border-blue-500 bg-blue-50 shadow-inner' 
              : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
            }
            ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="space-y-4">
            <div className="text-6xl text-gray-400">📷</div>
            <div>
              <p className="text-lg text-gray-600">
                {dragOver ? 'Drop your cheque image here' : 'Drag & drop your cheque image here'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                or click to browse files
              </p>
            </div>
            <div className="text-xs text-gray-400">
              Supports: JPG, PNG, GIF (Max 10MB)
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-slate-800">
                Uploaded Cheque Image
              </h3>
              <button
                onClick={clearImage}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
                disabled={isProcessing}
              >
                Remove
              </button>
            </div>
            
            <div className="max-w-md mx-auto">
              <img
                src={uploadedImage}
                alt="Uploaded cheque"
                className="w-full h-auto rounded-lg border shadow-sm"
              />
            </div>
          </div>

          {!isProcessing && (
            <div className="flex justify-center">
              <button
                onClick={handleButtonClick}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
              >
                Upload Different Cheque
              </button>
            </div>
          )}
        </div>
      )}

      {isProcessing && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Processing image...</span>
          </div>
        </div>
      )}

      {/* Keep file input mounted so the ref is always available */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;