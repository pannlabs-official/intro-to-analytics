# Chapter 8 - Advanced Excel: Dynamic Arrays, Power Query & What-If

---

## Chapter Overview

If Chapters 2-6 covered the essential skills every analyst needs, this chapter covers the skills that separate the top 10% of Excel users from the rest.

We will cover three massive features:
1. **Dynamic Array Functions** (Excel 365 / 2021+ only): The biggest change to Excel's calculation engine in 30 years. Functions that "spill" arrays of data, allowing you to filter, sort, and extract unique lists with single, elegant formulas.
2. **Power Query (Advanced)**: Moving beyond the basic cleaning in Chapter 4, we will use Power Query to automate the "folder combine" - taking 12 monthly CSV files and merging them into a single analytical dataset in one click.
3. **Prescriptive Analytics (What-If)**: Using Goal Seek, Data Tables, and Scenario Manager to model future possibilities and find optimal solutions.

### Prerequisites

- Chapters 3 (Formulas) and 4 (Power Query basics) completed
- `datasets/01_global_superstore_sales.csv` loaded
- `datasets/monthly_sales/` folder available (contains 12 CSV files)
- **Software requirement**: Dynamic Arrays require Microsoft 365 or Excel 2021+. If you have an older version, read the concepts but you will not be able to execute the Dynamic Array functions.

---

## 8.1 The Dynamic Array Revolution

### 8.1.1 What Is "Spilling"?

For 30 years, an Excel formula returned exactly one value into the cell where it was written. If you wanted 10 values, you had to copy the formula down 10 rows.

In Excel 365, formulas can return an *array* (a grid) of values. You type the formula in one cell, press Enter, and the results **spill** into adjacent empty cells. A thin blue border appears around the spilled range when you click any cell inside it.

If a spilled array hits a cell containing data, it returns a `#SPILL!` error. Clear the blocking data, and the formula instantly spills.

### 8.1.2 UNIQUE - Instant Distinct Lists

Before: You had to copy a column, paste it somewhere else, and click "Remove Duplicates" (which did not update if the source data changed).

Now:
```
=UNIQUE(SalesData[Customer_Name])
```
Type this in one cell, and it spills a unique list of every customer. If a new customer is added to the source Table, the unique list expands automatically.

**Two-column unique list**:
```
=UNIQUE(SalesData[[Region]:[Country]])
```
Returns every unique combination of Region and Country.

### 8.1.3 SORT and SORTBY

Before: You had to use the Data → Sort ribbon buttons, which rearranged the original data.

Now:
```
=SORT(UNIQUE(SalesData[Customer_Name]))
```
Creates an alphabetical, unique list of customers. The original data remains untouched.

**SORTBY**: Sort an array based on a different array.
```
=SORTBY(SalesData[Customer_Name], SalesData[Sales], -1)
```
Returns a list of customers sorted by their sales amounts in descending order (`-1`).

### 8.1.4 FILTER - The Formula Version of the Filter Tool

Before: You had to use Advanced Filter (clunky) or complex, unreadable `INDEX/AGGREGATE` array formulas.

Now:
```
=FILTER(SalesData, SalesData[Region] = "Europe", "No Data")
```
This formula spills the *entire SalesData table*, but only for European orders. If there are no European orders, it returns "No Data".

**Multiple conditions**:
Use `*` for AND logic, `+` for OR logic.

Filter for Europe AND Technology:
```
=FILTER(SalesData, (SalesData[Region]="Europe") * (SalesData[Category]="Technology"))
```

### 8.1.5 The Spilled Range Operator (`#`)

How do you reference a dynamic array in another formula if you don't know how big it will be? You use the hash symbol `#`.

If you typed `=UNIQUE(SalesData[Region])` in cell `J2`, it might spill down to `J6`.
To count the unique regions, you write:
```
=COUNTA(J2#)
```
The `#` tells Excel: "Look at cell J2, and include everything it spills into." This reference is fully dynamic.

### 8.1.6 Advanced Array Functions

**LET**: Assigns names to calculation results within a formula. It makes formulas readable and dramatically improves performance by preventing Excel from calculating the same thing twice.

```
=LET(
    EurSales, FILTER(SalesData, SalesData[Region]="Europe"),
    TotalEur, SUM(INDEX(EurSales, 0, 14)), 
    TotalEur
)
```
*(Note: INDEX(array, 0, 14) returns the entire 14th column of the array, which is Sales).*

**LAMBDA**: Allows you to create your own custom functions without writing VBA code. (Advanced, out of scope for this foundation course, but know it exists as the ultimate Excel tool).

---

## 8.2 Power Query: The Folder Combine

