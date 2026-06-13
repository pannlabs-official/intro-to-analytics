# Chapter 2 - Excel Foundations: The Spreadsheet as a Thinking Tool

---

## Chapter Overview

This chapter is not a list of menus and buttons. It is a foundation - the habits, navigation patterns, and structural decisions that determine whether your spreadsheets are powerful analytical tools or fragile, error-prone messes.

Most people learn Excel by poking around until something works. That produces spreadsheets with merged cells everywhere, data scattered across 17 tabs, dates that aren't really dates, and formulas that break the moment you insert a column. We are going to do it differently.

By the end of this chapter, you will navigate Excel without touching the mouse, understand cell references deeply enough to never be confused by `$A$1` again, know why Tables (`Ctrl+T`) are the single most important feature for any analyst, and have built your first structured, analysis-ready dataset.

### Prerequisites

- Microsoft Excel installed (Microsoft 365 recommended)
- `datasets/01_global_superstore_sales.csv` downloaded and accessible

---

## Learning Objectives

By the end of this chapter, you will be able to:

1. Navigate the Excel interface using keyboard shortcuts that eliminate unnecessary mouse usage
2. Explain the difference between relative, absolute, and mixed cell references, and apply each correctly
3. Structure data following best practices that make downstream analysis (PivotTables, Power BI) work correctly
4. Convert a range to a Table (`Ctrl+T`) and explain why Tables are superior to plain ranges
5. Apply number formatting, including custom formats, and understand the difference between stored values and displayed values
6. Sort data by single and multiple columns, and filter data using AutoFilter, custom filters, and advanced criteria
7. Create and use Named Ranges for readable, maintainable formulas

---

## 2.1 The Excel Interface - What Actually Matters

When you open Excel, you see dozens of ribbon tabs, hundreds of buttons, and a grid of a million rows. Most of it is noise for now. Here is what you need to focus on:

### 2.1.1 The Five Critical Areas

| Area | Where | What It Does | Why It Matters |
|---|---|---|---|
| **Name Box** | Top-left, shows cell address (e.g., `A1`) | Displays current cell reference. You can type a cell address and press Enter to jump there. | Fastest way to navigate to a specific cell. Also shows Named Ranges when you click the dropdown. |
| **Formula Bar** | Next to Name Box, long white bar | Shows the *actual content* of the selected cell - the formula, not the displayed value. | Essential for debugging. The cell might show `$1,234.56` but the Formula Bar reveals `=B2*C2*1.15`. |
| **Column/Row Headers** | Grey letters (A, B, C...) and numbers (1, 2, 3...) | Identify cells. Click a header to select the entire column or row. | Used constantly for selecting ranges, inserting, deleting. |
| **Sheet Tabs** | Bottom of the window | Switch between worksheets in the same workbook. Right-click to rename, move, copy, delete, or colour-code. | Good organisation uses descriptive tab names: `Sales_Data`, `Lookup_Tables`, `Dashboard` - not `Sheet1`, `Sheet2`. |
| **Status Bar** | Very bottom of the window | Shows quick calculations for selected cells: Sum, Average, Count, Min, Max. | Free instant analytics. Select a column of numbers and immediately see the sum and average without writing any formula. |

### 2.1.2 Keyboard Navigation - Become Mouse-Free

The single biggest productivity improvement for any Excel user is reducing mouse usage. Every time you move your hand from the keyboard to the mouse, you lose 1-2 seconds. Over a full day of analysis, this adds up to 30+ minutes.

**Essential navigation shortcuts**:

