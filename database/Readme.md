# Database

## Purpose

The `database` folder stores structured information about Indian Standards and their relationships.

The database acts as the trusted metadata layer of the application.

---

## Responsibilities

The database stores:

* Indian Standards
* Standard versions
* Amendments
* Reaffirmation information
* Product categories
* Standard dependencies
* Normative references
* Test methods
* Safety standards
* Installation standards
* Allied product standards
* Certification requirements
* QCO information
* Official source information

---

## Architecture

```text
                    IndianStandard
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
      Version        Amendments     Certification
          |
          v
   StandardDependency
          |
   +------+------+------+
   |      |      |      |
   v      v      v      v
Normative Test   Safety Installation
Reference Method Standard Standard
```

---

## Main Files

### `db.py`

Database connection and session configuration.

Development uses SQLite.

Example:

```text
SQLite
 ↓
SQLAlchemy
 ↓
FastAPI
```

The application can later migrate to PostgreSQL.

---

### `models.py`

Contains SQLAlchemy models.

The main entities include:

```text
IndianStandard
StandardDependency
```

---

### `SeedScript.py`

Populates the database with the initial standards dataset.

The current seed focuses on:

```text
Electrical
Plumbing
Lighting
```

---

## Standard Metadata

Each standard should ideally contain:

```text
IS Number
Title
Category
Description
Current Version
Revision
Amendments
Reviewed Year
Reaffirmation Year
Certification Type
Certification Mandatory
QCO Order
Official Source
Verification Date
```

---

## Dependency Types

A standard can reference other standards.

Supported relationship types include:

```text
normative_reference
test_method
terminology
safety
installation
allied_product
material
```

Example:

```text
Primary Standard
       |
       +---- Test Method
       |
       +---- Material Standard
       |
       +---- Safety Standard
       |
       +---- Installation Standard
```

---

## Certification

Certification information is represented separately from semantic matching.

Examples:

```text
BIS Product Certification
CRS
Hallmarking
QCO
```

The AI does not decide certification requirements by itself.

The database provides the authoritative metadata used by the application.

---

## Adding a New Standard

Add the standard to `SeedScript.py` with:

```text
IS Number
Title
Category
Description
Version
Amendment
Certification
Official Source
```

Then add its relationships.

After seeding, rebuild/update the vector index if required.

---

## Scalability

The development database is SQLite.

For production:

```text
SQLite
  ↓
PostgreSQL
```

The SQLAlchemy abstraction allows this migration with limited application changes.

---

## Data Quality Principle

Standards metadata should preferably be verified against official BIS sources before being presented as authoritative.

The database is therefore treated as a curated registry rather than allowing the AI model to generate statutory information.
