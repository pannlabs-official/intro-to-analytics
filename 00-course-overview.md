# Data Analytics Course - Complete Course Overview

---

## Welcome

This is a comprehensive, hands-on data analytics course designed to take you from complete beginner to confident analyst over approximately six weeks. It is not a surface-level introduction filled with definitions and motivational platitudes. Every chapter builds real skill - from understanding what data actually *is*, through deep mastery of Excel, statistical reasoning, and data visualisation, to building enterprise-grade reports and dashboards in Power BI.

The course is structured around two primary tools: **Microsoft Excel** (your analytical workbench - where you think, explore, and prototype) and **Power BI Desktop** (your reporting and modelling layer - where you build scalable, interactive dashboards for others to consume). By the end of the course, you will also have a foundational understanding of **SQL** and **Python** that prepares you to learn those tools next.

By the end of this course, you will not just "know Excel" or "know Power BI." You will understand *why* data behaves the way it does, *how* to ask the right questions, *when* to apply which tool, and *how* to communicate findings in a way that drives decisions.

---

## Who This Course Is For

- Complete beginners who have never done data analysis beyond basic spreadsheet use
- Career changers moving into data analytics, business intelligence, or operations
- Professionals in any field (finance, oil & gas, healthcare, marketing) who want to make better decisions with data
- Anyone who has tried learning analytics from YouTube videos and felt the explanations were too shallow or disconnected

### Prerequisites

- **Technical**: None. We start from scratch - what data is, how Excel works, how to navigate the interface.
- **Software**: Microsoft Excel (Microsoft 365 recommended - required for dynamic arrays in Chapter 8). Power BI Desktop (free, Windows only - introduced in Chapter 9).
- **Mindset**: Willingness to follow along step-by-step, type formulas yourself (not copy-paste), and think through the exercises before checking answers.

---

## Course Structure

The course is divided into **12 chapters**, grouped into four phases. Each phase builds on the previous. The progression follows the natural learning arc: *understand data* → *learn your tool* → *reason with statistics* → *communicate with visuals* → *scale with Power BI* → *apply everything*.

### Phase Map

| Phase | Chapters | Focus | Duration |
|---|---|---|---|
| **I: Foundations** | 1–2 | What analytics is, Excel fluency | Week 1 |
| **II: Core Skills** | 3–6 | Functions, data cleaning, statistics, PivotTables | Weeks 2–3 |
| **III: Communication & Advanced Excel** | 7–8 | Visualisation, dynamic arrays, Power Query | Week 4 |
| **IV: Power BI & Application** | 9–12 | Data modelling, DAX, dashboards, capstone projects | Weeks 5–6 |

### Chapter Map

| Chapter | Title | What You'll Learn |
|---|---|---|
| **1** | What Is Data Analytics? | Types of analytics, the analytics lifecycle, data types, thinking like an analyst |
| **2** | Excel Foundations | Cell references, Tables, sorting, filtering, formatting, keyboard navigation |
| **3** | Formulas & Functions | 40+ functions: logical, lookup, text, date, math, information functions |
| **4** | Data Cleaning & Transformation | Duplicates, text cleaning, type conversion, data validation, Power Query intro |
| **5** | Statistics for Analysts | Descriptive stats, distributions, probability, correlation, hypothesis testing |
| **6** | PivotTables | Creating, calculating, grouping, slicers, PivotCharts, data model PivotTables |
| **7** | Data Visualisation | Chart selection, design principles, dashboards, storytelling with data |
| **8** | Advanced Excel | Dynamic arrays (FILTER, SORT, UNIQUE, LET, LAMBDA), Power Query, What-If, Solver |
| **9** | Introduction to Power BI | Interface, Get Data, Power Query in PBI, data modelling, first report |
| **10** | DAX | Calculated columns, measures, filter context, CALCULATE, time intelligence, iterators |
| **11** | Power BI Reports & Dashboards | Design principles, interactivity, RLS, publishing, performance, storytelling |
| **12** | Capstone Projects | 6 industry projects + SQL and Python foundations |

### Chapter Dependencies

