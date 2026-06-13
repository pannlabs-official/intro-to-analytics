# Chapter 3 - Formulas and Functions: The Logic Layer

![Excel Logic Layer](assets/images/excel.png)

---

## Chapter Overview

This chapter is the engine room of Excel. Formulas and functions are what transform a spreadsheet from a static table into a dynamic analytical tool. We will cover over 40 functions - not as a reference list, but as tools that solve specific problems you will encounter repeatedly as an analyst.

Every function is taught with three things: **what** it does, **why** you would use it (the real-world scenario), and **how** it works internally (so you can debug it when it breaks). Functions are grouped by category: logical, lookup, text, date, math, and information. By the end, you will be able to chain multiple functions together to solve complex, multi-step problems.

### Prerequisites

- Chapter 2 completed (you should be comfortable with cell references, Tables, and basic navigation)
- `datasets/01_global_superstore_sales.csv` open in Excel as a Table named `SalesData`
- `datasets/08_product_catalog.csv` open in a second sheet as a Table named `ProductCatalog`

---

## Learning Objectives

By the end of this chapter, you will be able to:

1. Write formulas using Excel's order of operations and debug evaluation errors
2. Use logical functions (`IF`, `IFS`, `AND`, `OR`, `NOT`, `SWITCH`) for conditional calculations
3. Perform lookups using `VLOOKUP`, `INDEX/MATCH`, and `XLOOKUP`
4. Clean and parse text using string functions (`LEFT`, `RIGHT`, `MID`, `FIND`, `TRIM`, `SUBSTITUTE`, `TEXTJOIN`)
5. Work with dates using date functions (`DATEDIF`, `EOMONTH`, `NETWORKDAYS`, `WEEKDAY`)
6. Apply math and rounding functions (`SUMPRODUCT`, `ROUND`, `MOD`, `CEILING`)
7. Build defensive formulas using error-handling functions (`IFERROR`, `IFNA`, `ISBLANK`)

---

## 3.1 How Formulas Work

### 3.1.1 Anatomy of a Formula

Every formula in Excel starts with `=`. After that, it can contain:

- **Cell references**: `A1`, `$B$2`, `SalesData[Profit]`
- **Operators**: `+`, `-`, `*`, `/`, `^` (exponent), `&` (concatenation), `=`, `<>`, `>`, `<`, `>=`, `<=`
- **Functions**: `SUM()`, `IF()`, `VLOOKUP()`
- **Constants**: `100`, `"text"`, `TRUE`

### 3.1.2 Order of Operations

Excel follows the standard mathematical precedence (PEMDAS/BODMAS), extended with Excel-specific operators:

| Priority | Operator | Example |
|---|---|---|
| 1 (highest) | `:` (range), ` ` (intersection), `,` (union) | `SUM(A1:A10)` |
| 2 | `-` (negation) | `-A1` |
| 3 | `%` (percentage) | `50%` → 0.5 |
| 4 | `^` (exponentiation) | `2^3` → 8 |
| 5 | `*` and `/` | `A1*B1/C1` |
| 6 | `+` and `-` | `A1+B1-C1` |
| 7 | `&` (text concatenation) | `A1&" "&B1` |
| 8 (lowest) | `=`, `<>`, `>`, `<`, `>=`, `<=` | `A1>100` |

**Use parentheses to control order**:

```
=A1+B1*C1        → Multiplies B1*C1 first, then adds A1
=(A1+B1)*C1      → Adds A1+B1 first, then multiplies by C1
```

### 3.1.3 How Nested Functions Evaluate

When functions are nested, Excel evaluates from the **innermost** function outward:

```
=IF(AVERAGE(B2:B10) > 100, "High", "Low")
```

Evaluation order:
1. `B2:B10` - resolve the range
2. `AVERAGE(B2:B10)` - calculate the average (say it returns 145.6)
3. `145.6 > 100` - evaluate the comparison (returns TRUE)
4. `IF(TRUE, "High", "Low")` - return "High"

**Debugging tip**: To see the value of an intermediate step, select just that portion of the formula in the Formula Bar and press `F9`. Excel replaces it with the calculated value. Press `Escape` to undo (do NOT press Enter, or the formula is permanently replaced with the value).

### 3.1.4 Error Types

When a formula fails, Excel displays a specific error code. Each error has a distinct cause:

| Error | Meaning | Common Cause | Fix |
|---|---|---|---|
| `#DIV/0!` | Division by zero | Denominator is 0 or blank | Wrap in `IF(C2=0, 0, B2/C2)` or `IFERROR` |
| `#VALUE!` | Wrong data type | Trying to do math on text, e.g., `="hello"+1` | Check that inputs are numbers, not text |
| `#REF!` | Invalid reference | Deleted a row or column that a formula referenced | Undo the deletion, or fix the reference |
| `#NAME?` | Unrecognised name | Misspelled function name or undefined Named Range | Check spelling: `=SUMM(A1:A10)` → `=SUM(A1:A10)` |
| `#N/A` | Value not found | VLOOKUP/XLOOKUP cannot find the lookup value | Check for spaces, typos, data type mismatches |
| `#NUM!` | Invalid number | Impossible math, e.g., `=SQRT(-1)` or overflow | Check input values |
| `#NULL!` | Null intersection | Space between references instead of operator | `=SUM(A1 B1)` → `=SUM(A1,B1)` or `=SUM(A1:B1)` |
| `#SPILL!` | Spill range blocked | Dynamic array formula cannot output because cells below are not empty | Clear the cells where the formula needs to spill |

---

## 3.2 Logical Functions

Logical functions make decisions. They evaluate conditions and return different results based on whether those conditions are true or false.

### 3.2.1 IF - The Fundamental Decision

**Syntax**: `=IF(condition, value_if_true, value_if_false)`

**Example** - Classify orders as profitable or unprofitable:
```
=IF([@Profit] > 0, "Profitable", "Unprofitable")
```

| Profit | Result |
|---|---|
| 312.45 | Profitable |
| -45.20 | Unprofitable |
| 0 | Unprofitable |

> **Note**: `0` evaluates as "not greater than 0", so it returns "Unprofitable". If zero profit should be a separate category, use nested IFs or IFS.

### 3.2.2 Nested IF - Multiple Conditions

**Example** - Tier customers by order size:
```
=IF([@Sales] >= 5000, "Platinum",
   IF([@Sales] >= 1000, "Gold",
      IF([@Sales] >= 500, "Silver", "Bronze")))
```

| Sales | Result |
|---|---|
| 7,250 | Platinum |
| 1,450 | Gold |
| 680 | Silver |
| 125 | Bronze |

**The problem with nested IFs**: They are hard to read and error-prone beyond 3-4 levels. Each nested IF adds complexity and potential for mismatched parentheses.

### 3.2.3 IFS - Clean Multi-Condition Logic (Excel 2019+)

`IFS` evaluates multiple conditions in order and returns the value for the first TRUE condition. No nesting required.

**Syntax**: `=IFS(condition1, value1, condition2, value2, ..., TRUE, default_value)`

**Example** - Same tier classification, much cleaner:
```
=IFS(
    [@Sales] >= 5000, "Platinum",
    [@Sales] >= 1000, "Gold",
    [@Sales] >= 500, "Silver",
    TRUE, "Bronze"
)
```

The `TRUE` at the end acts as the "else" clause - it always evaluates to TRUE, so it catches everything not caught above.

### 3.2.4 AND, OR, NOT

These combine or negate conditions:

| Function | Returns TRUE when... | Example |
|---|---|---|
| `AND(cond1, cond2, ...)` | ALL conditions are TRUE | `=AND([@Sales]>1000, [@Profit]>0)` - high-value AND profitable |
| `OR(cond1, cond2, ...)` | ANY condition is TRUE | `=OR([@Region]="Europe", [@Region]="Asia Pacific")` - either region |
| `NOT(condition)` | The condition is FALSE | `=NOT([@Discount]=0)` - order has a discount |

**Combined with IF**:
```
=IF(AND([@Sales] > 1000, [@Profit] > 0), "Priority Order", "Standard")
```

### 3.2.5 SWITCH - Clean Exact-Match Mapping

When you need to map exact values to results (not ranges), `SWITCH` is cleaner than nested IFs:

**Syntax**: `=SWITCH(expression, value1, result1, value2, result2, ..., default)`

**Example** - Map ship modes to estimated days:
```
=SWITCH([@Ship_Mode],
    "Same Day", 0,
    "First Class", 2,
    "Second Class", 4,
    "Standard Class", 6,
    "Unknown"
)
```

**Real-world use**: `SWITCH` is ideal for mapping codes to labels, department IDs to names, or status codes to descriptions.

---