| Shortcut | Action | Notes |
|---|---|---|
| `Ctrl + Arrow` | Jump to the edge of the current data region | `Ctrl+Down` jumps to the last filled cell in the column. Hits the "wall" of data. |
| `Ctrl + Shift + Arrow` | Select from current cell to the edge of data | Selects an entire column of data instantly |
| `Ctrl + Home` | Jump to cell A1 | Return to the beginning |
| `Ctrl + End` | Jump to the last used cell | The bottom-right corner of your data |
| `Ctrl + Shift + End` | Select from current cell to the last used cell | Selects the entire data area |
| `F5` or `Ctrl + G` | Go To dialog | Jump to a specific cell, Named Range, or special cells (blanks, errors, formulas) |
| `Ctrl + Space` | Select entire column | Selects the column of the active cell |
| `Shift + Space` | Select entire row | Selects the row of the active cell |
| `Alt + =` | AutoSum | Inserts `=SUM()` for adjacent numbers |
| `Ctrl + ;` | Insert today's date | Inserts a static date (does not update) |
| `Ctrl + Shift + ;` | Insert current time | Inserts a static time |

**Editing shortcuts**:

| Shortcut | Action |
|---|---|
| `F2` | Enter edit mode for the active cell (cursor appears in the cell) |
| `Escape` | Cancel current edit |
| `Ctrl + Z` | Undo (up to 100 levels) |
| `Ctrl + Y` | Redo |
| `Ctrl + D` | Fill down (copies the cell above into the selected cells) |
| `Ctrl + R` | Fill right (copies the cell to the left) |
| `Ctrl + '` (apostrophe) | Copy the formula from the cell above (without the value) |
| `Ctrl + Shift + "` | Copy the value from the cell above (without the formula) |
| `Ctrl + Enter` | Enter the formula into all selected cells simultaneously |

**Workbook management**:

| Shortcut | Action |
|---|---|
| `Ctrl + N` | New workbook |
| `Ctrl + O` | Open file |
| `Ctrl + S` | Save |
| `Ctrl + W` | Close current workbook |
| `Ctrl + Tab` | Switch between open workbooks |
| `Ctrl + Page Up/Down` | Switch between sheets within a workbook |

> **Build the habit now.** For the rest of this course, practice using keyboard shortcuts instead of the mouse for every operation. It will feel slow at first. Within a week, it will feel natural. Within a month, you will wonder how you ever worked without them.

---

## 2.2 Cell References - The Foundation of Everything

Cell references are how formulas talk to data. Every formula you will ever write uses cell references. Understanding them deeply - especially the difference between relative, absolute, and mixed - prevents the single most common class of Excel errors.

### 2.2.1 Relative References (The Default)

When you type `=A1` in a formula, it means "the cell that is in the same row, one column to the left" (relative to where the formula lives). When you copy the formula to another cell, the reference *adjusts*.

**Example**: You have sales data in column B and quantities in column C. You write a Unit Price formula in D2:

```
Cell D2: =B2/C2
```

When you copy this formula down to D3, D4, D5..., Excel automatically adjusts:

| Cell | Formula | What Excel "Thinks" |
|---|---|---|
| D2 | `=B2/C2` | "Divide the cell two columns left by the cell one column left" |
| D3 | `=B3/C3` | Same relative positions, different row |
| D4 | `=B4/C4` | Same pattern |

**This is almost always what you want.** Relative references make it possible to write one formula and copy it to 1,000 rows.

### 2.2.2 Absolute References (`$`)

Sometimes you need a formula to *always* refer to the same cell, regardless of where you copy it. The dollar sign `$` locks a reference.

**Example**: You want to calculate each sale as a percentage of total sales. Total sales is in cell B102.

```
Cell C2: =B2/B102
```

If you copy this to C3, it becomes `=B3/B103` - **wrong**. B103 is empty. The total is in B102, and you need it to stay there.

**Fix**:
```
Cell C2: =B2/$B$102
```

Now when you copy to C3, it becomes `=B3/$B$102` - correct. The `$B$102` never changes.

**The `$` locks what follows it**:
- `$B$102` - both column (B) and row (102) are locked
- `$B102` - column locked, row adjusts
- `B$102` - column adjusts, row locked

### 2.2.3 Mixed References - The Most Useful and Most Misunderstood

Mixed references lock one dimension (row or column) while letting the other adjust. They are essential for creating two-dimensional formulas like multiplication tables, cross-tabulations, and matrix calculations.

**Example - Multiplication Table**:

You want to build a multiplication table where row headers (in column A) multiply by column headers (in row 1):

