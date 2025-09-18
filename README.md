**Live URL**: http://cheque-reconciliation-system.vercel.app

**Problem Statement (Documentation)**: [Open DOCUMENTATION.md](./DOCUMENTATION.md)

# Cheque Reconciliation System - POC

A proof-of-concept application demonstrating automated cheque processing and invoice reconciliation using OCR technology.


## 🚀 Solution Features

### Core Functionality
- **Image Upload**: Drag & drop or browse cheque images
- **OCR Processing**: Extract amount, cheque number, payer name, memo, and date
- **Smart Matching**: Automatically match cheques with pending invoices
- **Manual Override**: Handle edge cases with manual selection
- **Complete Dashboard**: Full reconciliation summary and audit trail

### Technical Highlights
- Client-side OCR using Tesseract.js (no API costs)
- Responsive React.js interface
- Real-time processing progress indicators
- Intelligent matching algorithms (amount and customer name)
- Exception handling for unmatched items

## 🛠️ Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **OCR**: Tesseract.js
- **Deployment**: Vercel
- **Libraries**: 
  - React hooks for state management
  - File handling APIs
  - Progress tracking

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sbmraj03/Cheque-Reconciliation-System.git
   cd Cheque-Reconciliation-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:5173`

## 🔧 Usage

1. **Upload cheque Image**: Drag and drop or click to browse for a cheque image
2. **OCR Processing**: Wait for automatic text extraction (30-60 seconds)
3. **Review Results**: cheque extracted data accuracy
4. **Invoice Matching**: System attempts automatic matching with pending invoices
5. **Manual Override**: Select correct invoice if auto-match fails
6. **Complete**: Add notes and finalize reconciliation

## 📝 Sample Test Data

The POC includes sample invoices for testing:
- INV-001: John Smith - ₹12,450.00
- INV-002: Sarah Johnson - ₹22,866.50
- INV-003: Mike Wilson - ₹7,469.17
- INV-004: Emily Davis - ₹26,622.25
- INV-005: Robert Brown - ₹12,968.75

Upload any image containing these amounts to see automatic matching in action.

## 🐛 Known Limitations

- **OCR Accuracy**: Depends on image quality and cheque format
- **Client-side Processing**: Limited by browser performance
- **Sample Data**: Uses mock invoices for demonstration
- **No Persistence**: Data resets on page reload