```
Ch.1 (What Is Data Analytics?)
 └── Ch.2 (Excel Foundations)
      ├── Ch.3 (Formulas & Functions)
      │    └── Ch.4 (Data Cleaning)
      │         └── Ch.5 (Statistics)
      │              └── Ch.6 (PivotTables)
      │                   └── Ch.7 (Data Visualisation)
      │                        └── Ch.8 (Advanced Excel)
      │                             └── Ch.9 (Power BI Intro)
      │                                  └── Ch.10 (DAX)
      │                                       └── Ch.11 (Reports & Dashboards)
      └──────────────────────────────────────── Ch.12 (Projects - uses everything)
```

---

## Datasets Used

This course uses **9 datasets** covering 6 industry domains. All datasets are included in the `datasets/` folder and are documented in `datasets/README.md`.

### Primary Datasets

| # | Dataset | Rows | Domain | Used In |
|---|---|---|---|---|
| 1 | `01_global_superstore_sales.csv` | 1,000 | Multinational retail | Ch. 2–12 (primary) |
| 2 | `02_sales_dirty.csv` | ~80 | Retail (deliberately messy) | Ch. 4 (cleaning exercises) |
| 3 | `03_employee_data.csv` | 200 | HR / People analytics | Ch. 5, 6, 7, Project 2 |

### Industry-Specific Datasets

| # | Dataset | Rows | Domain | Used In |
|---|---|---|---|---|
| 4 | `04_oil_gas_production.csv` | 900 | Oil & gas upstream | Ch. 5, 7, Project 4 |
| 5 | `05_marketing_campaigns.csv` | 300 | Digital marketing | Ch. 5, 7, Project 5 |
| 6 | `06_financial_budget_actuals.csv` | ~240 | Corporate finance | Ch. 7, 8, Project 3 |
| 7 | `07_hospital_patient_flow.csv` | 300 | Emergency department | Ch. 5, 7, Project 6 |

### Reference & Exercise Datasets

| # | Dataset | Rows | Domain | Used In |
|---|---|---|---|---|
| 8 | `08_product_catalog.csv` | 55 | Product reference table | Ch. 3 (lookups), Ch. 9 (relationships) |
| 9 | `monthly_sales/*.csv` | ~1,000 total | 12 monthly retail files | Ch. 8 (Power Query folder combine) |

---

## Tools Required

### Must-Have (Install Before Chapter 1)

