# Data Analytics Course - Technical Specification

**Title**: The Complete Data Analytics Course - From Zero to Insight  
**Target**: Complete beginners → Advanced analytical workflows  
**Duration**: ~6 weeks (2 chapters/week, ~2–3 hours per chapter)  
**Primary Tools**: Microsoft Excel (365), Power BI Desktop  
**Secondary (Foundational)**: SQL, Python  
**Output**: Single self-contained `data-analytics-course.html`  
**Location**: `C:\Users\petre\OneDrive\Desktop\Desktop\Courses\Intro to Analytics`

---

## Directory Structure

```
Intro to Analytics/
├── datasets/                               ← All course datasets
│   ├── 01_global_superstore_sales.csv      ← Primary: 1000-row sales dataset
│   ├── 02_sales_dirty.csv                  ← Chapter 4: deliberately messy version
│   ├── 03_employee_data.csv                ← HR: 200 employees across departments
│   ├── 04_oil_gas_production.csv           ← Oil & Gas: 500 rows of well data
│   ├── 05_marketing_campaigns.csv          ← Marketing: 300 campaign records
│   ├── 06_financial_budget_actuals.csv     ← Finance: 200 budget vs actual rows
│   ├── 07_hospital_patient_flow.csv        ← Healthcare: 300 patient records
│   ├── 08_product_catalog.csv              ← Lookup reference: 50 products
│   ├── monthly_sales/                      ← Power Query exercise: 12 monthly files
│   │   ├── sales_jan.csv
│   │   ├── sales_feb.csv
│   │   ├── ... (through sales_dec.csv)
│   └── README.md                           ← Dataset documentation
├── 00-course-overview.md
├── 01-what-is-data-analytics.md
├── 02-excel-foundations.md
├── 03-formulas-and-functions.md
├── 04-data-cleaning-transformation.md
├── 05-statistics-for-analysts.md
├── 06-pivottables.md
├── 07-data-visualisation.md
├── 08-advanced-excel.md
├── 09-intro-to-power-bi.md
├── 10-dax.md
├── 11-power-bi-reports-dashboards.md
├── 12-capstone-and-foundations.md
├── build-course.js
├── images/
│   ├── course_hero.png
│   └── ch01.png ... ch12.png
└── data-analytics-course.html              ← Generated output
```

---

## Dataset Specifications

### Dataset 1: Global Superstore Sales (`01_global_superstore_sales.csv`)

**Purpose**: Primary dataset used from Chapter 2 through Chapter 12. Covers formulas, PivotTables, charts, Power Query, Power BI modeling, and DAX.

**Rows**: 1000  
**Domain**: Multinational retail (inspired by the classic Superstore dataset but custom-built)

| Column | Type | Description | Example Values |
|---|---|---|---|
| `Order_ID` | Text | Unique order identifier | `ORD-0001`, `ORD-0002` |
| `Order_Date` | Date | Date order was placed (2022-01-03 to 2024-12-28) | `2023-06-15` |
| `Ship_Date` | Date | Date order was shipped (1-7 days after order) | `2023-06-18` |
| `Ship_Mode` | Text | Shipping method | `Standard Class`, `Second Class`, `First Class`, `Same Day` |
| `Customer_ID` | Text | Customer identifier | `CUST-0001` |
| `Customer_Name` | Text | Full name | `Maria Schmidt`, `John Okafor` |
| `Segment` | Text | Customer segment | `Consumer`, `Corporate`, `Home Office` |
| `Region` | Text | Geographic region | `North America`, `Europe`, `Asia Pacific`, `Middle East & Africa`, `Latin America` |
| `Country` | Text | Country | `United States`, `Germany`, `Nigeria`, `Japan`, `Brazil`, etc. (20 countries) |
| `City` | Text | City | `New York`, `Lagos`, `Munich`, `Tokyo` |
| `Category` | Text | Product category | `Technology`, `Furniture`, `Office Supplies` |
| `Sub_Category` | Text | Product sub-category | `Phones`, `Chairs`, `Binders`, `Storage`, etc. (17 sub-categories) |
| `Product_Name` | Text | Product description | `Samsung Galaxy S24`, `Herman Miller Aeron Chair` |
| `Sales` | Number | Revenue in USD | Range: $2.50 – $12,500.00 |
| `Quantity` | Integer | Units sold | Range: 1 – 14 |
| `Discount` | Decimal | Discount applied (0.00 – 0.45) | `0.00`, `0.10`, `0.20`, `0.30` |
| `Profit` | Number | Profit in USD (can be negative) | Range: -$2,000 to $4,500 |
| `Cost` | Number | Cost = Sales - Profit | Derived |

