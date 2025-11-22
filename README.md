
# Zimam ERP (زِمام) - Genius Mode 🚀

**Zimam** is a revolutionary AI-Powered ERP system designed specifically for the MENA region (Saudi Arabia & Egypt). It features ZATCA Phase 2 compliance, AI inventory prediction, and a "Genius Mode" for voice control and autonomous decision making.

## ✨ Key Features

- **Genius Mode:**
  - **Voice Commander:** Control the app with your voice ("Add 5 Coffee", "Go to Invoices").
  - **Visual Shelf Audit:** Use the camera to count stock and auto-adjust inventory using Gemini Vision.
  - **Autonomous Negotiator:** AI drafts email negotiations with suppliers for better prices.
- **Compliance:**
  - **ZATCA (KSA):** Generates TLV Base64 QR Codes and cryptographically signs invoices (Simulated).
  - **ETA (Egypt):** Ready structure for e-Invoicing.
- **Core ERP:**
  - POS (Point of Sale) with thermal receipt generation.
  - Inventory Management with AI Reorder Points.
  - Accounting (General Ledger, Trial Balance).
  - WhatsApp OCR for automated invoice entry.

## 🛠 Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons.
- **AI:** Google Gemini API (gemini-2.5-flash, gemini-3-pro-preview).
- **Backend (Optional):** Python Django (Code provided in `api/` folder structure).

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/zimam-erp.git
cd zimam-erp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set up Environment
Create a `.env` file in the root directory and add your Google Gemini API Key:
```env
API_KEY=your_google_gemini_api_key_here
```

### 4. Run the App
```bash
npm start
```
The app will open at `http://localhost:8080`.

## 🧠 How to run the Backend (Chat with Data)

To enable the "Chat with Data" feature (SQL Integration):

1. Navigate to the backend folder (create one based on provided Python code).
2. Install Python requirements:
   ```bash
   pip install django djangorestframework langchain openai psycopg2-binary
   ```
3. Run the Django Server:
   ```bash
   python manage.py runserver
   ```
4. Switch the AI Assistant to **"Data Mode"** in the app.

## 📄 License
MIT License.

---
*Developed with ❤️ by Mohamed Said.*
