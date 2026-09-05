# Documentation

## Purpose

The `docs` folder contains project documentation, architecture information, research notes, datasets, demonstrations, and supporting material.

---

## Recommended Documentation

```text
docs/
│
├── README.md
├── architecture.md
├── api.md
├── standards-data.md
├── certification.md
├── demo-flow.md
└── screenshots/
```

---

## `architecture.md`

Should explain:

```text
Frontend
   ↓
Backend
   ↓
AI
   ↓
Vector Database
   ↓
Standards Database
```

Include diagrams and major design decisions.

---

## `api.md`

Document API endpoints.

Example:

```text
POST /api/recommend/analyze
```

Input:

```text
specification
domain
file
```

Output:

```text
Primary standard
Allied standards
Certification
Confidence
```

---

## `standards-data.md`

Document the standards currently covered.

Current categories:

```text
Electrical
Plumbing
Lighting
```

For every standard, document:

```text
IS Number
Title
Category
Version
Amendments
Certification
Official source
```

---

## `certification.md`

Explain certification concepts supported by the system:

```text
BIS Product Certification
CRS
QCO
Hallmarking
```

Clearly distinguish:

```text
AI Recommendation
        vs
Verified Regulatory Metadata
```

---

## `demo-flow.md`

The SIH demonstration should follow:

```text
1. Enter a product specification
2. Select category
3. Analyze
4. Show primary IS standard
5. Show confidence
6. Show latest version
7. Show amendments
8. Show allied standards
9. Show certification requirement
10. Show generated tender-ready output
```

---

## Screenshots

Store demonstration screenshots in:

```text
docs/screenshots/
```

Recommended screenshots:

```text
01-home.png
02-product-input.png
03-document-upload.png
04-recommendation.png
05-allied-standards.png
06-certification.png
```

---

## Important

Documentation should describe the system accurately.

Do not claim that the AI independently determines legal or mandatory certification requirements.

Instead:

```text
AI
→ identifies relevant standards

Curated standards registry
→ provides version/certification metadata

Application
→ presents the recommendation
```
