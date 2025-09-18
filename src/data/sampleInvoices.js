export const sampleInvoices = [
  {
    id: 'INV-001',
    customerName: 'Amit Sharma',
    amount: 12500.00,
    date: '2024-09-01',
    description: 'Electrical fittings',
    status: 'pending'
  },
  {
    id: 'INV-002',
    customerName: 'Priya Verma',
    amount: 28499.50,
    date: '2024-09-03',
    description: 'Plumbing materials',
    status: 'pending'
  },
  {
    id: 'INV-003',
    customerName: 'Rahul Singh',
    amount: 6999.00,
    date: '2024-09-05',
    description: 'Paint and brushes',
    status: 'pending'
  },
  {
    id: 'INV-004',
    customerName: 'Neha Gupta',
    amount: 45999.75,
    date: '2024-09-07',
    description: 'Garden tools',
    status: 'pending'
  },
  {
    id: 'INV-005',
    customerName: 'Vikram Iyer',
    amount: 13250.25,
    date: '2024-09-10',
    description: 'Electrical supplies',
    status: 'pending'
  }
];

// Helper function to find matching invoices by amount
export const findInvoiceByAmount = (amount, tolerance = 0.01) => {
  return sampleInvoices.find(invoice => 
    Math.abs(invoice.amount - amount) <= tolerance && 
    invoice.status === 'pending'
  );
};

// Helper function to find invoices by customer name (fuzzy match)
export const findInvoiceByCustomer = (customerName) => {
  if (!customerName) return null;
  
  const normalizedInput = customerName.toLowerCase().replace(/[^a-z\s]/g, '');
  
  return sampleInvoices.find(invoice => {
    const normalizedInvoiceCustomer = invoice.customerName.toLowerCase().replace(/[^a-z\s]/g, '');
    return normalizedInvoiceCustomer.includes(normalizedInput) || 
           normalizedInput.includes(normalizedInvoiceCustomer);
  });
};