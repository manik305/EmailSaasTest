# Email SaaS Platform - Development Memory & Workflow

## 🚀 Application Workflow
This application is an all-in-one CRM and Sales Pipeline automation tool designed for outbound reach through multiple channels (Email, Calling, Social Media).

### 1. Lead Management
- **Manual Entry**: Users can add individual leads with detailed profile data (First Name, Last Name, Mail ID, Alternative Phone, Designation, Department, Industry, Region, etc.).
- **Bulk Upload**: Integration for uploading contact lists with the exact fields required for segmentation.

### 2. Email Campaigns
- **Setup**: Configure SMTP/IMAP settings for a sender account.
- **Sub-campaigns**: Create focused sub-campaigns with specific messaging.
- **Drafting**: Create and save email drafts for sub-campaigns.
- **Replies Inbox**: Real-time synchronization of inbound email replies using IMAP. Fetched replies are reflected in the Campaign's dedicated inbox folder.

### 3. Voice Calling Integration
- **Calling Agents**: Configure AI-powered calling agents using Vapi/Twilio.
- **Call Logs**: Track interactions and outcomes of automated or manual calls.

### 4. Social Media Hub
- **Publishing**: Schedule and publish posts to LinkedIn, Facebook, and Twitter.
- **Interaction**: Track engagement across social channels.

---

## 🛠 Iteration History

### Iteration 1: Foundations & Backend Core
- Initialized FastAPI backend and React frontend.
- Set up MongoDB with Beanie ODM.
- Implemented core Campaign and Recipient models.

### Iteration 2: SMTP & Campaign UI
- Developed the Campaign management dashboard.
- Integrated SMTP for sending automated emails.
- Created the folder-based navigation for Campaigns (Inbox, Drafts, Sub-folders).

### Iteration 3: IMAP Inbox Integration
- Implemented `GET /api/v1/campaigns/{id}/inbox` endpoint in FastAPI.
- Built a blocking IMAP client to fetch real-time replies from the configured sender mailbox.
- Updated Frontend `AppContext` to handle background fetching of replies.

### Iteration 4: Data Integration & UX Polish
- Expanded the Lead profile fields to include Designation, Industry, etc.
- Synchronized models between Frontend and Backend.
- Resolved build errors and ensured type safety across the stack.
- Generated architecture diagrams (`architecture.mmd` and `architecture.png`).

### Iteration 5: Git & Environment Setup
- Created a robust `.gitignore` to prevent tracking of `node_modules` and cache files.
- Cleaned up Git history to remove accidental large commits.

### Iteration 6: Architecture Refinement & Async Integration
- Migrated all remaining API routers (`campaign`, `data`, `config`, `meetings`) to Beanie for async MongoDB operations.
- Implemented `Voice Manager` and `Social Media Hub` API routers.
- Refactored `main.py` and `database.py` for consistent async startup and initialization.
- Expanded `Recipient` model and data upload logic to support the full lead data requirements.

### Iteration 7: Combined Campaign Config, Timezone Scheduling, Excel Validation & Bounce/Inbox Overhaul
- **Combined Email Config**: Removed the standalone configuration screens and fully integrated SMTP/IMAP setups directly into the Campaign panel workspace.
- **13-Header Excel/CSV Validation Engine**: Implemented robust campaign-level bulk lead data import supporting `.xlsx`, `.xls`, and `.csv` files with a strict, trimmed, case-insensitive 13-header validation engine.
- **APAC & World-Wide Timezone Scheduler**: Added comprehensive region-by-country timezone selector (APAC, US/Canada, Latin America, Europe, Africa, Middle East) that auto-translates scheduled campaign times to UTC.
- **Resilient Bounce Aggregator & Fallbacks**: Integrated dynamic "Delivery Status Notification (Failure)" synthesis inside the `/inbox` API endpoint when recipients bounce. Added graceful database fallbacks so unconfigured IMAP settings do not crash the view.
- **Interactive Monospace Console Email Reader**: Built an interactive full email details view inside the Frontend React `CampaignPanels` Inbox tab with a monospace, preserved-whitespace console container and sleek back-navigation.
- **Type-Safe Full-Stack Delivery**: Eliminated TypeScript build warnings and verified FastAPI backend service compile logs.

---

## 🏗 Architecture Summary

- **Frontend**: Vite + React (TypeScript) + Tailwind CSS/Vanilla CSS.
- **Backend**: FastAPI (Python 3.11).
- **Database**: MongoDB Atlas (Beanie/Motor).
- **External Services**: SMTP (Email Out), IMAP (Email In), Vapi (Voice), LinkedIn API (Social).

---

## 📝 Roadmap & Pending Tasks
1. **Social Media OAuth**: Finalize the authentication flow for LinkedIn/Facebook publishing.
2. **Dynamic Calling Agents**: Integrate live Vapi voice agents inside the calling tab interfaces.
3. **Analytics Dashboard Drill-downs**: Add visual charts to view delivery, opens, clicks, and bounce statistics dynamically per campaign.