**Data characteristics**:
- Dates span 3 full years (2022, 2023, 2024) for year-over-year DAX analysis
- Some products have negative profit (high discount + low margin)
- Seasonal patterns embedded (Q4 spike for Technology)
- 200 unique customers, 150 unique products
- Intentional distribution: ~40% North America, ~25% Europe, ~15% Asia Pacific, ~10% Middle East & Africa, ~10% Latin America

---

### Dataset 2: Dirty Sales Data (`02_sales_dirty.csv`)

**Purpose**: Chapter 4 (Data Cleaning). A deliberately messy version of a sales extract with 10+ categories of quality issues.

**Rows**: 80  
**Domain**: Same retail context

| Quality Issue | Columns Affected | Example |
|---|---|---|
| Leading/trailing spaces | `Customer_Name`, `City` | `"  Maria Schmidt "` |
| Inconsistent casing | `Region`, `Category` | `"north america"`, `"EUROPE"`, `"Asia pacific"` |
| Duplicate rows | All | 5 exact duplicates |
| Dates as text (mixed formats) | `Order_Date` | `"15/06/2023"`, `"June 15, 2023"`, `"2023-06-15"` |
| Numbers stored as text | `Sales`, `Quantity` | `"$1,234.56"` (with dollar sign and comma) |
| Missing values | `Customer_Name`, `Profit`, `Region` | Empty cells, cells with `"N/A"`, `"n/a"`, `"-"` |
| Typos in categories | `Category`, `Sub_Category` | `"Technolgy"`, `"Furntiure"`, `"Offce Supplies"` |
| Merged-style data | `Customer_Name` | Full address crammed into name field: `"Maria Schmidt, 123 Main St, Munich"` |
| Special characters | `Product_Name` | `"Samsung Galaxy S24™"`, `"Chair – Executive"` (em dash) |
| Negative quantities | `Quantity` | `-3` (should be positive) |
| Extra blank rows | All | 3 completely blank rows scattered |
| Inconsistent ID formats | `Order_ID` | `"ORD-0001"`, `"ORD0002"`, `"1003"`, `"ord-0004"` |

---

### Dataset 3: Employee Data (`03_employee_data.csv`)

**Purpose**: Chapters 5 (statistics), 6 (PivotTables), 7 (charts), and Project 2 (HR Analytics).

**Rows**: 200  
**Domain**: Multi-department corporation

| Column | Type | Description | Example Values |
|---|---|---|---|
| `Employee_ID` | Text | Unique identifier | `EMP-001` |
| `First_Name` | Text | First name | `Amara`, `Chen`, `Fatima` |
| `Last_Name` | Text | Last name | `Okonkwo`, `Wei`, `Al-Rashid` |
| `Gender` | Text | Gender | `Male`, `Female`, `Non-Binary` |
| `Age` | Integer | Age at hire + tenure | Range: 22 – 62 |
| `Department` | Text | Department | `Engineering`, `Sales`, `Marketing`, `HR`, `Finance`, `Operations`, `Legal`, `IT` |
| `Job_Title` | Text | Position | `Analyst`, `Senior Analyst`, `Manager`, `Director`, `VP` |
| `Hire_Date` | Date | Date hired | `2015-03-20` to `2024-11-01` |
| `Salary` | Number | Annual salary (USD) | Range: $38,000 – $185,000 |
| `Bonus_Pct` | Decimal | Bonus as % of salary | Range: 0% – 25% |
| `Performance_Rating` | Integer | Annual rating | 1 (Needs Improvement) to 5 (Exceptional) |
| `Satisfaction_Score` | Decimal | Employee satisfaction (1.0–5.0) | Survey data |
| `Attrition` | Text | Left the company? | `Yes`, `No` |
| `Years_at_Company` | Integer | Tenure | Derived from Hire_Date |
| `Manager_ID` | Text | Reports to (self-ref) | `EMP-015` or blank for CEO |
| `Office_Location` | Text | Office | `New York`, `London`, `Lagos`, `Dubai`, `Singapore` |

