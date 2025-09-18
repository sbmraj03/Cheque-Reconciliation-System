import React, { useState, useEffect } from 'react';
import { findInvoiceByAmount, findInvoiceByCustomer, sampleInvoices } from '../data/sampleInvoices';
import { formatCurrency } from '../utils/formatters';

const InvoiceMatch = ({ chequeData, onMatchComplete }) => {
  const [matchResult, setMatchResult] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [manualMatch, setManualMatch] = useState(false);

  useEffect(() => {
    if (chequeData && chequeData.success && chequeData.parsedData) {
      performAutoMatch();
    }
  }, [chequeData]);

  const performAutoMatch = () => {
    const parsed = chequeData.parsedData;
    let match = null;
    let matchType = 'none';
    let confidence = 0;

    // Try to match by amount first (most reliable)
    if (parsed.amount) {
      match = findInvoiceByAmount(parsed.amount);
      if (match) {
        matchType = 'amount';
        confidence = 90;
      }
    }

    // If no amount match, try customer name
    if (!match && parsed.payerName) {
      match = findInvoiceByCustomer(parsed.payerName);
      if (match) {
        matchType = 'customer';
        confidence = 70;
      }
    }

    const result = {
      success: Boolean(match),
      matchType,
      confidence,
      matchedInvoice: match || null,
      extractedData: parsed,
      suggestions: match ? [] : getSuggestions(parsed)
    };

    setMatchResult(result);
    onMatchComplete(result);
  };

  const getSuggestions = (parsed) => {
    // Find similar amounts (within Rs.50)
    const suggestions = [];
    
    if (parsed.amount) {
      const similarAmounts = sampleInvoices.filter(invoice => 
        invoice.status === 'pending' && 
        Math.abs(invoice.amount - parsed.amount) <= 50
      );
      suggestions.push(...similarAmounts);
    }

    // Remove duplicates and limit to 3
    return suggestions.slice(0, 3);
  };

  const handleManualMatch = (invoice) => {
    setSelectedInvoice(invoice);
    const manualResult = {
      success: true,
      matchType: 'manual',
      confidence: 100,
      matchedInvoice: invoice,
      extractedData: chequeData.parsedData,
      suggestions: []
    };
    setMatchResult(manualResult);
    onMatchComplete(manualResult);
  };

  const handleReject = () => {
    const rejectedResult = {
      success: false,
      matchType: 'rejected',
      confidence: 0,
      matchedInvoice: null,
      extractedData: chequeData.parsedData,
      suggestions: [],
      status: 'needs_review'
    };
    setMatchResult(rejectedResult);
    onMatchComplete(rejectedResult);
  };

  if (!chequeData || !chequeData.success) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">
        Invoice Matching
      </h2>

      {matchResult && (
        <div className="space-y-6">
          
          {/* Match Result */}
          {matchResult.success ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-green-600 text-xl">✅</span>
                <h3 className="text-lg font-semibold text-green-800">
                  Invoice Match Found!
                </h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  {matchResult.confidence}% confidence
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* cheque Data */}
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">Cheque Information:</h4>
                  <div className="bg-white rounded-lg border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Amount:</span>
                      <span className="font-medium">{formatCurrency(matchResult.extractedData.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Payer:</span>
                      <span className="font-medium">
                        {matchResult.extractedData.payerName || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cheque #:</span>
                      <span className="font-medium">
                        {matchResult.extractedData.chequeNumber || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Memo:</span>
                      <span className="font-medium">
                        {matchResult.extractedData.memo || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Matched Invoice */}
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">Matched Invoice:</h4>
                  <div className="bg-white rounded-lg border p-4 space-y-2">
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
                      <span className="text-slate-600">Date:</span>
                      <span className="font-medium">{matchResult.matchedInvoice.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Description:</span>
                      <span className="font-medium">{matchResult.matchedInvoice.description}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Match Type: {matchResult.matchType}
                </span>
                {matchResult.matchType === 'manual' && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                    Manually Selected
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-yellow-600 text-xl">⚠️</span>
                <h3 className="text-lg font-semibold text-yellow-800">
                  No Automatic Match Found
                </h3>
              </div>

              <p className="text-yellow-700 mb-4">
                Unable to automatically match this cheque with existing invoices. 
                Please review the suggestions below or select an invoice manually.
              </p>

              {/* Suggestions */}
              {matchResult.suggestions.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-slate-800 mb-3">Possible Matches:</h4>
                  <div className="space-y-2">
                    {matchResult.suggestions.map(invoice => (
                      <div key={invoice.id} className="bg-white rounded-lg border p-3 flex justify-between items-center">
                        <div>
                          <span className="font-medium">{invoice.id}</span> - 
                          <span className="ml-2">{invoice.customerName}</span>
                          <span className="ml-2 text-gray-600">({formatCurrency(invoice.amount)})</span>
                        </div>
                        <button
                          onClick={() => handleManualMatch(invoice)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm shadow-sm"
                        >
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual Selection */}
              <div className="mb-4">
                <h4 className="font-medium text-slate-800 mb-3">All Pending Invoices:</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {sampleInvoices.filter(inv => inv.status === 'pending').map(invoice => (
                    <div key={invoice.id} className="bg-white rounded-lg border p-2 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium">{invoice.id}</span> - 
                        <span className="ml-2">{invoice.customerName}</span>
                        <span className="ml-2 text-gray-600">({formatCurrency(invoice.amount)})</span>
                      </div>
                      <button
                        onClick={() => handleManualMatch(invoice)}
                        className="px-2 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xs shadow-sm"
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm"
                >
                  Mark for Manual Review
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceMatch;