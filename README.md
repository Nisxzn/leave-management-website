# Leave Management Website For Company 

A modern, file-based leave management website with a neat and clean professional UI.

## Quick Start

### 1. Start Backend (PHP Server)
```bash
cd E:\LMS
C:\xampp\php\php.exe -S localhost:8000
```

### 2. Start Frontend (React)
```bash
cd E:\LMS\client
npm install
npm run dev
```

### 3. Open Browser
Navigate to: http://localhost:5173

## Login Credentials

**Manager**: `sundhar` / `sundhar123`  
**Employees**: 
- `nithish` / `nithish123`
- `siddarth` / `siddarth123`
- `saran` / `saran123`

## Features

✅ Role-based login (Manager/Employee)  
✅ Apply for leave  
✅ Approve/Reject requests  
✅ PDF report export  
✅ File-based storage (no database needed)  

## Project Structure

```
LMS/
├── api/
│   ├── data/
│   │   ├── users.json      # User accounts
│   │   └── leaves.json     # Leave requests
│   ├── config.php          # File operations
│   ├── auth.php            # Login API
│   ├── employee.php        # Employee API
│   └── manager.php         # Manager API
├── client/
│   └── src/
│       ├── pages/          # Login, Dashboards
│       ├── utils/          # API utilities
│       └── index.css       # Styles
└── README.md
```

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: PHP (built-in server)
- **Storage**: JSON files
- **PDF**: jsPDF

---

**Designed by Nithish** 