**Data characteristics**:
- Salary distribution is right-skewed (realistic)
- Attrition rate ~16% overall, higher in certain departments
- Performance ratings roughly normally distributed
- Satisfaction correlates with performance but not perfectly (r ≈ 0.55)
- Gender pay gap deliberately embedded in raw data for analytical discovery

---

### Dataset 4: Oil & Gas Production (`04_oil_gas_production.csv`)

**Purpose**: Chapters 5 (outlier detection), 7 (charts), and Project 4.

**Rows**: 500  
**Domain**: Upstream oil & gas - well production data

| Column | Type | Description | Example Values |
|---|---|---|---|
| `Well_ID` | Text | Well identifier | `WELL-A01`, `WELL-B15` |
| `Well_Name` | Text | Descriptive name | `Eagle Ford 12`, `Permian Basin 7` |
| `Basin` | Text | Geological basin | `Permian`, `Eagle Ford`, `Bakken`, `DJ Basin`, `Marcellus` |
| `Operator` | Text | Operating company | `Apex Energy`, `Frontier Drilling`, `Summit Oil` |
| `Production_Date` | Date | Monthly production date | `2022-01-01` to `2024-12-01` (monthly) |
| `Oil_BBL` | Number | Oil production (barrels) | Range: 50 – 45,000 |
| `Gas_MCF` | Number | Gas production (thousand cubic ft) | Range: 100 – 120,000 |
| `Water_BBL` | Number | Water production (barrels) | Range: 20 – 30,000 |
| `Days_Online` | Integer | Days well was active that month | Range: 0 – 31 |
| `Status` | Text | Well status | `Active`, `Shut-in`, `Drilling`, `Completed` |
| `Spud_Date` | Date | Drilling start date | Varies |
| `Latitude` | Decimal | Well location | Realistic US coordinates |
| `Longitude` | Decimal | Well location | Realistic US coordinates |

**Data characteristics**:
- Production decline curves (newer wells produce more, declining over time)
- 3-4 outlier wells with abnormally high/low production
- Seasonal maintenance shutdowns (Days_Online = 0)
- Mix of oil-dominant and gas-dominant wells

---

### Dataset 5: Marketing Campaigns (`05_marketing_campaigns.csv`)

**Purpose**: Chapters 5 (A/B testing), 7 (funnel charts), and Project 5.

**Rows**: 300  
**Domain**: Digital marketing campaigns

| Column | Type | Description | Example Values |
|---|---|---|---|
| `Campaign_ID` | Text | Unique identifier | `MKT-001` |
| `Campaign_Name` | Text | Descriptive name | `Summer Sale 2023`, `Black Friday Push` |
| `Channel` | Text | Marketing channel | `Email`, `Social Media`, `Search Ads`, `Display Ads`, `Content Marketing` |
| `Start_Date` | Date | Campaign start | Various |
| `End_Date` | Date | Campaign end | Various |
| `Budget` | Number | Allocated budget (USD) | Range: $500 – $50,000 |
| `Spend` | Number | Actual spend (USD) | Range: $450 – $52,000 |
| `Impressions` | Integer | Total impressions | Range: 5,000 – 2,000,000 |
| `Clicks` | Integer | Total clicks | Range: 50 – 80,000 |
| `Conversions` | Integer | Completed actions | Range: 2 – 3,500 |
| `Revenue` | Number | Revenue attributed | Range: $100 – $250,000 |
| `Target_Audience` | Text | Audience segment | `18-24`, `25-34`, `35-44`, `45-54`, `55+` |
| `A_B_Group` | Text | Test group | `Control`, `Variant_A`, `Variant_B` |
| `Region` | Text | Geographic target | Same regions as sales dataset |