|  | B | C | D | E |
|---|---|---|---|---|
| **1** | 1 | 2 | 3 | 4 |
| **2** | 1 | | | |
| **3** | 2 | | | |
| **4** | 3 | | | |
| **5** | 4 | | | |

In cell B2, you need: row header (A2) × column header (B1).

```
Cell B2: =$A2*B$1
```

- `$A2` - column A is locked (always look at column A for the row multiplier), but the row adjusts as you copy down
- `B$1` - row 1 is locked (always look at row 1 for the column multiplier), but the column adjusts as you copy right

Copy this single formula to the entire 4×4 grid, and every cell calculates correctly:

| Cell | Formula | Result |
|---|---|---|
| B2 | `=$A2*B$1` | 1×1 = 1 |
| C2 | `=$A2*C$1` | 1×2 = 2 |
| B3 | `=$A3*B$1` | 2×1 = 2 |
| D4 | `=$A4*D$1` | 3×3 = 9 |

### 2.2.4 The `F4` Shortcut

You do not need to manually type `$` signs. While editing a formula, click on a cell reference and press `F4` to cycle through reference types:

| Press | Reference | Meaning |
|---|---|---|
| 1st press | `$A$1` | Fully absolute |
| 2nd press | `A$1` | Mixed: row locked |
| 3rd press | `$A1` | Mixed: column locked |
| 4th press | `A1` | Fully relative (back to default) |

**Use F4 constantly.** It is faster than typing dollar signs and reduces typos.

---

## 2.3 Data Entry Best Practices

Before you analyse data, you need it structured correctly. These rules are not arbitrary - they exist because PivotTables, Power Query, Power BI, and every other analytical tool expect data in this format.

### 2.3.1 The Rules

| Rule | Why | Violation Example |
|---|---|---|
| **One fact per cell** | Formulas operate on individual cells. If "John Smith, New York" is in one cell, you cannot filter by city without text functions. | `John Smith, New York` → Should be two columns: `Name` and `City` |
| **Headers in row 1** | Every tool (PivotTables, Power Query, Power BI) expects column headers in the first row. | Data starting in row 3 with a title in row 1 |
| **No blank rows within data** | Blank rows break range detection. `Ctrl+Down` stops at the blank, missing data below. | An empty row separating "January data" from "February data" |
| **No blank columns within data** | Same issue. Breaks range detection and Table conversion. | An empty column used as a visual "spacer" |
| **No merged cells in data** | Merged cells break sorting, filtering, PivotTables, and Power Query. They exist for presentation, not data. | Merging cells to create a "section header" within a data range |
| **Consistent data types per column** | A column of numbers with one text value breaks SUM, AVERAGE, and sorting. | Column of sales figures with "TBD" in one row |
| **No trailing spaces** | Spaces are invisible but affect lookups, matches, and grouping. `"Germany"` ≠ `"Germany "` | VLOOKUP fails because the lookup value has a hidden trailing space |
| **Descriptive column headers** | `Sales` is better than `Col7`. One-word headers are ideal. No special characters. | `Q3 2024 Rev. ($) - FINAL v2` → Use `Sales_Q3_2024` |

### 2.3.2 What "Tidy Data" Looks Like

The concept of "tidy data" (formalised by statistician Hadley Wickham) has three rules:

1. Each **variable** is a column
2. Each **observation** is a row
3. Each **value** is a cell

**Tidy** (correct):

| Month | Region | Sales |
|---|---|---|
| January | North | 12,000 |
| January | South | 9,500 |
| February | North | 13,200 |
| February | South | 10,100 |

**Untidy** (common but problematic):

| Month | North | South |
|---|---|---|
| January | 12,000 | 9,500 |
| February | 13,200 | 10,100 |

The untidy version *looks* cleaner to human eyes, but it is harder for machines to work with. PivotTables, Power BI, and charts all prefer the tidy version because "Region" is a single column you can filter, group, and slice by. In the untidy version, each region is its own column - to add a new region, you must add a new column and modify every formula.

