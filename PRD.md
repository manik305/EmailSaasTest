# Product Requirements Document (PRD): SaaS Email Campaign Platform

## 1. Executive Summary
The SaaS Email Campaign Platform is a professional solution for managing and executing email marketing campaigns. It allows users to upload recipient data via Excel, organize data into campaigns, configure email templates, and monitor performance through a centralized dashboard. The platform is designed for campaign specialists and managers to streamline their outreach efforts with both manual and automatic drafting modes.

## 2. Target Audience
*   **Campaign Specialists:** Responsible for creating templates, uploading data, and managing day-to-day campaign execution.
*   **Managers:** Responsible for overseeing all campaigns, monitoring performance metrics, and managing user access.

## 3. Key Features

### 3.1. Authentication & Authorization
*   Secure login system.
*   Role-based access control (RBAC) for Managers and Campaign Specialists.
*   Session management and secure logout.

### 3.2. Data Management (Data Folder Page)
*   **Excel Upload:** Support for `.xlsx` and `.csv` file formats.
*   **Data Validation:** Ensure required fields (e.g., Email, Name) are present in the uploaded file.
*   **Database Storage:** Store uploaded data in a PostgreSQL database for later use in campaigns.

### 3.3. Campaign Management (Campaign Page)
*   **Campaign Creation:** Create new campaigns with specific parameters (Name, Target Segment, Schedule).
*   **Data Segregation:** Assign uploaded data to specific campaigns.
*   **Randomized Selection:** Ability to pull data randomly from the database for campaign execution.
*   **Dashboard Metrics:**
    *   Total data added.
    *   Total data sent.
    *   Pending data.
    *   Total emails sent.
    *   Total active/completed campaigns.
*   **Response Tracking:** Monitor responses received from the data.

### 3.4. Email Configuration (Email Configuration Page)
*   **Template Builder:** Create and save email templates with placeholders (e.g., `{{name}}`).
*   **SMTP/API Configuration:** Set up email sending providers.
*   **Drafting Modes:**
    *   **Manual Mode:** Users can review and trigger each email draft.
    *   **Automatic Mode:** System automatically sends emails based on the campaign schedule and template.

## 4. User Interface Requirements

### 4.1. Login Page
*   Email/Username and Password fields.
*   "Forgot Password" functionality.
*   Clean, professional SaaS-style UI.

### 4.2. Campaign Page (Main Dashboard)
*   High-level cards showing key metrics (Sent, Pending, Total).
*   List of active and past campaigns with status indicators.
*   Action buttons to start, pause, or edit campaigns.
*   Graphical representation of campaign performance.

### 4.3. Data Folder Page
*   Drag-and-drop zone for Excel/CSV uploads.
*   Table view of recently uploaded data sets.
*   Status of data processing (Processing, Success, Error).

### 4.4. Email Configuration Page
*   Form to input SMTP/Sender details.
*   Rich Text Editor for email template creation.
*   Toggle for Manual vs. Automatic drafting modes.

## 5. Workflow

1.  **Data Ingestion:** User uploads an Excel file via the Data Folder Page.
2.  **Campaign Setup:** User creates a campaign and defines parameters.
3.  **Data Allocation:** The system segregates data and selects records (randomly or sequentially) for the campaign.
4.  **Configuration:** User sets up the email template and sender details in the Email Configuration Page.
5.  **Execution:** The campaign starts in either Manual or Automatic mode.
6.  **Monitoring:** User tracks progress and metrics on the Campaign Dashboard.

## 6. Technical Stack
*   **Frontend:** TypeScript, React/Next.js, Tailwind CSS.
*   **Backend:** Python (FastAPI).
*   **Database:** PostgreSQL.
*   **Infrastructure:** AWS (Amazon Web Services).
*   **File Processing:** `pandas` or `openpyxl` for Excel parsing.
*   **Email Sending:** Integration with AWS SES (Simple Email Service) or custom SMTP.
*   **Auth:** JWT-based authentication with FastAPI.

## 7. Success Criteria
*   Successful upload and parsing of Excel files.
*   Accurate reflection of metrics on the dashboard in real-time.
*   Reliable email delivery in both manual and automatic modes.
*   Secure access restricted to authorized roles.
