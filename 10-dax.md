# Chapter 10 - DAX: The Language of Power BI

---

## Chapter Overview

If the Star Schema is the skeleton of Power BI, **DAX** (Data Analysis Expressions) is the brain.

DAX looks confusingly similar to Excel formulas. You use `=SUM()`, `=IF()`, and `=ROUND()`. But beneath the surface, DAX behaves completely differently. Excel thinks in cells (`A1+B1`); DAX thinks in tables and columns (`Sales[Revenue]`). If you try to write DAX as if it were Excel, you will fail in frustrating ways.

In this chapter, we break down the two fundamental concepts of DAX: **Calculated Columns** vs **Measures**, and **Row Context** vs **Filter Context**. Once you understand Filter Context, DAX changes from a confusing syntax into a logical, incredibly powerful analytical engine. We will cover the most important function in the language (`CALCULATE`) and introduce Time Intelligence (e.g., Year-to-Date, Year-over-Year calculations).

### Prerequisites

- Chapter 9 (Power BI Interface and Star Schema) completed.
- Power BI Desktop open with the `Sales` and `Products` model built in Chapter 9.

---

## Learning Objectives

By the end of this chapter, you will be able to:

1. Distinguish between Calculated Columns and Measures, and know when to use each
2. Write basic DAX Measures (`SUM`, `AVERAGE`, `DIVIDE`)
3. Explain the difference between Row Context and Filter Context
4. Master the `CALCULATE` function to override default filter context
5. Write iterator functions (`SUMX`) to perform row-by-row calculations inside a Measure
6. Use Time Intelligence functions for dynamic period comparisons

---

## 10.1 Calculated Columns vs. Measures

This is the first hurdle every new Power BI user must clear. There are two ways to write a calculation in DAX. They are fundamentally different.

### 10.1.1 Calculated Columns

A calculated column adds a physical new column to a table in your data model. It computes a value *for every single row*, one row at a time.

**How to create one**:
1. Go to the Data view. Select the `Sales` table.
2. Table Tools ribbon → **New Column**.
3. The formula bar appears. Type:
   ```dax
   Unit_Price = Sales[Sales] / Sales[Quantity]
   ```
4. Press Enter. The column appears, filled with numbers.

**When to use Calculated Columns**:
- When you need to slice, filter, or group by the result (e.g., categorising sales into "High Value" vs "Low Value" buckets so you can put that bucket on the axis of a chart).
- Very rarely for numeric aggregation.

**The downside**: Calculated columns consume RAM and increase your file size. If you have 10 million rows, you just added 10 million new data points to memory.

### 10.1.2 Measures

A measure is a formula that calculates an aggregate result *on the fly*, based on whatever filters the user has clicked on the report. It does not add data to your tables; it lives in memory as a rule.

**How to create one**:
1. Right-click the `Sales` table in the Data pane → **New Measure**.
2. Type:
   ```dax
   Total Revenue = SUM(Sales[Sales])
   ```
3. Press Enter. Nothing seems to happen. A calculator icon appears next to `Total Revenue` in the field list, but no data is visible.

**How to use it**:
1. Go to the Report view.
2. Drag `Region` to a table visual.
3. Drag your new `Total Revenue` measure into the visual.
4. The measure calculates the sum for Europe, then calculates it for Asia, then calculates the Grand Total.

**When to use Measures**:
- **Almost always.** If the result is a number you want to plot on a chart (revenue, profit margin, average wait time), it should be a Measure.
- Measures do not increase file size. They are calculated instantly at CPU speed when requested.

### 10.1.3 The Golden Rule of DAX

> **If you want to filter or group by it, use a Calculated Column. If you want to calculate a result, use a Measure.**

---

## 10.2 Filter Context - The Secret to Understanding DAX

Why did the `Total Revenue = SUM(Sales[Sales])` measure return $500,000 for Europe but $1,200,000 for Asia Pacific? The formula is exactly the same for both rows.

The answer is **Filter Context**.

### 10.2.1 How Filter Context Works

Before a Measure calculates its result, Power BI looks at the visual and applies filters.

Imagine a Matrix visual:
- Rows: `Region`
- Columns: `Year`
- Values: `Total Revenue` measure

When Power BI calculates the cell intersecting "Europe" and "2023", the following happens internally:
1. **Apply Filters**: Filter the entire data model so that `Region = "Europe"` AND `Year = 2023`.
2. **Evaluate Formula**: Take the surviving rows and run `=SUM(Sales[Sales])`.
3. **Return Result**: Display the number in that specific cell.

This process repeats for every single cell in every visual on the page. If the user clicks a Slicer for "Technology", that filter is added to the Filter Context for every calculation.

### 10.2.2 The Magic of the Star Schema

Remember the relationship arrow from Chapter 9?