This is the most "magical" feature in Excel. Imagine you receive a daily or monthly CSV file of sales. You need to combine all 12 files for the year into one dataset. Copy-pasting them manually takes 30 minutes, introduces errors, and has to be redone if a file is updated.

Power Query can combine a folder of 1,000 files in 10 seconds.

### 8.2.1 Setting Up the Folder Combine

We will use the `datasets/monthly_sales/` directory, which contains 12 CSV files (`sales_jan.csv` through `sales_dec.csv`).

1. Open a blank Excel workbook.
2. Data → Get Data → From File → **From Folder**.
3. Browse to the `datasets/monthly_sales/` directory. Click Open.
4. A dialog appears listing the 12 files (showing metadata like Date Created, Extension).
5. At the bottom, click the arrow next to Combine → select **Combine & Transform Data**.

### 8.2.2 The Combine Process

6. The "Combine Files" dialog appears. It looks at the first file (the "Sample File") to understand the structure.
7. Ensure the delimiter is set correctly (Comma) and the data looks correct in the preview. Click OK.

Power Query now creates a complex set of helper queries in the background. It opens the Power Query Editor, showing a single, massive table containing the data from all 12 files.

### 8.2.3 Cleaning the Combined Data

Notice the first column is `Source.Name`. It contains the filename (e.g., "sales_jan.csv"). This is incredibly useful - it acts as an audit trail telling you exactly which file a row came from.

1. Let us extract the month from the filename.
2. Select the `Source.Name` column.
3. Transform → Extract → Text Between Delimiters.
4. Start Delimiter: `_` (underscore). End Delimiter: `.csv`.
5. The column now contains "jan", "feb", "mar". Rename the column to `Month`.
6. Apply any other standard cleaning steps (checking data types, removing blank rows).

### 8.2.4 Loading and Automating

7. Home → Close & Load.
8. Excel creates a Table containing the fully combined, cleaned dataset.

**The Magic Trick**:
If you receive `sales_2025_jan.csv` next year, you simply drop the file into that folder, open this Excel workbook, right-click the Table, and click **Refresh**. Power Query will automatically detect the new file, run it through the exact same extraction and cleaning steps, and append it to the bottom of the table. A 30-minute monthly task is reduced to 1 click.

---

## 8.3 Prescriptive Analytics (What-If Tools)

Descriptive analytics tells you what happened. Predictive tells you what will happen. Prescriptive tells you *what you should do to achieve a specific goal*.

Excel's "What-If Analysis" tools handle this.

### 8.3.1 Goal Seek

Goal Seek solves problems backward. Instead of tweaking inputs until the formula outputs the number you want, you tell Excel the answer, and it calculates the input needed to get there.

**Scenario**: You are modelling a marketing campaign.
- Cost per Click (CPC): $2.00
- Clicks: 5,000
- Total Cost: $10,000
- Conversion Rate: 3%
- Total Conversions: 150
- Revenue per Conversion: $100
- Total Revenue: $15,000
- Profit: $5,000

**The Goal**: You want $10,000 in profit. Assuming CPC, Conversion Rate, and Revenue per Conversion are fixed, how many clicks do you need to buy?

1. Build the model in cells with formulas linking everything together.
2. Data → What-If Analysis → **Goal Seek**.
3. **Set cell**: Select the Profit cell (must contain a formula).
4. **To value**: Type `10000`.
5. **By changing cell**: Select the Clicks cell (must contain a hardcoded number, not a formula).
6. Click OK. Excel iterates through numbers until it finds the exact number of clicks required (in this case, 10,000 clicks).

### 8.3.2 Data Tables (Sensitivity Analysis)

A Data Table lets you see all possible outcomes when you vary one or two inputs, creating a matrix of results.

**Scenario**: You want to see how Profit changes if the Conversion Rate varies from 1% to 5% AND the Revenue per Conversion varies from $50 to $150.

1. Set up a grid. Leave the top-left cell blank.
2. Down the left column (e.g., A2:A6), list conversion rates: 1%, 2%, 3%, 4%, 5%.
3. Across the top row (e.g., B1:F1), list revenue amounts: 50, 75, 100, 125, 150.
4. In the top-left cell (A1), link to the original Profit calculation cell (e.g., `=B8`).
5. Select the entire grid (A1:F6).
6. Data → What-If Analysis → **Data Table**.
7. **Row input cell**: Select the original Revenue per Conversion cell in your model.
8. **Column input cell**: Select the original Conversion Rate cell in your model.
9. Click OK. Excel fills the entire matrix with the profit outcome for every combination.

**Why this is powerful**: Instead of presenting management with one "base case" number, you present a risk matrix. "If conversions drop to 2%, we need revenue per conversion to hit $125 just to break even."

### 8.3.3 Introduction to Solver