## 3.3 Lookup Functions

Lookup functions find a value in one table based on a matching value from another table. They are how you connect related data - like looking up a product's cost from a catalog using the product name.

### 3.3.1 VLOOKUP - The Classic (and Its Limitations)

**Syntax**: `=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])`

**Example** - Look up the Unit Cost of each product from the ProductCatalog table:
```
=VLOOKUP([@Product_Name], ProductCatalog, 5, FALSE)
```

| Parameter | Value | Meaning |
|---|---|---|
| `lookup_value` | `[@Product_Name]` | The value to search for |
| `table_array` | `ProductCatalog` | The table to search in |
| `col_index_num` | `5` | Return the value from the 5th column (Unit_Cost) |
| `range_lookup` | `FALSE` | Exact match only |

> **Always use FALSE for exact match.** `TRUE` (approximate match) is for sorted lookup tables used in tax brackets or grade boundaries - rarely needed and often misunderstood.

**VLOOKUP's limitations**:

| Limitation | Problem | Workaround |
|---|---|---|
| **Left-to-right only** | Lookup column must be the *leftmost* column in the table_array | Use INDEX/MATCH or XLOOKUP |
| **Column index is fragile** | `col_index_num` is a hard-coded number. Insert a column in the lookup table and all your VLOOKUPs break. | Use MATCH to dynamically find the column |
| **First match only** | Returns only the first matching value | Acceptable in most cases, but be aware |
| **Case-insensitive** | `"Germany"` matches `"germany"` | Usually desired behaviour |

### 3.3.2 INDEX/MATCH - The Superior Alternative

`INDEX/MATCH` is two functions working together:

- `MATCH(lookup_value, lookup_array, match_type)` - finds the *position* (row number) of a value
- `INDEX(return_array, row_num)` - returns the value at a specific position in an array

**Combined**:
```
=INDEX(ProductCatalog[Unit_Cost], MATCH([@Product_Name], ProductCatalog[Product_Name], 0))
```

**How it works**:
1. `MATCH([@Product_Name], ProductCatalog[Product_Name], 0)` - find the row position of the product name in the catalog (0 = exact match)
2. `INDEX(ProductCatalog[Unit_Cost], ...)` - return the Unit_Cost value at that position

**Why INDEX/MATCH is superior**:

| Advantage | Explanation |
|---|---|
| **Lookup in any direction** | The lookup column and return column can be anywhere - no "left-to-right" restriction |
| **Column-insertion safe** | Uses column names, not index numbers. Inserting columns does not break it. |
| **Faster on large datasets** | MATCH searches one column; VLOOKUP loads the entire table_array into memory |
| **Two-way lookup** | Combine with a second MATCH to look up both row and column dynamically |

### 3.3.3 XLOOKUP - The Modern Replacement (Excel 365 / 2021+)

`XLOOKUP` was designed to replace both `VLOOKUP` and `HLOOKUP`. It eliminates all of VLOOKUP's limitations in a clean syntax.

**Syntax**: `=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])`

**Example**:
```
=XLOOKUP([@Product_Name], ProductCatalog[Product_Name], ProductCatalog[Unit_Cost], "Not Found")
```

