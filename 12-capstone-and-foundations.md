# Chapter 12 - Capstone Projects & Foundations for SQL and Python

---

## Chapter Overview

You have reached the end of the foundational analytics journey. You now possess a toolkit covering analytical thinking, deep Excel mastery, data cleaning, statistical reasoning, data visualisation, and enterprise-grade reporting with Power BI.

This final chapter serves two purposes. First, it provides a series of **Capstone Projects** that simulate real-world requests. These are not step-by-step tutorials; they are business prompts. You must choose the right tool, clean the data, perform the analysis, and present the conclusion.

Second, it looks to the future. Excel and Power BI are incredibly powerful, but eventually, you will encounter data too large or tasks too repetitive for them to handle efficiently. This chapter provides a conceptual introduction to **SQL** and **Python** (pandas) - the next steps in an analyst's career - framing them not as entirely new disciplines, but as translations of the logic you already know.

### Prerequisites

- Chapters 1 through 11 completed.
- Access to all datasets in the `datasets/` folder.
- A blank Excel workbook and a blank Power BI file ready.

---

## 12.1 The Capstone Projects

Treat these projects as if they were assigned by a manager. Do not just produce a number; produce a short, clear email or dashboard that answers the business question and provides a recommendation.

### Project 1: The Profitability Bleed (Retail)

**The Scenario**: The VP of Sales is concerned that despite growing revenue, overall profit margins are shrinking. She wants to know where the bleed is coming from and what to do about it.

**The Data**: `01_global_superstore_sales.csv`

**Your Task**:
1. Identify which Region, Category, or Sub_Category is driving the largest financial losses.
2. Investigate the relationship between `Discount` and `Profit`. Is there a specific discount threshold where orders reliably become unprofitable?
3. Calculate how much total profit would increase if all orders currently given a discount > 30% were instead capped at a 20% discount (assuming volume remained the same).
4. **Deliverable**: A 3-slide presentation or a 1-page dashboard highlighting the problem areas and recommending a new discount policy.

### Project 2: Employee Flight Risk (HR)

**The Scenario**: The HR Director wants to proactively address employee turnover. They have data on current employees and those who recently left.

**The Data**: `03_employee_data.csv`

**Your Task**:
1. Clean the data (ensure dates are correct, check for missing values).
2. Use descriptive statistics to compare the profiles of employees who stayed vs those who left (`Attrition` column). Look at variables like `Salary`, `Satisfaction_Score`, `Years_at_Company`, and `Overtime_Hours`.
3. Use a statistical test (t-test) to prove whether the difference in Satisfaction Score between the two groups is statistically significant.
4. **Deliverable**: A short report identifying the top 3 leading indicators of employee attrition, and a recommendation on which departments need immediate HR intervention.

### Project 3: Marketing ROI Optimisation (Digital Marketing)

**The Scenario**: The Marketing team has a fixed budget for next quarter and needs to allocate it across their three primary channels (Search, Social, Email) to maximise conversions.

**The Data**: `05_marketing_campaigns.csv`

**Your Task**:
1. Calculate the historical Cost Per Conversion (`Spend / Conversions`) for each channel.
2. Build a scatter plot showing Spend vs Conversions for all campaigns. Add trendlines. Which channel scales best?
3. Build a What-If model in Excel. Set up inputs for budget allocation across the three channels. Calculate projected conversions based on historical rates.
4. Use Solver (or Goal Seek) to find the optimal budget allocation to maximise conversions, assuming a total budget of $100,000, with a constraint that no single channel can receive more than 60% of the total budget.
5. **Deliverable**: An Excel model with a "Current Allocation" vs "Optimised Allocation" comparison, showing the projected lift in conversions.

### Project 4: Production Anomaly Detection (Oil & Gas)

**The Scenario**: An operations manager oversees hundreds of oil wells. They need a systematic way to identify wells that are underperforming so they can dispatch maintenance crews efficiently.

**The Data**: `04_oil_gas_production.csv`

**Your Task**:
1. Load the data into Power BI.
2. Create a measure for `Average Daily Production = SUM(Oil_BBL) / SUM(Days_Online)`.
3. Calculate the basin-wide average daily production.
4. Using the IQR method or Z-scores (via DAX measures), flag wells that are severe negative outliers compared to their peers in the same Basin.
5. **Deliverable**: A Power BI dashboard designed for the dispatch team. It should feature a table filtered to show *only* the flagged underperforming wells, sorted by the severity of the underperformance.

---

## 12.2 Moving Beyond Spreadsheets

You have solved complex problems using Excel and Power BI. But what happens when:
- The raw dataset is 50 gigabytes (Excel will not open it, Power BI Desktop will struggle to load it).
- You need to join data from 7 different live databases instantly.
- You need to run a complex cleaning pipeline on a server every 5 minutes.
- You need to build a predictive machine learning model.

This is where the GUI (Graphical User Interface) ends, and coding begins. The two dominant languages in data are **SQL** and **Python**.

---

## 12.3 Foundations of SQL (Structured Query Language)

SQL is the language used to communicate with relational databases (like PostgreSQL, MySQL, SQL Server, BigQuery). When data gets too big for Excel, it lives in a database. SQL is how you ask the database for a specific subset of that data.

### 12.3.1 The Mindset Translation

You already know SQL concepts; you just know them by their Excel/Power BI names.

