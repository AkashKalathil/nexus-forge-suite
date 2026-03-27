# NexusForge ERP Suite

## About

NexusForge ERP is a comprehensive Steel & Metal Manufacturing Enterprise Resource Planning system built as a final year university project by **Akash Kalathil**.

## Features

- **Dashboard** — Real-time KPIs and activity feed
- **Customer Management** — Full CRM with contact tracking
- **Enquiry & Quotation Pipeline** — End-to-end sales workflow
- **Job Card Management** — Production tracking with multi-stage workflows
- **Invoice Management** — Billing with tax calculations
- **Purchase Orders** — Supplier and procurement management
- **Quality Control** — Inspection tracking and defect logging
- **Dispatch & Shipment** — Logistics and delivery management
- **Tool Inventory** — Equipment tracking with maintenance scheduling
- **AI ERP Assistant** — Context-aware chatbot powered by Gemini 3 Flash
- **AI Metallurgist** — Steel grade recommendation and composition analysis

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Edge Functions, Row-Level Security)
- **AI:** Google Gemini 3 Flash via API Gateway, Deno Edge Functions
- **State Management:** TanStack React Query

## Getting Started

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd nexus-forge-suite

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Architecture

The application follows a modular architecture with:
- React Router for page navigation
- Custom hooks for data fetching (Supabase integration)
- Reusable UI components built on shadcn/ui design system
- Supabase Edge Functions for AI-powered features
- Triple-Layer Persona prompt engineering for AI assistants

## License

This project was developed for academic purposes as part of a final year university submission.