> **Practical rule**: If you have data with months, regions, or categories as *column headers* instead of *values in a column*, you probably have untidy data. Chapter 8 shows how to "unpivot" it using Power Query.

---

## 2.4 Formatting for Analysis vs Presentation

Formatting in Excel serves two purposes: making data *readable* (good) and making data *pretty* (secondary). Analysts prioritise readability.

### 2.4.1 Number Formats - The Most Important Formatting Skill

Number formatting changes how a value is *displayed* without changing the *underlying value*. The cell stores `1234.5678`; the format determines whether you see `1234.57`, `$1,234.57`, `1,235`, or `123457%`.

**Critical distinction**: Formatting ≠ rounding. `=ROUND(A1, 2)` changes the stored value. Applying a number format to show 2 decimal places changes only the display. This matters when you chain calculations - formatted values may *look* rounded but carry full precision internally.

**Essential formats**:

| Format | Display | When to Use | How to Apply |
|---|---|---|---|
| Number (2 decimals) | `1,234.57` | General numeric data | `Ctrl+1` → Number → 2 decimals |
| Currency | `$1,234.57` | Revenue, costs, prices | `Ctrl+1` → Currency |
| Accounting | `$ 1,234.57` (aligned) | Financial statements (aligns dollar signs) | `Ctrl+1` → Accounting |
| Percentage | `45.7%` | Rates, proportions (value must be 0.457, not 45.7) | `Ctrl+1` → Percentage |
| Date (Short) | `6/15/2023` | Date columns | `Ctrl+1` → Date |
| Date (ISO) | `2023-06-15` | International/sorting-friendly dates | Custom: `yyyy-mm-dd` |
| Text | `007` (preserves leading zeros) | IDs, zip codes, phone numbers | `Ctrl+1` → Text |

### 2.4.2 Custom Number Formats

Custom formats use a code system: `#,##0.00` where `#` is a digit (show if exists), `0` is a digit (always show, pad with zero).

| Custom Format | Input Value | Displays As | Notes |
|---|---|---|---|
| `#,##0` | `1234.5` | `1,235` | Thousands separator, no decimals |
| `#,##0.0` | `1234.56` | `1,234.6` | One decimal |
| `$#,##0.00` | `1234.5` | `$1,234.50` | Currency with 2 decimals |
| `0.0%` | `0.157` | `15.7%` | Percentage with 1 decimal |
| `#,##0;(#,##0)` | `-500` | `(500)` | Accounting negative format |
| `#,##0,,` | `1500000` | `2` | Divide by 1,000,000 (shows in millions) |
| `#,##0,"K"` | `1500` | `2K` | Divide by 1,000 (shows in thousands) |

**To apply**: `Ctrl+1` → Number tab → Custom → type your format code.

### 2.4.3 The "Date as Number" Revelation

Excel stores dates as **serial numbers** - integers counting days from a starting point (January 0, 1900 = 0 in Windows Excel).

| Date | Serial Number |
|---|---|
| January 1, 1900 | 1 |
| January 1, 2000 | 36,526 |
| June 15, 2023 | 45,092 |
| December 31, 2024 | 45,657 |

**Why this matters**:

1. **Date arithmetic works because of this**: `=B2-A2` gives you the number of days between two dates because it is just subtracting two integers.
2. **"Dates" that are actually text don't work**: If you import a CSV and the dates show as text (left-aligned, cannot be subtracted), they need to be converted to real dates. Chapter 4 covers this.
3. **Time is a decimal**: 12:00 PM = 0.5 (half a day). 6:00 AM = 0.25. A cell showing `45092.75` as a date-time displays as `6/15/2023 6:00 PM`.

### 2.4.4 Conditional Formatting

Conditional formatting applies visual rules based on cell values. It turns numbers into visual patterns.

**Most useful rules** (Home → Conditional Formatting):

