# Frontend

## Purpose

The frontend provides the user interface for interacting with the Indian Standards Recommendation System.

---

## Responsibilities

The frontend handles:

* Product description input
* Technical specification input
* Category selection
* Tender document upload
* API communication
* Recommendation display
* Confidence display
* Allied standard display
* Certification display
* Amendment/version display

---

## Architecture

```text
                  User
                   |
                   v
              React UI
                   |
                   v
             HTTP Request
                   |
                   v
             FastAPI Backend
                   |
                   v
           Recommendation Result
                   |
                   v
              React UI
```

---

## Folder Structure

```text
frontend/
│
├── README.md
│
└── project_frontend/
    ├── src/
    │   ├── App.tsx
    │   └── index.css
    │
    ├── package.json
    └── ...
```

---

## Main Components

### `App.tsx`

Main application interface.

Provides:

* Specification input
* Category selection
* File upload
* Analyze button
* Recommendation results

The frontend communicates with:

```text
POST /api/recommend/analyze
```

---

### `index.css`

Contains application styling.

The visual design should remain independent of backend business logic.

---

## User Flow

```text
1. Select Product Category
        ↓
2. Enter Product Description
        OR
   Upload Tender Document
        ↓
3. Click Analyze
        ↓
4. Backend Processes Input
        ↓
5. AI Finds Relevant Standards
        ↓
6. Database Supplies Metadata
        ↓
7. Results Displayed
```

---

## Supported Inputs

### Text

Users can enter:

```text
Product description
Technical specification
Tender requirement
```

### Documents

Supported document types:

```text
PDF
DOCX
TXT
MD
CSV
```

---

## Recommendation Result

The UI can display:

```text
Primary Standard
        |
        +-- Confidence
        +-- Current Version
        +-- Amendments
        +-- Reaffirmation
        |
        +-- Allied Standards
        |      |
        |      +-- Test Methods
        |      +-- Safety
        |      +-- Installation
        |      +-- Normative References
        |
        +-- Certification
               |
               +-- BIS
               +-- CRS
               +-- QCO
               +-- Hallmarking
```

---

## Running the Frontend

Navigate to:

```bash
cd frontend/project_frontend
```

Install:

```bash
npm install
```

Run:

```bash
npm run dev
```

The development server will provide a local URL.

---

## Backend Dependency

The backend should be running before performing real recommendations.

Expected backend:

```text
http://127.0.0.1:8000
```

---

## Future Improvements

* Result comparison
* Search history
* Saved recommendations
* PDF export
* Tender clause generation
* Evidence/citation display
* Authentication
* Responsive mobile UI
