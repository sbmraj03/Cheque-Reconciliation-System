import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

const Dashboard = ({ matchResult, onComplete, onStartOver }) => {
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleComplete = async () => {
    setProcessing(true);
    
    // Simulate API call to update invoice status
    setTimeout(() => {
      const completedResult = {
        ...matchResult,
        status: 'completed',
        completedAt: new Date().toISOString(),
        notes: notes,
        processingTime: '45 seconds' // Mock processing time
      };
      
      onComplete(completedResult);
      setProcessing(false);
    }, 1000);
  };

  if (!matchResult) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">
        Reconciliation Summary
      </h2>

      <div className="space-y-6">
        
        {/* Status Overview */}
        <div className={`rounded-xl p-6 ${
          matchResult.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className={`text-2xl ${
                matchResult.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {matchResult.success ? '✅' : '❌'}
              </span>
              <h3 className={`text-xl font-semibold ${
                matchResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {matchResult.success ? 'Cheque Successfully Reconciled' : 'Cheque Requires Manual Review'}
              </h3>
            </div>
            
            {matchResult.success && (
              <div className="text-right">
                <div className={`px-3 py-1 rounded text-sm font-medium ${
                  matchResult.confidence >= 90 
                    ? 'bg-green-100 text-green-800'
                    : matchResult.confidence >= 70
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {matchResult.confidence}% Confidence
                </div>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm ring-1 ring-slate-200/60">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(matchResult.extractedData.amount) || '$0.00'}</div>
              <div className="text-sm text-gray-600">Cheque Amount</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center shadow-sm ring-1 ring-slate-200/60">
              <div className="text-2xl font-bold text-purple-600">
                {matchResult.matchType}
              </div>
              <div className="text-sm text-gray-600">Match Type</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center shadow-sm ring-1 ring-slate-200/60">
              <div className="text-2xl font-bold text-orange-600">45s</div>
              <div className="text-sm text-gray-600">Processing Time</div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="bg-white rounded-xl shadow-md ring-1 ring-slate-200/60 p-6">
          <h4 className="font-semibold text-slate-800 mb-4">Transaction Details</h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cheque Information */}
            <div>
              <h5 className="font-medium text-slate-700 mb-3">Cheque Information</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-medium">${matchResult.extractedData.amount?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Cheque Number:</span>
                  <span className="font-medium">{matchResult.extractedData.chequeNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payer Name:</span>
                  <span className="font-medium">{matchResult.extractedData.payerName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Memo:</span>
                  <span className="font-medium">{matchResult.extractedData.memo || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span className="font-medium">{matchResult.extractedData.date || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Invoice Information */}
            <div>
              <h5 className="font-medium text-slate-700 mb-3">
                {matchResult.success ? 'Matched Invoice' : 'Invoice Status'}
              </h5>
              {matchResult.success && matchResult.matchedInvoice ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Invoice ID:</span>
                    <span className="font-medium">{matchResult.matchedInvoice.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Customer:</span>
                    <span className="font-medium">{matchResult.matchedInvoice.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-medium">{formatCurrency(matchResult.matchedInvoice.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Invoice Date:</span>
                    <span className="font-medium">{matchResult.matchedInvoice.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Description:</span>
                    <span className="font-medium">{matchResult.matchedInvoice.description}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  No invoice matched. This cheque will be flagged for manual review.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-xl shadow-md ring-1 ring-slate-200/60 p-6">
          <h4 className="font-semibold text-slate-800 mb-4">Additional Notes</h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about this transaction..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={onStartOver}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Process Another Cheque
          </button>

          <div className="space-x-3">
            {matchResult.success ? (
              <button
                onClick={handleComplete}
                disabled={processing}
                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2 shadow-sm"
              >
                {processing && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{processing ? 'Completing...' : 'Complete Reconciliation'}</span>
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={processing}
                className="px-8 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                Mark for Review
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {matchResult.status === 'completed' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">ℹ️</span>
              <p className="text-blue-800">
                {matchResult.success 
                  ? 'Cheque has been successfully reconciled and the invoice has been marked as paid.'
                  : 'Cheque has been flagged for manual review and added to the pending queue.'
                }
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;