| Excel / Power BI Concept | SQL Equivalent |
|---|---|
| Select specific columns | `SELECT` |
| The Table Name | `FROM` |
| Filter (Slicers, AutoFilter) | `WHERE` |
| Grouping (Rows area in PivotTable) | `GROUP BY` |
| Aggregation (SUM, COUNT in Values area) | Aggregation functions (`SUM()`, `COUNT()`) |
| Filter aggregated results (Value Filters) | `HAVING` |
| Sort (A-Z) | `ORDER BY` |
| VLOOKUP / Data Model Relationships | `JOIN` |

### 12.3.2 A Basic SQL Query

If you wanted to build a PivotTable showing Total Sales by Region for the year 2023, sorted highest to lowest, the SQL looks like this:

```sql
SELECT 
    Region, 
    SUM(Sales) AS Total_Sales
FROM 
    GlobalSuperstore
WHERE 
    YEAR(Order_Date) = 2023
GROUP BY 
    Region
ORDER BY 
    Total_Sales DESC;
```

Read it like English: "Select the Region column and the sum of Sales. Call that sum Total_Sales. Get this from the GlobalSuperstore table. Only include rows where the year is 2023. Group the results by Region. Finally, sort it by Total_Sales descending."

### 12.3.3 The Power of JOINs

SQL handles relationships via `JOIN`s, replacing the need for the Excel Data Model locally.

```sql
SELECT 
    Sales.Order_ID,
    Products.Category,
    Sales.Sales
FROM 
    Sales
INNER JOIN Products 
    ON Sales.Product_Name = Products.Product_Name;
```

This merges the Sales and Products tables based on the matching `Product_Name` column, returning a clean dataset ready for analysis.

**Why learn SQL next?** It is the most universal language in data. Nearly every modern analytical tool (Tableau, Power BI, Python, Looker) expects you to pull data using SQL first.

---

## 12.4 Foundations of Python (and pandas)

Python is a general-purpose programming language. For data analytics, we use a specific Python library called **pandas**.

Pandas is essentially "Excel on steroids without a user interface." It represents data in a `DataFrame` (which looks exactly like an Excel table).

### 12.4.1 The Mindset Translation

| Excel / Power BI Concept | Python (pandas) Equivalent |
|---|---|
| Open a CSV file | `pd.read_csv()` |
| Look at the first few rows | `df.head()` |
| Filter a column | `df[df['Region'] == 'Europe']` |
| Create a PivotTable | `df.pivot_table()` |
| Calculated Column | `df['Profit_Margin'] = df['Profit'] / df['Sales']` |
| VLOOKUP | `df.merge()` |
| Remove Duplicates | `df.drop_duplicates()` |
| Replace Values | `df.replace()` |

### 12.4.2 A Basic Python Script

Let us replicate a Power Query cleaning process and a PivotTable in Python.

```python
import pandas as pd

# 1. Load the data (like opening the CSV)
df = pd.read_csv('02_sales_dirty.csv')

# 2. Clean the data (like Power Query steps)
df.dropna(inplace=True)                        # Remove blank rows
df.drop_duplicates(inplace=True)               # Remove duplicates
df['Region'] = df['Region'].str.strip()        # TRIM spaces
df['Region'] = df['Region'].str.title()        # PROPER case

# 3. Create a calculated column
df['Profit_Margin'] = df['Profit'] / df['Sales']

# 4. Create a PivotTable summary
summary = df.pivot_table(
    values='Sales', 
    index='Region', 
    aggfunc='sum'
)

# 5. Show the result
print(summary)
```

### 12.4.3 Why Learn Python?

1. **Automation**: You can write a Python script that connects to an API, downloads data, cleans it, runs a statistical model, creates an Excel report, and emails it to your boss - all scheduled to run at 3:00 AM every day without human intervention.
2. **Advanced Statistics & Machine Learning**: Python contains libraries (`scikit-learn`, `statsmodels`) that can perform predictive analytics (forecasting, classification) far beyond Excel's capabilities.
3. **Unstructured Data**: If you need to analyze text (e.g., sentiment analysis of 10,000 customer reviews) or images, Python is required.

---

## 12.5 The Analyst's Continuous Learning Path

You are now a highly capable descriptive and diagnostic analyst. You can answer "What happened?" and "Why did it happen?" reliably and professionally.

**Your recommended next 12 months:**
1. **Months 1-3**: Master Excel Advanced features and Power BI DAX. Build real projects using your company's data. Apply the visualisation principles rigidly until they become habit.
2. **Months 4-6**: Learn SQL. Start by writing `SELECT` queries to pull your own data directly from the database instead of asking IT for CSV exports. Master `GROUP BY` and `JOIN`.
3. **Months 7-12**: Learn Python. Start by automating your most boring, repetitive Excel tasks using the `pandas` library.

**Final Advice**: Tools change. Excel updates, Power BI adds features, new programming languages emerge. What does not change is the **analytical mindset**:
- Ask "Compared to what?"
- Never trust data without cleaning it first.
- Let the business question dictate the tool, not the other way around.
- Communicate with clarity, honesty, and an eye for action.

Congratulations on completing the course. Now go analyse.


## In Simple Terms (TL;DR)

> **ELI5 (Explain Like I'm 5):**
> You are now an analyst! SQL is for pulling data directly from databases, and Python is for writing code to do math. These are the next steps in your journey.