| Parameter | Value | Meaning |
|---|---|---|
| `lookup_value` | `[@Product_Name]` | What to search for |
| `lookup_array` | `ProductCatalog[Product_Name]` | Where to search |
| `return_array` | `ProductCatalog[Unit_Cost]` | What to return |
| `if_not_found` | `"Not Found"` | Default value if no match (instead of #N/A) |

**XLOOKUP advantages**:
- Built-in error handling (`if_not_found` parameter)
- Searches any direction
- Can return entire rows (return_array can be multiple columns)
- Supports exact match, wildcard match, and approximate match
- Can search from bottom-to-top (`search_mode = -1`)

### 3.3.4 XMATCH - Standalone Position Finder

`XMATCH` is the modern version of `MATCH`. It finds the position of a value in a range.

```
=XMATCH([@Product_Name], ProductCatalog[Product_Name])
```

Supports wildcards, exact/approximate match, and search direction - same flexibility as XLOOKUP but returns a position number instead of a value.

### 3.3.5 Choosing the Right Lookup Function

| Scenario | Recommended Function | Why |
|---|---|---|
| Quick one-off lookup, learning | VLOOKUP | Simplest to understand and teach |
| Production workbooks, any direction | INDEX/MATCH | Works everywhere, no version dependency |
| Excel 365 / 2021+ | XLOOKUP | Cleanest syntax, built-in error handling |
| Need position, not value | MATCH or XMATCH | Returns row/column number |

---

## 3.4 Text Functions

Real-world data is messy. Names are inconsistent, addresses are crammed into single cells, codes need parsing. Text functions are your cleaning toolkit.

### 3.4.1 Extraction Functions

| Function | Purpose | Syntax | Example |
|---|---|---|---|
| `LEFT` | Extract N characters from the start | `=LEFT(text, n)` | `=LEFT("ORD-0001", 3)` → `"ORD"` |
| `RIGHT` | Extract N characters from the end | `=RIGHT(text, n)` | `=RIGHT("ORD-0001", 4)` → `"0001"` |
| `MID` | Extract N characters starting at position P | `=MID(text, start, n)` | `=MID("ORD-0001", 5, 4)` → `"0001"` |
| `LEN` | Return the length of a string | `=LEN(text)` | `=LEN("ORD-0001")` → `8` |

**Real example** - Extract the numeric part of Order_ID:
```
=MID([@Order_ID], 5, 4)
```
`"ORD-0001"` → `"0001"`

To convert to a number: `=VALUE(MID([@Order_ID], 5, 4))` → `1`

### 3.4.2 Search Functions

| Function | Purpose | Case-Sensitive? | Syntax |
|---|---|---|---|
| `FIND` | Find the position of a substring | Yes | `=FIND("@", "user@email.com")` → `5` |
| `SEARCH` | Find the position of a substring | No | `=SEARCH("@", "user@email.com")` → `5` |

**Real example** - Extract the domain from an email address:

```
=MID(A2, FIND("@", A2) + 1, LEN(A2) - FIND("@", A2))
```

For `"analyst@company.com"`:
1. `FIND("@", A2)` → 8
2. `8 + 1` → start at position 9
3. `LEN(A2) - FIND("@", A2)` → 19 - 8 = 11 characters
4. `MID(A2, 9, 11)` → `"company.com"`

### 3.4.3 Transformation Functions

| Function | Purpose | Example |
|---|---|---|
| `UPPER` | Convert to uppercase | `=UPPER("maria")` → `"MARIA"` |
| `LOWER` | Convert to lowercase | `=LOWER("MARIA")` → `"maria"` |
| `PROPER` | Capitalise first letter of each word | `=PROPER("maria schmidt")` → `"Maria Schmidt"` |
| `TRIM` | Remove leading, trailing, and extra internal spaces | `=TRIM("  Maria   Schmidt  ")` → `"Maria Schmidt"` |
| `CLEAN` | Remove non-printable characters (ASCII 0-31) | `=CLEAN(A2)` - removes line breaks, tabs |
| `SUBSTITUTE` | Replace occurrences of a substring | `=SUBSTITUTE("2023/06/15", "/", "-")` → `"2023-06-15"` |
| `REPLACE` | Replace characters at a specific position | `=REPLACE("ORD0001", 4, 0, "-")` → `"ORD-0001"` |

### 3.4.4 Joining Functions

| Function | Purpose | Example |
|---|---|---|
| `CONCAT` | Concatenate values | `=CONCAT(A2, " ", B2)` → `"Maria Schmidt"` |
| `TEXTJOIN` | Join with a delimiter, can skip blanks | `=TEXTJOIN(", ", TRUE, A2:A5)` → `"Maria, John, Georg, Martin"` |
| `&` operator | Concatenation operator | `=A2 & " - " & B2` → `"Maria - Schmidt"` |
| `TEXT` | Format a number as text | `=TEXT(45092, "yyyy-mm-dd")` → `"2023-06-15"` |

### 3.4.5 Multi-Function Text Parsing Example

**Problem**: Customer names in the sales dataset are in "First Last" format. Extract the first name and last name into separate cells.

**First name** (everything before the space):
```
=LEFT([@Customer_Name], FIND(" ", [@Customer_Name]) - 1)
```

**Last name** (everything after the space):
```
=MID([@Customer_Name], FIND(" ", [@Customer_Name]) + 1, 100)
```

The `100` in the MID function is a generous "take everything remaining" value - if the last name is shorter than 100 characters, MID simply returns what is there.

---

## 3.5 Date & Time Functions

Dates are one of the most error-prone areas in Excel, because what *looks* like a date might actually be text, and what *looks* like text might actually be a date stored as a serial number. Mastering date functions eliminates this confusion.

### 3.5.1 Core Date Functions

| Function | Purpose | Syntax | Example |
|---|---|---|---|
| `TODAY()` | Current date (updates daily) | `=TODAY()` | `2026-06-11` |
| `NOW()` | Current date and time (updates on recalculation) | `=NOW()` | `2026-06-11 12:45` |
| `DATE` | Create a date from year, month, day | `=DATE(2023, 6, 15)` | `2023-06-15` |
| `YEAR` | Extract the year | `=YEAR(A2)` | `2023` |
| `MONTH` | Extract the month (1-12) | `=MONTH(A2)` | `6` |
| `DAY` | Extract the day (1-31) | `=DAY(A2)` | `15` |
| `WEEKDAY` | Day of week (1=Sunday by default) | `=WEEKDAY(A2, 2)` | `4` (Thursday, with Monday=1 mode) |
| `WEEKNUM` | Week number of the year | `=WEEKNUM(A2)` | `24` |

### 3.5.2 Date Arithmetic Functions

| Function | Purpose | Syntax | Example |
|---|---|---|---|
| `DATEDIF` | Difference between two dates | `=DATEDIF(start, end, "unit")` | `=DATEDIF(A2, TODAY(), "Y")` → years between |
| `EOMONTH` | Last day of a month N months away | `=EOMONTH(A2, 0)` | End of the same month; `EOMONTH(A2, 1)` = end of next month |
| `NETWORKDAYS` | Working days between two dates (excludes weekends) | `=NETWORKDAYS(start, end)` | Business days between order and ship |
| `WORKDAY` | Date N working days from a start date | `=WORKDAY(A2, 10)` | 10 business days after the order date |
| `EDATE` | Date exactly N months from a start date | `=EDATE(A2, 3)` | 3 months after the order date |

**`DATEDIF` units**: `"Y"` = years, `"M"` = months, `"D"` = days, `"YM"` = months ignoring years, `"MD"` = days ignoring months and years.

> **Hidden function**: `DATEDIF` is not in Excel's autocomplete or function wizard. It is a legacy function from Lotus 1-2-3 that Microsoft never officially documented but has kept working. It is the only reliable way to calculate age in complete years.

### 3.5.3 Practical Date Examples

**Shipping duration in business days**:
```
=NETWORKDAYS([@Order_Date], [@Ship_Date])
```

**Extract fiscal quarter** (assuming fiscal year starts in January):
```
=ROUNDUP(MONTH([@Order_Date])/3, 0)
```
Or more readably: `="Q" & ROUNDUP(MONTH([@Order_Date])/3, 0)`

Returns: `Q1`, `Q2`, `Q3`, `Q4`

**Year-month label for grouping**:
```
=TEXT([@Order_Date], "YYYY-MM")
```
Returns: `"2023-06"` - useful for PivotTable-free monthly grouping.

**Employee tenure in years** (using the employee dataset):
```
=DATEDIF([@Hire_Date], TODAY(), "Y")
```

---

## 3.6 Math & Rounding Functions

### 3.6.1 Core Math Functions

| Function | Purpose | Example |
|---|---|---|
| `SUM` | Add all values | `=SUM(SalesData[Sales])` |
| `SUMIF` | Sum values matching a condition | `=SUMIF(SalesData[Region], "Europe", SalesData[Sales])` |
| `SUMIFS` | Sum values matching multiple conditions | `=SUMIFS(SalesData[Sales], SalesData[Region], "Europe", SalesData[Category], "Technology")` |
| `SUMPRODUCT` | Multiply arrays element-by-element, then sum | `=SUMPRODUCT(SalesData[Sales], SalesData[Discount])` |
| `ABS` | Absolute value | `=ABS(-45.2)` → `45.2` |
| `MOD` | Remainder after division | `=MOD(10, 3)` → `1` |
| `INT` | Round down to nearest integer | `=INT(3.9)` → `3` |

### 3.6.2 SUMPRODUCT - The Analyst's Swiss Army Knife

`SUMPRODUCT` is more powerful than it appears. It multiplies corresponding elements of arrays and sums the results - but it can also be used for conditional counting and aggregation without needing SUMIF.

**Basic use** - Weighted total:
```
=SUMPRODUCT(SalesData[Quantity], SalesData[Sales])
```
Multiplies each quantity by its sale amount, then sums all products.

**Conditional use** - Count orders where Sales > 1000 AND Region = "Europe":
```
=SUMPRODUCT((SalesData[Sales] > 1000) * (SalesData[Region] = "Europe"))
```

Each condition returns an array of 1s and 0s. Multiplying them together gives 1 only where *both* conditions are TRUE. Summing gives the count.

**Weighted average** - Average sales weighted by quantity:
```
=SUMPRODUCT(SalesData[Sales], SalesData[Quantity]) / SUM(SalesData[Quantity])
```

### 3.6.3 Rounding Functions

| Function | Behaviour | Example: Input `3.456` |
|---|---|---|
| `ROUND(x, n)` | Standard rounding (half up) | `ROUND(3.456, 2)` → `3.46` |
| `ROUNDUP(x, n)` | Always round away from zero | `ROUNDUP(3.451, 2)` → `3.46` |
| `ROUNDDOWN(x, n)` | Always round toward zero | `ROUNDDOWN(3.459, 2)` → `3.45` |
| `CEILING(x, sig)` | Round up to nearest multiple | `CEILING(3.2, 0.5)` → `3.5` |
| `FLOOR(x, sig)` | Round down to nearest multiple | `FLOOR(3.7, 0.5)` → `3.5` |
| `MROUND(x, multiple)` | Round to nearest multiple | `MROUND(17, 5)` → `15` |

**When to use each**:
- `ROUND`: General purpose - financial reports, display values
- `ROUNDUP`: Pricing (always round up to the nearest cent)
- `ROUNDDOWN`/`INT`: Tax calculations in some jurisdictions (truncate, do not round)
- `CEILING`/`FLOOR`: Binning data into groups (round ages to nearest 5 years: `=FLOOR([@Age], 5)`)

---

## 3.7 Information & Error-Handling Functions

These functions make your formulas robust - they check conditions before performing operations and gracefully handle errors.

### 3.7.1 Checking Functions

| Function | Returns TRUE when... | Use Case |
|---|---|---|
| `ISNUMBER(x)` | x is a number | Check if a date column contains real dates (dates are numbers) |
| `ISTEXT(x)` | x is text | Identify text values in a numeric column |
| `ISBLANK(x)` | x is an empty cell | Check for missing data |
| `ISERROR(x)` | x is any error | General error check |
| `ISNA(x)` | x is specifically #N/A | Check if a lookup failed |

### 3.7.2 Error-Handling Functions

**IFERROR** - Replace any error with a default value:
```
=IFERROR([@Sales] / [@Quantity], 0)
```
If the division causes `#DIV/0!` (because Quantity is 0), return 0 instead.

**IFNA** - Replace only #N/A errors:
```
=IFNA(VLOOKUP([@Product_Name], ProductCatalog, 5, FALSE), "Not in Catalog")
```
If the VLOOKUP fails to find the product, return "Not in Catalog" - but still show other errors (`#REF!`, `#VALUE!`) because those indicate real formula problems you need to fix.

> **Best practice**: Prefer `IFNA` over `IFERROR` for lookups. `IFERROR` suppresses *all* errors, which can mask genuine bugs. `IFNA` only catches the "not found" case, letting real errors surface.

### 3.7.3 Defensive Formula Pattern

A robust formula anticipates problems:

```
=IF(ISBLANK([@Sales]), "",
    IF([@Quantity] = 0, "N/A",
        ROUND([@Sales] / [@Quantity], 2)
    )
)
```

This formula:
1. Returns empty string if Sales is blank (no data)
2. Returns "N/A" if Quantity is 0 (cannot divide)
3. Otherwise calculates and rounds the unit price

---

## 3.8 Putting It All Together - Multi-Function Problems

### 3.8.1 Example: Calculate Shipping Efficiency Score

Create a metric that combines shipping speed, order value, and profitability:

```
=IFS(
    AND(NETWORKDAYS([@Order_Date], [@Ship_Date]) <= 1, [@Profit] > 0), "Excellent",
    AND(NETWORKDAYS([@Order_Date], [@Ship_Date]) <= 3, [@Profit] > 0), "Good",
    [@Profit] > 0, "Acceptable",
    TRUE, "Needs Review"
)
```

### 3.8.2 Example: Dynamic Product Markup Analysis

Combine lookup, math, and logical functions:

```
=IFERROR(
    ROUND(
        ([@Sales] / [@Quantity]) / XLOOKUP([@Product_Name], ProductCatalog[Product_Name], ProductCatalog[Unit_Cost]) - 1,
        2
    ),
    "Lookup Failed"
)
```

This calculates: `(Unit_Revenue / Unit_Cost) - 1` = markup percentage, rounded to 2 decimals, with error handling.

---

## Common Mistakes & Misconceptions

### Mistake 1: Hardcoding Values Instead of Using Cell References

```
❌ =IF(B2 > 1000, "High", "Low")     ← What if the threshold changes?
✅ =IF(B2 > $G$1, "High", "Low")     ← Threshold in G1, easy to update
```

### Mistake 2: Using VLOOKUP Column Index Numbers

```
❌ =VLOOKUP(A2, Products, 5, FALSE)   ← What is column 5? Breaks if columns change.
✅ =INDEX(Products[Unit_Cost], MATCH(A2, Products[Product_Name], 0))   ← Self-documenting
```

### Mistake 3: IFERROR Hiding Real Bugs

```
❌ =IFERROR(complex_formula, 0)       ← Masks all errors. You'll never know if it breaks.
✅ =IFNA(VLOOKUP(...), "Not Found")   ← Only handles the expected #N/A error
```

### Mistake 4: Forgetting Absolute References in Copied Formulas

When you copy a formula that should reference a fixed cell (like a total or a lookup table), use `$` or structured references. Press `F4` to toggle.

### Mistake 5: Date Functions on Text That Looks Like Dates

`=YEAR("2023-06-15")` may work, but `=YEAR("15/06/2023")` may return an error depending on your locale. Always verify with `ISNUMBER()`: `=ISNUMBER(A2)` - if FALSE, the "date" is actually text.

---



## In Simple Terms (TL;DR)

> **ELI5 (Explain Like I'm 5):**
> Functions are built-in math shortcuts. IF() lets Excel make decisions (like "If sales > 100, say Good"). VLOOKUP and XLOOKUP are like a phonebook - they search for a name and bring back the matching number.

## Practice Exercises

### Beginner

**Exercise 3.1**: In the SalesData table, create a new column `Order_Year` that extracts the year from `Order_Date`. Then create `Order_Quarter` that returns "Q1", "Q2", "Q3", or "Q4".

**Exercise 3.2**: Create a column `Ship_Days` that calculates the number of business days between `Order_Date` and `Ship_Date`.

**Exercise 3.3**: Create a column `Profit_Status` that returns "Profit" if Profit > 0, "Break Even" if Profit = 0, and "Loss" if Profit < 0.

**Exercise 3.4**: Use `SUMIF` to calculate: (a) Total Sales for "Technology" category, (b) Total Sales for "Europe" region, (c) Total Profit for "Consumer" segment.

### Intermediate

**Exercise 3.5**: Using `INDEX/MATCH`, look up the `List_Price` from the `ProductCatalog` table for each order in `SalesData`. Then calculate the discount amount as `List_Price * Quantity - Sales`.

**Exercise 3.6**: Parse the `Customer_Name` column into two new columns: `First_Name` and `Last_Name`. Handle names that might have multiple spaces correctly (use `FIND` to locate the first space).

**Exercise 3.7**: Create a `Days_Since_Order` column that calculates how many days ago each order was placed (from today). Then create a `Recency_Tier` column: "Recent" (< 180 days), "Moderate" (180-365 days), "Old" (365-730 days), "Archived" (> 730 days).

**Exercise 3.8**: Using `SUMIFS`, calculate:
- Total Sales for Technology in North America in 2024
- Total Profit for orders with Discount > 0.20
- Count of orders where Profit < 0 (use `COUNTIFS`)

### Challenge

**Exercise 3.9**: Create a formula that extracts the numeric part of `Order_ID` (e.g., `"ORD-0001"` → `1`), converts it to a number, and classifies it into order batches: Batch 1 (orders 1-250), Batch 2 (251-500), Batch 3 (501-750), Batch 4 (751-1000).

**Exercise 3.10**: Build a "Smart Lookup" formula in a new sheet. In cell A1, the user types a product name. In B1, the formula returns the Unit Cost from ProductCatalog. In C1, it returns the List Price. In D1, it calculates the standard markup percentage. In E1, it returns "Found" or "Not in Catalog". All formulas should handle errors gracefully - if A1 is blank, all cells should show "" (empty), not errors.