| Rule Type | Use Case | Example |
|---|---|---|
| **Highlight Cells > Greater Than** | Flag values above a threshold | Highlight sales over $5,000 in green |
| **Highlight Cells > Less Than** | Flag underperformance | Highlight profit below $0 in red |
| **Data Bars** | Show relative magnitude within a column | Each cell gets a bar proportional to its value |
| **Color Scales** | Show distribution across a range | Red-yellow-green gradient from low to high |
| **Icon Sets** | Quick visual status indicators | Up/down/flat arrows for trend direction |
| **Use a Formula** | Complex custom rules | `=$E2<0` to highlight entire rows where Profit is negative |

> **Warning**: Conditional formatting is powerful for *exploration* but can slow down large workbooks. On datasets with 10,000+ rows, too many conditional formatting rules cause noticeable lag. Use it for analysis, but consider removing it for final data storage.

---

## 2.5 Tables (`Ctrl+T`) - The Most Underrated Feature in Excel

If you learn one thing from this chapter, let it be this: **convert your data ranges to Tables.** This single action improves almost every aspect of working with data in Excel.

### 2.5.1 Converting a Range to a Table

1. Click any cell within your data
2. Press `Ctrl+T`
3. Verify that "My table has headers" is checked
4. Click OK

Your data now has banded rows, filter dropdowns on every header, and a name in the Name Manager (defaulting to `Table1` - rename it immediately).

### 2.5.2 Why Tables Are Superior

| Feature | Plain Range | Table |
|---|---|---|
| **Auto-expansion** | New rows below the range are excluded from formulas and charts | New rows are automatically included |
| **Structured references** | `=SUM(B2:B1001)` - breaks if you add rows | `=SUM(Sales[Revenue])` - always includes all rows |
| **Automatic formatting** | Manual | Banded rows, header styling applied automatically |
| **Filter dropdowns** | Must manually add (Data → Filter) | Always present |
| **Column formulas** | Must copy formula to every row | Enter formula once, it fills the entire column automatically |
| **Duplicate removal** | Must manually select the range | Table Design → Remove Duplicates knows the exact boundaries |
| **PivotTable source** | Must manually update the range when data grows | PivotTable automatically includes new rows on refresh |

### 2.5.3 Structured References

When data is in a Table, you can reference columns by name instead of cell addresses:

| Traditional Formula | Structured Reference | Meaning |
|---|---|---|
| `=SUM(D2:D1001)` | `=SUM(Sales[Profit])` | Sum the entire Profit column in the Sales table |
| `=D2*E2` | `=[@Profit]*[@Discount]` | Multiply Profit by Discount in the current row |
| `=AVERAGE(D2:D1001)` | `=AVERAGE(Sales[Profit])` | Average of the Profit column |

The `@` symbol means "this row." `[@Sales]` means "the Sales column value in the same row as this formula."

**Advantages of structured references**:
- **Self-documenting**: `=SUM(Sales[Profit])` is immediately readable. `=SUM(D2:D1001)` requires you to check what column D contains.
- **Auto-adjusting**: Insert or delete rows, and the reference still works.
- **Error-resistant**: You cannot accidentally reference the wrong column by miscounting.

### 2.5.4 Renaming Tables

Default names (`Table1`, `Table2`) are useless. Rename immediately:

1. Click any cell in the Table
2. Go to Table Design tab (appears when a Table cell is selected)
3. On the far left, change the name in the "Table Name" box
4. Use descriptive names: `SalesData`, `ProductCatalog`, `EmployeeData`

> **Naming rules**: No spaces (use underscores or CamelCase), must start with a letter or underscore, maximum 255 characters.

---

## 2.6 Sorting & Filtering

Sorting and filtering are your first analytical tools - they let you reorder and focus your view of the data without changing the data itself.

### 2.6.1 Sorting

**Single column sort**: Click any cell in the column you want to sort → Data → Sort A to Z (ascending) or Sort Z to A (descending). Or right-click → Sort.

**Multi-level sort**: Data → Sort → Add Level. This sorts by the first criterion, then breaks ties with the second.

**Example** - Sort the sales data by Region (alphabetical), then within each region by Sales (largest first):

| Level | Column | Order |
|---|---|---|
| 1 | Region | A to Z |
| 2 | Sales | Largest to Smallest |