If you build a matrix with `Category` from the `Products` table on the rows, and `Total Revenue` from the `Sales` table in the values:
1. Filter Context says: "Filter the `Products` table to `Category = Furniture`."
2. The relationship arrow points from `Products` to `Sales`.
3. The filter flows down the line. The `Sales` table is now filtered to only show sales of Furniture.
4. The Measure `SUM(Sales[Sales])` calculates the total of those surviving rows.

This is why your model structure matters more than your DAX skills. A good model makes DAX simple. A bad model requires impossibly complex DAX to force filters to work.

---

## 10.3 Basic DAX Syntax and Best Practices

### 10.3.1 Fully Qualified vs. Unqualified References

**Best Practice**: Always include the Table Name when referencing a Column. Never include the Table Name when referencing a Measure.

- Column: `Sales[Quantity]` (Correct)
- Column: `[Quantity]` (Technically works, but bad practice)
- Measure: `[Total Revenue]` (Correct)
- Measure: `Sales[Total Revenue]` (Bad practice)

Why? Because columns physically live in a specific table. Measures belong to the whole model (you can move a measure to a different table without breaking the formula). Adhering to this convention means anyone reading your DAX instantly knows whether `[Profit]` is a column or a measure.

### 10.3.2 Basic Mathematical Measures

**Sum, Average, Min, Max**:
```dax
Total Quantity = SUM(Sales[Quantity])
Average Order Value = AVERAGE(Sales[Sales])
```

**Counting**:
```dax
Order Count = COUNTROWS(Sales)
Unique Customers = DISTINCTCOUNT(Sales[Customer_Name])
```

**DIVIDE (The Safe Division Function)**:
In Excel, `A/B` throws a `#DIV/0!` error if B is blank or zero. You have to wrap it in `IFERROR`. DAX has a built-in safe division function.

```dax
Profit Margin = DIVIDE([Total Profit], [Total Revenue], 0)
```
If `Total Revenue` is zero, this gracefully returns 0 (the third parameter) instead of crashing the visual.

---

## 10.4 Iterator Functions (The "X" Functions)

### 10.4.1 The Row Context Problem in Measures

Suppose you want to calculate Total Cost. You do not have a Cost column, but you have `Sales` and `Profit`.

You try to write a Measure:
```dax
Total Cost = SUM(Sales[Sales] - Sales[Profit])  // THIS WILL ERROR
```

Why does it error? `SUM` only accepts a single column reference. It cannot do row-by-row math. Measures operate in Filter Context, not Row Context. A standard measure cannot look at row 1, do the math, look at row 2, do the math, and then sum the results.

### 10.4.2 The Solution: SUMX

To force a measure to iterate row-by-row before summing, use an "X" function (an iterator).

```dax
Total Cost = SUMX(
    Sales,                        // 1. The table to iterate over
    Sales[Sales] - Sales[Profit]  // 2. The row-by-row expression to evaluate
)
```

**How it works**:
1. `SUMX` creates a temporary Row Context.
2. It goes to row 1 of the filtered `Sales` table, calculates `Sales - Profit`, and stores the result in memory.
3. It repeats for row 2, row 3, up to row N.
4. Finally, it sums all the stored results.

Iterators exist for most aggregations: `AVERAGEX`, `MINX`, `MAXX`, `COUNTX`.

---

## 10.5 CALCULATE: The Master Function

If you only learn one DAX function, make it `CALCULATE`. It is the most powerful and unique function in the language.

### 10.5.1 What CALCULATE Does

`CALCULATE` evaluates an expression in a modified Filter Context. It is the *only* function in DAX that can alter the filters coming from the visual or slicers.

**Syntax**:
```dax
CALCULATE( <Expression>, <Filter1>, <Filter2>, ... )
```

### 10.5.2 Overriding Filters

Imagine a bar chart showing Sales by Region.
You want to add a line to that chart showing the Global Total (so you can compare each region to the global number).

If you just use `[Total Revenue]`, the bar for Europe is filtered to Europe. You need a measure that *ignores* the Region filter.

```dax
Global Revenue = CALCULATE(
    [Total Revenue],
    REMOVEFILTERS(Sales[Region])
)
```

**What happens for the "Europe" bar**:
1. Default Filter Context: `Region = Europe`.
2. `CALCULATE` intervenes. `REMOVEFILTERS` strips away the Region filter.
3. Modified Filter Context: (No Region filter).
4. Evaluates `[Total Revenue]` on the whole dataset.
5. Returns $5,000,000 (the global total) for the Europe bar.

### 10.5.3 Applying Specific Filters

You want a measure that only ever calculates Technology sales, regardless of what the user clicks.

```dax
Tech Revenue = CALCULATE(
    [Total Revenue],
    Products[Category] = "Technology"
)
```

This overwrites any Category filter coming from the visual with "Technology".

### 10.5.4 Creating Ratios

Because `CALCULATE` can alter context, it is how we build complex ratios, like "% of Grand Total" (doing what PivotTables do automatically, but flexibly).