**Data characteristics**:
- Clear ROI differences between channels (Search > Email > Social > Display)
- A/B test results with statistically significant differences in some campaigns
- Budget vs spend variance (some over-budget, some under-utilised)
- Conversion rate patterns by audience segment

---

### Dataset 6: Financial Budget vs Actuals (`06_financial_budget_actuals.csv`)

**Purpose**: Chapters 7 (waterfall charts), 8 (what-if analysis), and Project 3.

**Rows**: 200  
**Domain**: Corporate finance - monthly department budgets

| Column | Type | Description | Example Values |
|---|---|---|---|
| `Period` | Date | Month (first of month) | `2024-01-01` to `2024-12-01` |
| `Department` | Text | Business unit | `Sales`, `Engineering`, `Marketing`, `Operations`, `G&A` |
| `Line_Item` | Text | Budget category | `Salaries`, `Software`, `Travel`, `Equipment`, `Utilities`, `Marketing Spend`, `Consulting` |
| `Budget_Amount` | Number | Planned amount (USD) | Range: $2,000 – $450,000 |
| `Actual_Amount` | Number | Actual spend (USD) | Range: $1,800 – $520,000 |
| `Variance` | Number | Budget - Actual | Derived (can be + or -) |
| `Variance_Pct` | Decimal | Variance as % | Derived |
| `Notes` | Text | Explanation for large variances | `"Unplanned server migration"`, `"Conference cancelled"` |

**Data characteristics**:
- Realistic variance patterns (most within ±10%, a few large outliers)
- Seasonal spending patterns (Q4 budget flush)
- Year-total should show a slight over-budget position (~3% over)

---

### Dataset 7: Hospital Patient Flow (`07_hospital_patient_flow.csv`)

**Purpose**: Chapters 5 (distributions), 7 (charts), and Project 6.

**Rows**: 300  
**Domain**: Emergency department patient flow

| Column | Type | Description | Example Values |
|---|---|---|---|
| `Patient_ID` | Text | Anonymised ID | `PAT-0001` |
| `Arrival_Date` | Date | Date of arrival | `2024-01-01` to `2024-06-30` |
| `Arrival_Time` | Time | Time of arrival | `08:23`, `14:05`, `23:47` |
| `Triage_Level` | Integer | Urgency (1=Resuscitation, 5=Non-urgent) | 1–5 |
| `Chief_Complaint` | Text | Reason for visit | `Chest Pain`, `Fracture`, `Abdominal Pain`, `Laceration`, `Fever` |
| `Wait_Time_Min` | Integer | Time from arrival to first assessment | Range: 2 – 240 |
| `Treatment_Time_Min` | Integer | Time in active treatment | Range: 15 – 480 |
| `Discharge_Status` | Text | Outcome | `Discharged`, `Admitted`, `Transferred`, `Left Without Being Seen` |
| `Age_Group` | Text | Patient age band | `0-17`, `18-34`, `35-54`, `55-74`, `75+` |
| `Day_of_Week` | Text | Day arrived | `Monday` through `Sunday` |
| `Shift` | Text | Staff shift | `Day (7-15)`, `Evening (15-23)`, `Night (23-7)` |

**Data characteristics**:
- Wait times follow a log-normal distribution (most short, long tail)
- Triage Level 1 has shortest wait times (by design)
- Weekend evening shift has longest waits (understaffing pattern)
- "Left Without Being Seen" rate ~5%, correlated with long waits

---

### Dataset 8: Product Catalog (`08_product_catalog.csv`)

**Purpose**: Chapters 3 (VLOOKUP/INDEX-MATCH exercises) and 9 (Power BI relationships).

**Rows**: 50  
**Domain**: Product reference table