Result: All "Asia Pacific" rows grouped together with the highest sale first, followed by "Europe" with the highest sale first, and so on.

**Custom sort orders**: You can define custom lists for sorting. For example, months: January, February, March... (instead of alphabetical, which would put April first). File → Options → Advanced → Edit Custom Lists.

### 2.6.2 Filtering with AutoFilter

When your data is in a Table, filter dropdowns are already present. For plain ranges: Data → Filter (or `Ctrl+Shift+L`).

**Basic filter**: Click the dropdown on a column header → uncheck "Select All" → check only the values you want to see.

**Text filters**: Click dropdown → Text Filters → options include:
- Equals
- Does Not Equal
- Begins With
- Ends With
- Contains
- Does Not Contain

**Number filters**: Click dropdown → Number Filters → options include:
- Greater Than
- Less Than
- Between
- Top 10 (configurable - top/bottom N items or N percent)
- Above Average / Below Average

**Date filters**: Click dropdown → Date Filters → options include:
- Before / After
- Between
- This Week / This Month / This Quarter / This Year
- Year to Date

### 2.6.3 Filter vs Hide - A Critical Distinction

**Filtering** temporarily hides rows that do not match your criteria. The data still exists - `SUM()` and other functions operate only on visible (filtered) rows when using `SUBTOTAL` or `AGGREGATE`, but regular `SUM` includes hidden rows.

**Hiding rows** (`Right-click → Hide`) physically hides rows, but `SUM` still includes them.

**To create formulas that respect filters**, use `SUBTOTAL` instead of `SUM`:

```
=SUBTOTAL(109, Sales[Revenue])
```

- Function number `109` = `SUM`, ignoring hidden (filtered) rows
- Function number `101` = `AVERAGE`, ignoring hidden rows
- Function number `102` = `COUNT`, ignoring hidden rows

This becomes important in Chapter 6 (PivotTables handle this automatically) and Chapter 3 (where we discuss `AGGREGATE` as a more powerful alternative to `SUBTOTAL`).

### 2.6.4 Clearing Filters

- **Clear filter on one column**: Click the dropdown → Clear Filter From "Column Name"
- **Clear all filters**: Data → Clear (or `Alt+D+F+S`)
- **Check if filters are active**: Look for the funnel icon in column headers - a funnel with a small arrow means a filter is applied

---

## 2.7 Named Ranges & the Name Manager

Named Ranges let you assign a human-readable name to a cell, range, or formula. Instead of typing `=B2:B1001`, you type `=SalesRevenue`.

### 2.7.1 Creating a Named Range

**Method 1 - Name Box**: Select the range → click in the Name Box (top-left, where it shows the cell address) → type the name → press Enter.

**Method 2 - Define Name dialog**: Formulas → Define Name → enter name, scope, and reference.

**Method 3 - Create from Selection**: Select a range that includes headers → Formulas → Create from Selection → check "Top row." Excel automatically names each column using the header text.

### 2.7.2 Using Named Ranges in Formulas

```
=SUM(Revenue)
=AVERAGE(EmployeeSalary)
=VLOOKUP(A2, ProductCatalog, 3, FALSE)
```

Named Ranges make formulas dramatically more readable, especially for complex models with many interconnected formulas.

### 2.7.3 Managing Names

Formulas → Name Manager (`Ctrl+F3`) shows all defined names, their references, and their scope. From here you can edit, delete, or check for errors.

> **Practical tip**: When you delete a sheet or move data, Named Ranges can become orphaned (pointing to `#REF!`). Use the Name Manager periodically to clean these up.

### 2.7.4 Dynamic Named Ranges

A static Named Range like `=Sheet1!$B$2:$B$100` breaks when your data grows to row 150. A dynamic range adjusts automatically.

**Using OFFSET** (works in all Excel versions):
```
=OFFSET(Sheet1!$B$1, 1, 0, COUNTA(Sheet1!$B:$B)-1, 1)
```
This starts at B1, offsets down 1 row, counts the non-blank cells in column B, and creates a range of that size.

