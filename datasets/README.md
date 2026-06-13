# Course Datasets — Documentation

## Overview

This directory contains all datasets used in **The Complete Data Analytics Course**. Each dataset is a CSV file designed to teach specific analytical skills while being realistic enough to represent real-world data challenges.

## Dataset Summary

| # | File | Rows | Domain | Used In |
|---|---|---|---|---|
| 1 | `01_global_superstore_sales.csv` | 1,000 | Retail sales | Ch. 2–12 (primary dataset) |
| 2 | `02_sales_dirty.csv` | ~80 | Retail sales (dirty) | Ch. 4 (data cleaning) |
| 3 | `03_employee_data.csv` | 200 | HR / People analytics | Ch. 5, 6, 7, Project 2 |
| 4 | `04_oil_gas_production.csv` | ~900 | Oil & gas upstream | Ch. 5, 7, Project 4 |
| 5 | `05_marketing_campaigns.csv` | 300 | Digital marketing | Ch. 5, 7, Project 5 |
| 6 | `06_financial_budget_actuals.csv` | ~200 | Corporate finance | Ch. 7, 8, Project 3 |
| 7 | `07_hospital_patient_flow.csv` | 300 | Emergency department | Ch. 5, 7, Project 6 |
| 8 | `08_product_catalog.csv` | ~50 | Product reference | Ch. 3 (lookups), Ch. 9 (relationships) |
| 9 | `monthly_sales/*.csv` | ~1,000 total | Monthly retail files | Ch. 8 (Power Query folder combine) |

## How to Use

1. **Download** or copy the `datasets` folder to your local machine
2. **Open in Excel**: File → Open → navigate to the CSV file
3. **Import in Power BI**: Get Data → Text/CSV → select the file
4. For Power Query folder combine exercises (Ch. 8), point to the `monthly_sales/` folder

## Data Characteristics

### Intentional Data Patterns
- **Sales dataset**: Q4 spike in Technology, seasonal trends, negative profits on high-discount items
- **Employee data**: Right-skewed salary distribution, gender pay gap embedded for discovery, attrition correlation with satisfaction
- **Oil & gas**: Production decline curves, 3 outlier wells, seasonal shutdowns
- **Marketing**: Channel performance differences (Search > Email > Social > Display), A/B test variations
- **Financial**: Q4 budget flush, large variance outliers with explanatory notes
- **Hospital**: Log-normal wait times, weekend evening understaffing pattern, triage-based wait time ordering

### Dirty Data (Dataset 2) Issues
- Leading/trailing spaces
- Inconsistent casing
- Mixed date formats
- Numbers stored as text (with currency symbols)
- Missing values (blank, "N/A", "n/a", "-")
- Category typos
- Duplicate rows (5 exact)
- Blank rows (3 scattered)
- Inconsistent ID formats
- Address data crammed into name fields
- Special characters
- Negative quantities

## Regenerating Datasets

If you need to regenerate the datasets (e.g., to change the seed or row counts):

```bash
node generate_datasets.js
```

The script uses a seeded PRNG (seed: 42) for reproducibility. The same seed always produces the same data.
