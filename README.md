# ITIL Problem Management Agent 🚀

An AI-powered intelligent agent for analyzing ITIL problem management data with advanced analytics, strategic recommendations, and executive reporting capabilities.

## 📋 Features

✅ **ServiceNow Data Integration**
- Support for CSV and Excel file imports
- Automatic column normalization
- Data validation and cleansing

✅ **ITIL Analysis Engine**
- KPI calculations (MTTR, P1 proportion, Reopen rate, Health Score)
- Root cause intelligence with severity scoring
- Open problem risk assessment
- Closure pattern mining with theme extraction
- Strategic recommendations (ITIL v4-aligned)
- Critical finding identification

✅ **Executive Reporting**
- McKinsey SCR (Situation-Complication-Resolution) narrative
- Multi-format exports (PDF, PowerPoint, Excel)
- Interactive dashboards with Recharts visualizations
- Trend analysis and severity distribution charts

✅ **Modern Tech Stack**
- Backend: Express.js + TypeScript
- Frontend: React 18 + TypeScript + Tailwind CSS
- Database-ready architecture (in-memory for MVP)
- Docker containerization
- Production-grade error handling

## 🏗️ Architecture

```
ITIL-Problem-Management-Agent/
├── backend/                          # Express.js server
│   ├── src/
│   │   ├── server.ts                # Express app entry
│   │   ├── middleware/
│   │   │   ├── cors.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── fileUpload.ts
│   │   ├── routes/
│   │   │   ├── upload.ts            # File upload endpoints
│   │   │   ├── analysis.ts          # Analysis endpoints
│   │   │   └── export.ts            # Export endpoints
│   │   ├── services/
│   │   │   ├── fileService.ts       # CSV/Excel parsing
│   │   │   ├── analysisService.ts   # ITIL analysis engine
│   │   │   └── reportService.ts     # PDF/PPT/Excel generation
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces
│   │   └── config/
│   │       └── env.ts               # Environment config
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                         # React application
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx                  # Main app with routing
│   │   ├── index.css                # Tailwind CSS
│   │   ├── context/
│   │   │   └── AppContext.tsx       # Global state
│   │   ├── services/
│   │   │   └── api.ts               # Axios API client
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces
│   │   ├── pages/
│   │   │   ├── UploadPage.tsx       # File upload workflow
│   │   │   ├── DashboardPage.tsx    # Analysis dashboard
│   │   │   └── ExportPage.tsx       # Report export
│   │   └── components/
│   │       ├── common/              # Reusable components
│   │       ├── upload/              # Upload components
│   │       ├── dashboard/           # Dashboard components
│   │       └── executive/           # Executive summary
│   ├── public/
│   │   └── index.html
│   ├── Dockerfile
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml                # Full stack orchestration
├── README.md                         # This file
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

### Option 1: Docker Compose (Recommended)

```bash
# Clone and navigate
git clone https://github.com/ShantanuRakshit18/ITIL-Problem-Management-Agent.git
cd ITIL-Problem-Management-Agent

# Start the stack
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
# Runs on http://localhost:5000
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm start
# Runs on http://localhost:3000
```

## 📊 Usage Workflow

### Step 1: Upload Data
1. Navigate to the upload page
2. Drag and drop or browse for CSV/Excel file
3. Click "Upload" to import ServiceNow problem data

### Step 2: Analyze
- Automatic ITIL analysis begins
- View comprehensive dashboard with:
  - KPI metrics (MTTR, Health Score, P1 proportion, etc.)
  - Severity distribution charts
  - Problem trend analysis
  - Root cause intelligence
  - Open problem risk register
  - Strategic recommendations
  - Critical findings
  - McKinsey SCR executive summary

### Step 3: Export
- Generate reports in multiple formats:
  - **PDF**: Comprehensive report with all insights
  - **PowerPoint**: Executive presentation
  - **Excel**: Detailed data tables for further analysis

## 📈 Analysis Components

### KPIs Calculated
- **MTTR (Mean Time To Resolution)**: Average time to close problems (in hours)
- **Health Score**: 0-100 composite metric (openness, severity, reopen rate)
- **P1 Proportion**: Percentage of critical severity problems
- **Reopen Rate**: Percentage of problems reopened
- **Proactive/Reactive Ratio**: Ratio of closed problems with root cause analysis

### Root Cause Analysis
- Frequency-based categorization of causes
- Severity assessment per cause
- Pattern identification for systemic issues

### Strategic Recommendations
- ITIL v4-aligned initiatives
- Impact/Effort assessment
- Priority ranking
- Risk level classification

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
NODE_ENV=production
PORT=5000
UPLOAD_DIR=./uploads
```

**Frontend (.env.local)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📦 API Endpoints

### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

### Analysis
- `POST /api/analysis/full` - Get complete analysis
- `POST /api/analysis/kpis` - Get KPIs only

### Export
- `POST /api/export/pdf` - Generate PDF report
- `POST /api/export/ppt` - Generate PowerPoint
- `POST /api/export/excel` - Generate Excel export

### Health
- `GET /api/health` - Health check endpoint

## 🧪 Testing

Upload a sample CSV file with the following columns:
```
Problem_ID, Severity, Category, Root_Cause, Executive_Summary, Status, 
Closure_Notes, Created_Date, Closed_Date, Reopen_Count, Assigned_To
```

## 🐳 Docker Deployment

### Build Images
```bash
# Backend
docker build -t itil-backend:latest ./backend

# Frontend
docker build -t itil-frontend:latest ./frontend
```

### Run Containers
```bash
# Using docker-compose (recommended)
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop stack
docker-compose down
```

## 📊 Data Privacy & Security
- File uploads stored in isolated `uploads/` directory
- No data persisted to external databases (MVP)
- CORS middleware configured
- Error handling with secure messages

## 🔮 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Advanced NLP for closure notes analysis
- [ ] Machine learning for predictive issue detection
- [ ] Real-time dashboard updates (WebSockets)
- [ ] Multi-user authentication & authorization
- [ ] Data export to ServiceNow
- [ ] Scheduled automated analysis
- [ ] Custom report templates
- [ ] API rate limiting
- [ ] Enhanced Excel export with formulas

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**Shantanu Rakshit**
- GitHub: [@ShantanuRakshit18](https://github.com/ShantanuRakshit18)
- Email: shantanu.rakshit@accenture.com

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions, please open a GitHub issue.

---

**Built with ❤️ for ITIL Problem Management Excellence**