**Using Tables** (recommended): If your data is in a Table, just use the structured reference `SalesData[Revenue]` - it is inherently dynamic.

---

## 2.8 Hands-On: Setting Up the Sales Dataset

Let us put everything into practice. Open `datasets/01_global_superstore_sales.csv` in Excel.

### 2.8.1 Opening a CSV File in Excel

1. Open Excel
2. File → Open → navigate to `datasets/01_global_superstore_sales.csv`
3. The file should open directly as a spreadsheet. If Excel's Text Import Wizard appears, choose: Delimited → Comma → Finish.

### 2.8.2 Initial Inspection

Before doing anything else, look at your data:

- **Row count**: Press `Ctrl+End` to jump to the last cell. You should be around row 1001 (1 header row + 1000 data rows).
- **Column count**: The last column should be column R (18 columns).
- **Headers**: Row 1 should contain: `Order_ID`, `Order_Date`, `Ship_Date`, `Ship_Mode`, `Customer_ID`, `Customer_Name`, `Segment`, `Region`, `Country`, `City`, `Category`, `Sub_Category`, `Product_Name`, `Sales`, `Quantity`, `Discount`, `Profit`, `Cost`.

### 2.8.3 Convert to Table

1. Click any cell within the data (e.g., A1)
2. Press `Ctrl+T`
3. Verify the range covers `$A$1:$R$1001` and "My table has headers" is checked
4. Click OK
5. **Rename the table**: Click Table Design → change `Table1` to `SalesData`

### 2.8.4 Format the Columns

Apply appropriate number formats to make the data readable:

| Column | Format | How |
|---|---|---|
| `Order_Date`, `Ship_Date` | Date (ISO: yyyy-mm-dd) | Select columns → `Ctrl+1` → Custom → `yyyy-mm-dd` |
| `Sales`, `Profit`, `Cost` | Currency ($) with 2 decimals | Select columns → `Ctrl+1` → Currency → $ → 2 decimals |
| `Quantity` | Number with 0 decimals | Select column → `Ctrl+1` → Number → 0 decimals |
| `Discount` | Percentage with 0 decimals | Select column → `Ctrl+1` → Percentage → 0 decimals |

### 2.8.5 Quick Analysis Using the Status Bar

Select the `Sales` column (click the header, then `Ctrl+Shift+Down` from B2):

Look at the Status Bar at the bottom. You should see:
- **Sum**: The total of all sales
- **Average**: The average sale amount
- **Count**: 1000 (confirming row count)

Now select the `Profit` column and check the Status Bar. Notice that the sum might be lower than you expected - some orders have negative profit.

### 2.8.6 Apply Conditional Formatting

Let us highlight unprofitable orders:

1. Select the `Profit` column (all 1000 data cells)
2. Home → Conditional Formatting → Highlight Cells Rules → Less Than
3. Enter `0` → select "Light Red Fill with Dark Red Text"
4. Click OK

Every order with negative profit is now visually flagged. Scroll through the data - you can immediately see which orders lost money.

### 2.8.7 Sort and Filter

**Sort by Profit** (worst first):
1. Click any cell in the Profit column
2. Data → Sort Smallest to Largest

The most unprofitable orders are now at the top. Notice any patterns? Are they concentrated in a particular category or at high discount levels?

**Filter to Technology only**:
1. Click the dropdown on the `Category` column header
2. Uncheck "Select All"
3. Check only "Technology"
4. Click OK

The display now shows only Technology orders. Check the Status Bar for the sum and average of visible Profit values (remember: use `SUBTOTAL` if you write a formula).

**Clear the filter**: Click the Category dropdown → Clear Filter From "Category".

### 2.8.8 Save Your Work

Save the file as an Excel workbook (`.xlsx`), not CSV, to preserve your Table formatting:

1. File → Save As
2. Navigate to your course working folder
3. Change "Save as type" to "Excel Workbook (*.xlsx)"
4. Name it `sales_analysis_workbook.xlsx`
5. Click Save

---

## Common Mistakes & Misconceptions

### Mistake 1: Merging Cells in Data

