# SaaS Email Campaign Platform

This project is a SaaS platform designed for managing and executing email marketing campaigns. It features Excel data ingestion, campaign organization, automated/manual email sending, and a comprehensive dashboard for tracking performance.

## 🚀 Tech Stack

- **Frontend:** TypeScript, React/Next.js, Tailwind CSS
- **Backend:** Python, FastAPI
- **Database:** PostgreSQL
- **Infrastructure:** AWS (Amazon Web Services)
- **Email Service:** AWS SES (Simple Email Service) or Custom SMTP
- **Data Processing:** Pandas / Openpyxl (for Excel/CSV parsing)

## 📁 Project Structure (Skeleton)

```text
email-campaign-saas/
├── client/                 # Frontend application (Next.js + TypeScript)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages (Login, Dashboard, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service calls
│   │   ├── store/          # State management (Zustand/Redux)
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Helper functions
│   ├── tailwind.config.js
│   └── tsconfig.json
├── server/                 # Backend application (FastAPI)
│   ├── app/
│   │   ├── api/            # API routes (v1)
│   │   │   ├── auth.py     # Authentication endpoints
│   │   │   ├── campaign.py # Campaign management
│   │   │   ├── data.py     # Excel upload and data handling
│   │   │   └── config.py   # Email configuration
│   │   ├── core/           # Core configuration (security, config)
│   │   ├── db/             # Database session and models (SQLAlchemy/SQLModel)
│   │   ├── schemas/        # Pydantic models for request/response validation
│   │   ├── services/       # Business logic (Email sending, Excel parsing)
│   │   └── main.py         # FastAPI entry point
│   ├── requirements.txt
│   └── .env.example
├── infra/                  # Infrastructure as Code (Terraform or AWS CDK)
│   ├── main.tf
│   └── variables.tf
├── docs/                   # Additional documentation
│   └── PRD.md
├── .gitignore
└── README.md
```

## 🛠️ Key Features

1.  **Authentication & Authorization:** Role-based access for Managers and Campaign Specialists.
2.  **Excel Data Ingestion:** Upload `.xlsx` or `.csv` files to populate campaign data.
3.  **Campaign Management:** Segregate data, create campaigns, and track metrics (Sent, Pending, Responses).
4.  **Email Configuration:** Template builder with placeholders and SMTP/SES integration.
5.  **Drafting Modes:** Toggle between Manual review and Automatic sending.
6.  **Real-time Dashboard:** Visual representation of campaign progress and data statistics.

## 🔄 Workflow

1.  **Upload:** Manager/Specialist uploads Excel data in the "Data Folder" page.
2.  **Create:** A new campaign is created and data is assigned (randomly or specifically).
3.  **Configure:** Email templates and sending parameters are defined.
4.  **Launch:** Campaign starts in the selected mode (Manual/Auto).
5.  **Monitor:** Dashboard reflects real-time metrics and responses.

## 📝 Documentation

- [Product Requirements Document (PRD)](PRD.md)