```dax
% of Global Revenue = DIVIDE(
    [Total Revenue],
    CALCULATE([Total Revenue], REMOVEFILTERS(Sales))
)
```
Numerator: Context-aware revenue (e.g., Europe).
Denominator: Global revenue (filters removed).

---

## 10.6 Time Intelligence

Analyzing data over time (Year-to-Date, Month-over-Month variance) is so common that DAX includes built-in functions for it.

### 10.6.1 The Prerequisite: A Dedicated Date Table

Time Intelligence functions **will not work reliably** using the date column in your Fact table. You must have a separate Dimension table dedicated to dates.

*(In practice, you create a Date table in Power Query or using the DAX `CALENDARAUTO()` function, mark it as a Date Table, and link it to `Sales[Order_Date]`. For these examples, assume a table named `Dates` exists and is linked).*

### 10.6.2 Year-to-Date (YTD)

Calculate cumulative sales from Jan 1 to the current filter date:

```dax
Revenue YTD = CALCULATE(
    [Total Revenue],
    DATESYTD(Dates[Date])
)
```
There are also `DATESMTD` (Month-to-Date) and `DATESQTD` (Quarter-to-Date).

### 10.6.3 Previous Year (Year-over-Year Comparison)

To calculate YoY growth, you first need a measure that retrieves exactly the same period from the prior year.

```dax
Revenue Last Year = CALCULATE(
    [Total Revenue],
    SAMEPERIODLASTYEAR(Dates[Date])
)
```

If the user filters the dashboard to "March 2024", `SAMEPERIODLASTYEAR` intercepts the filter, shifts it back one year, and passes "March 2023" to the `[Total Revenue]` calculation.

### 10.6.4 YoY Growth Percentage

Once you have both measures, calculating the variance is simple division:

```dax
YoY Growth % = DIVIDE(
    [Total Revenue] - [Revenue Last Year],
    [Revenue Last Year]
)
```

---

## Common Mistakes & Misconceptions

### Mistake 1: Using Calculated Columns for Everything

New users write `Sales - Cost` as a calculated column, then write `Sales / Quantity` as a calculated column, then write a giant nested `IF` calculated column. The file size balloons, performance crashes, and metrics aggregate incorrectly (summing ratios instead of recalculating them). **Use Measures for math.**

### Mistake 2: Missing the Table Name in CALCULATE Filters

```dax
❌ CALCULATE([Sales], Region = "Europe")
✅ CALCULATE([Sales], Sales[Region] = "Europe")
```
DAX requires the table name for column references in filter expressions.

### Mistake 3: Blank vs Zero

In DAX, `BLANK()` is distinct from `0`. If a customer bought nothing, their sales are blank, not zero. If you force blanks to zero (e.g., by adding `+ 0` to a measure), Power BI will render a row for *every possible customer* in your database in a table visual, because they now have a value (0) instead of blank. This causes visual bloat and performance crashes. Let blanks be blanks.

### Mistake 4: Not Formatting Measures

When you create a measure, the format defaults to General. If you use it in 5 different charts, it will look ugly in all 5. Format the measure *immediately* after creating it (Measure Tools ribbon → Currency/Percentage/Comma) so it looks correct everywhere it is used.

---



## In Simple Terms (TL;DR)

> **ELI5 (Explain Like I'm 5):**
> DAX is the formula language for Power BI. The most important formula is CALCULATE, which is like saying "Do this math, but only for these specific rules (like only for the year 2023)."

## Practice Exercises

### Beginner

**Exercise 10.1**: In your Power BI model, create three base Measures:
1. `Total Sales = SUM(Sales[Sales])`
2. `Total Quantity = SUM(Sales[Quantity])`
3. `Total Profit = SUM(Sales[Profit])`
Format the first and third as Currency, the second as a Whole Number with a comma separator.

**Exercise 10.2**: Create a Measure for `Profit Margin` using the `DIVIDE` function. Format it as a Percentage with 1 decimal place. Add it to a Matrix visual with `Category` on the rows.

### Intermediate

**Exercise 10.3**: Use `SUMX` to create a Measure named `Total Discount Amount`. The logic per row is `Sales * Discount`. Since you cannot use `SUM` across two columns, use `SUMX` to iterate the `Sales` table.

**Exercise 10.4**: Using `CALCULATE`, create a Measure named `Technology Sales` that returns the Total Sales only for the "Technology" category. Place this in a card visual next to a card showing `Total Sales`. If you click a slicer for "Furniture", what happens to the Technology card?

### Challenge

**Exercise 10.5**: Build a dynamic "% of Category Sales" measure.
You have a Matrix with `Category` (e.g., Furniture) on the rows, and `Sub_Category` (e.g., Chairs, Tables) underneath it.
1. Create a measure that uses `CALCULATE` and `REMOVEFILTERS(Products[Sub_Category])` to find the total for the parent Category.
2. Create a second measure that divides `[Total Sales]` by the measure you created in step 1.
3. This should result in Chairs showing its % contribution to Furniture, not its % contribution to the Grand Total.