```
Merged cells look nice in a report but destroy data functionality.
They break: sorting, filtering, PivotTables, Power Query, VLOOKUP, INDEX/MATCH.
```

**Rule**: Never merge cells in a data range. Use merged cells only in presentation areas (titles, headers above a dashboard) that are physically separated from your data.

### Mistake 2: Using the Mouse for Everything

Every click-and-drag operation in Excel has a faster keyboard equivalent. The investment in learning shortcuts pays dividends over the entire career of an analyst.

### Mistake 3: Not Using Tables

Working with plain ranges instead of Tables is the #1 source of "my formula broke when I added new data" errors. Tables auto-expand, auto-fill formulas, and provide structured references. There is no reason to use a plain range for analytical data.

### Mistake 4: Confusing Formatting with Data

Changing a number format from Number to Percentage does not multiply by 100. If the cell contains `45.7` and you apply Percentage format, it displays `4570%`. The correct value should be `0.457`, which displays as `45.7%`. Always check the Formula Bar to see the actual stored value.

### Mistake 5: Ignoring the Formula Bar

The cell displays `$1,234.57`. The Formula Bar might show:
- `1234.5678` - a raw number with formatting applied
- `=B2*C2*1.15` - a formula
- `1234.57` - text that looks like a number but is not (left-aligned as a clue)

Always check the Formula Bar when something behaves unexpectedly.

---



## In Simple Terms (TL;DR)

> **ELI5 (Explain Like I'm 5):**
> Excel is a giant grid where you can do math. The most important rules: keep your data neat (one thing per column), use "Tables" to make things easier, and lock cells with a dollar sign ($) so formulas don't break when you copy them.

## Practice Exercises

### Beginner

**Exercise 2.1**: Open `datasets/01_global_superstore_sales.csv`. Without using the mouse, navigate to the last row of data using only keyboard shortcuts. How many rows of data are there?

**Exercise 2.2**: Convert the data range to a Table named `SalesData`. Apply currency formatting to the Sales, Profit, and Cost columns. Apply percentage formatting to the Discount column.

**Exercise 2.3**: Sort the data by Region (A-Z), then by Sales (largest to smallest). What is the highest sale in Asia Pacific?

**Exercise 2.4**: Filter the data to show only orders where the Discount is greater than 30%. How many orders match? Are any of these profitable?

**Exercise 2.5**: Use the Status Bar to find the sum and average of the Quantity column (select the entire column). Write down both values.

### Intermediate

**Exercise 2.6**: Create a multiplication table in a new sheet. Put numbers 1-10 in column A (rows 2-11) and numbers 1-10 in row 1 (columns B-K). Write a single formula in B2 using mixed references that you can copy to fill the entire 10×10 grid.

**Exercise 2.7**: Apply conditional formatting to the `Sales` column: data bars (blue gradient). Then apply a second rule to the `Profit` column: green fill for values ≥ 0, red fill for values < 0. Observe: do high-sales orders always have positive profit?

**Exercise 2.8**: Create Named Ranges for the following:
- `TotalSales` = the sum of the Sales column
- `TotalProfit` = the sum of the Profit column
- `ProfitMargin` = a formula that calculates TotalProfit / TotalSales

What is the overall profit margin?

### Challenge

**Exercise 2.9**: Open `datasets/08_product_catalog.csv` in a second sheet of your workbook. Convert it to a Table named `ProductCatalog`. Now, back in the SalesData sheet, create a formula in column S that calculates the "Markup" for each order: `(Sales / Quantity) / Unit_Cost from the catalog`. You will need to look up the `Unit_Cost` from the `ProductCatalog` table by matching on `Product_Name`. (Hint: you'll learn the proper function in Chapter 3 - for now, try `VLOOKUP` if you've seen it before, or just write a note describing the logic you'd need.)

**Exercise 2.10**: Investigate the data quality: select the `Order_Date` column and check if all values are real dates (try sorting chronologically). Select the `Sales` column and check if all values are numbers (try AutoSum). Report any issues you find. This exercise previews Chapter 4's data cleaning work.