| Column | Type | Description | Example Values |
|---|---|---|---|
| `Product_ID` | Text | Unique identifier | `PROD-001` |
| `Product_Name` | Text | Name | Same products as sales dataset |
| `Category` | Text | Category | `Technology`, `Furniture`, `Office Supplies` |
| `Sub_Category` | Text | Sub-category | `Phones`, `Chairs`, etc. |
| `Unit_Cost` | Number | Cost per unit | Range: $1.50 – $3,500 |
| `List_Price` | Number | MSRP | Range: $2.50 – $5,000 |
| `Supplier` | Text | Vendor name | `TechCo Distributors`, `Global Office Supply` |
| `Weight_KG` | Decimal | Product weight | Range: 0.1 – 45.0 |
| `Reorder_Level` | Integer | Min stock before reorder | Range: 5 – 100 |

---

### Dataset 9: Monthly Sales Files (12 CSVs) - `datasets/monthly_sales/`

**Purpose**: Chapter 8 (Power Query - combining multiple files from a folder).

**Rows**: ~80-90 per file (~1000 total)  
**Schema**: Same as `01_global_superstore_sales.csv` but split by month for 2024 only.  
**Files**: `sales_jan.csv`, `sales_feb.csv`, ... `sales_dec.csv`

Each file contains the same columns but only rows for that month. Some files have slightly different column orders or casing to simulate real-world messiness that Power Query must handle.

---

## Chapter Specifications

Each chapter follows this structure:
```markdown
# Chapter N - Title

---

## Chapter Overview
[2-3 paragraph introduction. What this chapter covers, why it matters, and what the learner will be able to do after completing it.]

### Prerequisites
- [Specific prior chapters required]
- [Tools/datasets needed]

---

## Learning Objectives
1. [Specific, measurable objective]
2. ...

---

## N.1 Section Title
### N.1.1 Subsection
[Detailed content with explanations, reasoning, examples, tables]

---

## Common Mistakes & Misconceptions
### Mistake 1: [Description]
[Explanation, wrong example, correct example]

---

## Practice Exercises

### Beginner
**Exercise N.1**: [Description]

### Intermediate
**Exercise N.X**: [Description]

### Challenge
**Exercise N.X**: [Description]
```

**Content depth target per chapter**: 600–900 lines of markdown (~20,000–30,000 characters). This matches the SQL course chapters which average ~700 lines each.

---

## Build System

The `build-course.js` script:
- Reads all 13 markdown files (overview + 12 chapters)
- Escapes content for JavaScript template literal embedding
- Generates a single HTML file with:
  - Embedded CSS (dark theme matching SQL course aesthetic)
  - Embedded markdown content as JS data
  - Client-side rendering via `marked.js` from CDN
  - Table of contents with anchor navigation
  - Chapter headers with images and descriptions
  - Print stylesheet for PDF export
  - Responsive layout (mobile-friendly)

**Colour scheme** (adapted from SQL course for analytics identity):
```css
--bg: #0f1117          /* Deep dark background */
--bg-card: #181b23     /* Card/section background */
--bg-code: #1e2029     /* Code block background */
--text: #e1e3ea        /* Primary text */
--dim: #8b8fa3         /* Secondary text */
--bright: #fff         /* Headings, emphasis */
--accent1: #5b8def     /* Primary blue (links, TOC numbers) */
--accent2: #a47de5     /* Purple (H4, accents) */
--accent3: #3ecfb4     /* Teal (H3, blockquotes) */
--accent4: #f0a056     /* Orange (H5, warnings) */
--green: #4ade80       /* Success indicators */
--red: #e85d6f         /* Error indicators */
```

---

## Execution Progress

| Phase | Description | Status |
|---|---|---|
| **Phase 0** | Dataset creation (all 9 datasets + monthly files) | 🔄 In Progress |
| **Phase 1** | Build system + course overview + images | ⬜ Not Started |
| **Phase 2** | Chapters 1–4 (Foundations + Excel Core) | ⬜ Not Started |
| **Phase 3** | Chapters 5–8 (Statistics + Advanced Excel) | ⬜ Not Started |
| **Phase 4** | Chapters 9–11 (Power BI + DAX) | ⬜ Not Started |
| **Phase 5** | Chapter 12 (Projects + Foundations) | ⬜ Not Started |
| **Phase 6** | Build, verify, polish | ⬜ Not Started |

---

*This document is updated as the build progresses.*