Goal Seek handles one changing variable. **Solver** handles multiple variables, subject to constraints. It uses linear programming algorithms to find the absolute optimal solution.

Solver is an Add-in (File → Options → Add-Ins → Go → check Solver Add-in).

**Scenario**: You have an advertising budget of $50,000. You can spend it on Search Ads, Social Media, and Email.
- Search: $5 per lead, max capacity 5,000 leads
- Social: $8 per lead, max capacity 10,000 leads
- Email: $3 per lead, max capacity 2,000 leads

You want to *Maximise* Total Leads, by changing the spend in each channel, subject to the constraints:
1. Total spend <= $50,000
2. Spend in any channel cannot exceed its (max capacity * cost)
3. Spend must be >= 0

You set this up in the Solver parameters box, click "Solve", and the Simplex LP engine calculates the mathematically perfect allocation of your budget.

*(Solver is a deep topic worthy of its own course, but as an analyst, you must know it exists for optimisation problems).*

---

## Common Mistakes & Misconceptions

### Mistake 1: `#SPILL!` Errors

If a dynamic array formula returns `#SPILL!`, it means something is in the way. People often try to edit the formula to fix it.
**Fix**: Find the cell containing the formula. Look at the blue dashed line indicating where it *wants* to spill. Delete the text/data sitting inside that blue border.

### Mistake 2: Dynamic Arrays inside Excel Tables

Dynamic array formulas (`UNIQUE`, `FILTER`, `SORT`) **do not work inside Tables** (`Ctrl+T`). A Table expects every row to behave identically; a spilling array breaks this architecture.
**Fix**: Put dynamic array formulas in plain ranges. You can reference a Table *from* a dynamic array, but the array itself cannot live inside one.

### Mistake 3: Hardcoding File Paths in Power Query

If you build a folder combine, and then email the workbook to a colleague, the Power Query refresh will fail. Why? The file path points to `C:\Users\YourName\Desktop\monthly_sales\`. Your colleague does not have that folder.
**Fix**: Advanced Power Query users build dynamic file paths (reading the path from an Excel cell). For basic users: tell the recipient they must go into the Power Query Editor, click the "Source" step, and update the folder path to their own machine.

### Mistake 4: Not Formatting Data Table Results

A Data Table fills with raw numbers. It is hard to read.
**Fix**: Always apply Conditional Formatting (Color Scales) to Data Table outputs. A green-to-red gradient instantly visualises the "safe zone" vs the "danger zone" across your variables.

---



## In Simple Terms (TL;DR)

> **ELI5 (Explain Like I'm 5):**
> Dynamic arrays let one formula spill out multiple answers automatically. What-If analysis lets you guess the future ("What if we raise prices by $5?").

## Practice Exercises

### Beginner (Requires Excel 365 / 2021+)

**Exercise 8.1**: Open `SalesData`. On a new sheet, use the `UNIQUE` function to generate a list of all unique values in the `Sub_Category` column.

**Exercise 8.2**: Wrap the formula from 8.1 in a `SORT` function so the list of sub-categories is in alphabetical order.

**Exercise 8.3**: In an adjacent cell, use `COUNTA` combined with the spill operator (`#`) to count how many unique sub-categories exist.

### Intermediate

**Exercise 8.4**: Set up the folder combine. Use Power Query to combine the 12 files in `datasets/monthly_sales/`. Extract the month from the filename into a new column. Load the result to an Excel sheet. How many total rows are in the combined dataset?

**Exercise 8.5**: Test the automation. Open the combined Excel file. In your file explorer, delete `sales_dec.csv` from the folder. Go back to Excel and Refresh the query. Does the row count drop? (Put the file back when you are done!).

**Exercise 8.6**: Build a simple profit model. Price = $100. Cost = $60. Volume = 500. Profit = (Price - Cost) * Volume. Use Goal Seek to find out what Volume you need to reach exactly $35,000 in Profit.

### Challenge (Requires Excel 365 / 2021+)

**Exercise 8.7**: Build a dynamic search bar.
1. In cell A1, type a Country name (e.g., "Germany").
2. In cell A3, write a `FILTER` formula that returns the `Order_ID`, `Customer_Name`, `Sales`, and `Profit` columns from `SalesData`, but only for the Country typed in A1.
3. Wrap it in a `SORT` function to sort the results by `Sales` (descending).
4. Now change the text in A1 to "France". The entire table of results should instantly update. You have just built a functional mini-app with one formula.

**Exercise 8.8**: Build a Two-Variable Data Table. Recreate the Marketing Campaign scenario from Section 8.3.2. Build the model, create the matrix of Conversion Rates (1% to 5%) vs Revenue per Conversion ($50 to $150), and use the Data Table tool to populate the profits. Apply a Color Scale conditional format to the results grid.