| Tool | Purpose | Download |
|---|---|---|
| **Microsoft Excel** | Primary analytical tool (Chapters 2–8) | Part of Microsoft 365 subscription |
| **Power BI Desktop** | Reporting and dashboard tool (Chapters 9–12) | [powerbi.microsoft.com](https://powerbi.microsoft.com/desktop/) (free, Windows only) |

> **Excel version note**: This course uses features available in Microsoft 365 (Excel for Windows/Mac). Most content works in Excel 2019/2021, but **Chapter 8 (Dynamic Arrays)** requires Microsoft 365 for functions like `FILTER`, `SORT`, `UNIQUE`, `LET`, and `LAMBDA`. If you have an older version, you can still follow the explanations - the functions simply won't be available to practice.

### Optional (Used in Later Chapters)

| Tool | Purpose | When Needed |
|---|---|---|
| **Python 3.10+** | Taste of pandas for data analysis | Ch. 12 (foundational preview) |
| **A text editor** (VS Code, Notepad++) | Viewing CSV files, writing scripts | Any chapter |

---

## How to Use This Course

### If You Are a Learner

1. **Download the datasets first**. Copy the `datasets/` folder to a location you can easily access from Excel and Power BI.
2. **Follow each chapter in order**. Each chapter assumes knowledge from previous chapters.
3. **Type every formula yourself**. Do not copy-paste from the notes. The act of typing builds muscle memory for Excel syntax and catches errors that reading alone misses.
4. **Do the exercises** at the end of each chapter before moving on. They are graded: Beginner → Intermediate → Challenge. Start with Beginner even if you feel confident.
5. **When you get an error**, read the error value carefully (`#REF!`, `#VALUE!`, `#N/A`). This course explains every common error so you can diagnose problems independently.
6. **Take notes** on concepts that surprise you. The gap between what you expected and what actually happened is where real learning occurs.

### If You Are a Trainer

- Each chapter works as a standalone 2-3 hour training session
- Worked examples are designed for live demonstration - open the dataset, walk through the formula step by step
- "Common Mistakes" sections are excellent for interactive sessions: show the broken formula first, ask trainees to diagnose it
- Practice exercises work as in-class work or homework
- The 6 capstone projects in Chapter 12 work well as assessed coursework or portfolio pieces

---

## Conventions Used in This Course

### Formulas

All Excel formulas are shown in code blocks with explanatory comments:

```
=IF(B2>1000, "High Value", "Standard")
```

### Expected Output

After worked examples, the expected result is shown:

| Customer | Segment | Result |
|---|---|---|
| Maria Schmidt | Consumer | Standard |
| John Okafor | Corporate | High Value |

### Tool-Specific Notes

Where Excel and Power BI differ, or where version matters, it is called out:

> **Excel 365 only**: The `XLOOKUP` function requires Microsoft 365 or Excel 2021. In older versions, use `INDEX/MATCH` (shown alongside).

### Warning Boxes

Dangerous operations or critical misconceptions:

> ⚠️ **WARNING**: Deleting rows from a dataset that feeds a PivotTable or Power BI report will break those downstream outputs. Always work on a copy of your source data.

### Common Mistake Boxes

> ❌ **Common Mistake**: Using `=A1+B1+C1+D1` instead of `=SUM(A1:D1)`. The manual approach breaks when you insert or delete columns. `SUM` automatically adjusts.

---

## File Structure

```
Intro to Analytics/
├── datasets/                              ← All course datasets (see datasets/README.md)
├── 00-course-overview.md                  ← You are here
├── 01-what-is-data-analytics.md           ← Chapter 1
├── 02-excel-foundations.md                ← Chapter 2
├── 03-formulas-and-functions.md           ← Chapter 3
├── 04-data-cleaning-transformation.md     ← Chapter 4
├── 05-statistics-for-analysts.md          ← Chapter 5
├── 06-pivottables.md                      ← Chapter 6
├── 07-data-visualisation.md               ← Chapter 7
├── 08-advanced-excel.md                   ← Chapter 8
├── 09-intro-to-power-bi.md               ← Chapter 9
├── 10-dax.md                              ← Chapter 10
├── 11-power-bi-reports-dashboards.md      ← Chapter 11
├── 12-capstone-and-foundations.md          ← Chapter 12
├── build-course.js                        ← Node.js build script
└── data-analytics-course.html             ← Generated course (open in browser)
```

---

## What Makes This Course Different

1. **Depth over breadth**: Each concept is explained with enough detail that you understand *why* the formula works, not just *what* to type. When you encounter a variation you haven't seen, you will be able to reason about it.

2. **Real datasets, not toy examples**: You work with 9 datasets across retail, oil & gas, finance, marketing, healthcare, and HR. The data has realistic messiness, patterns, and volume.

3. **Statistics as reasoning, not memorisation**: Chapter 5 teaches you to *think* with statistics - not just compute them. You will understand why the median is better than the mean for salary data, why correlation does not imply causation, and how to interpret a p-value in plain English.

4. **Excel at depth, not surface level**: Most courses teach 10 functions and call it done. This course covers 40+ functions, explains when each is appropriate, and shows the real-world scenarios where they matter.

5. **Power BI with proper data modelling**: Most Power BI tutorials jump straight to building visuals. This course teaches data modelling *first* - because a well-modelled dataset makes everything downstream (DAX, reports, performance) dramatically easier.

6. **Industry diversity**: Examples are drawn from finance, oil & gas, healthcare, marketing, HR, and retail. You will see how the same analytical techniques apply across domains.

---

## Next Step

→ Open **Chapter 1: What Is Data Analytics?** and begin.


## In Simple Terms (TL;DR)

> **ELI5 (Explain Like I'm 5):**
> This course teaches you how to use Excel, stats, and Power BI to make smart business choices. We start simple and end with you building real dashboards.

