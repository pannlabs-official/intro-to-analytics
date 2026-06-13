# Chapter 5 - Statistics for Analysts: The Reasoning Layer

---

## Chapter Overview

This chapter changes how you think about data. Up to now, you have been learning to *handle* data - import it, clean it, look things up, compute values. Statistics teaches you to *reason* about data - to distinguish signal from noise, to quantify uncertainty, and to make defensible claims about what the numbers actually mean.

This is not a university statistics course. We skip derivations and proofs. Instead, every concept is taught through the lens of "How does this help me make a better decision?" - with worked examples using the course datasets. You will compute every statistic in Excel, interpret the results in plain English, and understand the common traps that lead analysts to wrong conclusions.

### Prerequisites

- Chapters 2-4 completed
- `datasets/01_global_superstore_sales.csv` loaded as `SalesData`
- `datasets/03_employee_data.csv` loaded as `EmployeeData`
- `datasets/04_oil_gas_production.csv` available
- `datasets/07_hospital_patient_flow.csv` available

---

## Learning Objectives

By the end of this chapter, you will be able to:

1. Calculate and interpret measures of central tendency (mean, median, mode) and know when each is appropriate
2. Calculate and interpret measures of spread (range, variance, standard deviation, IQR)
3. Build frequency distributions and histograms to visualise data shape
4. Identify outliers using the IQR method and z-scores
5. Explain basic probability concepts and apply conditional probability reasoning
6. Understand the normal distribution and apply the 68-95-99.7 rule
7. Calculate and interpret correlation coefficients, and explain why correlation ≠ causation
8. Perform and interpret a basic hypothesis test (t-test) in Excel

---

## 5.1 Descriptive Statistics - Summarising Data

### 5.1.1 Measures of Central Tendency

Central tendency answers: "What is the typical value?"

**Mean (Average)**: The sum of all values divided by the count.

```
=AVERAGE(SalesData[Sales])
```

**When to use**: When the data is roughly symmetric with no extreme outliers. Good for: test scores, temperatures, production quantities.

**When NOT to use**: When the data is skewed or has outliers. Bad for: incomes, house prices, CEO compensation.

**Median**: The middle value when data is sorted. Half the values are above, half below.

```
=MEDIAN(SalesData[Sales])
```

**When to use**: When the data is skewed or contains outliers. The median is robust - a single billionaire does not distort it.

**Example - Why median matters for salary data**:

Using `datasets/03_employee_data.csv`:

```
=AVERAGE(EmployeeData[Salary])     → approximately $85,000
=MEDIAN(EmployeeData[Salary])      → approximately $76,000
```

The mean is pulled up by a few high-salary VPs and Directors. The median better represents what a "typical" employee earns. When someone asks "What do employees at this company make?", the median is the honest answer.

**Mode**: The most frequently occurring value.

```
=MODE.SNGL(EmployeeData[Performance_Rating])
```

For `MODE.MULT` (which returns all modes if there are ties), use:
```
=MODE.MULT(range)    → spills multiple values (Excel 365)
```

**When to use**: Categorical or discrete data. "What is the most common rating?", "What is the most popular product category?"

### 5.1.2 Measures of Spread

Knowing the centre is not enough. Two datasets can have the same average but wildly different distributions.

**Example**: Two sales teams both average $500/day. Team A: every member sells between $480-$520. Team B: members sell between $100-$900. Same average, completely different reality.

**Range**: Maximum minus minimum. Simplest measure, but sensitive to outliers.
```
=MAX(SalesData[Sales]) - MIN(SalesData[Sales])
```

**Variance**: The average of squared deviations from the mean. Measures how spread out the data is.
```
=VAR.S(SalesData[Sales])     → sample variance (use this for data samples)
=VAR.P(SalesData[Sales])     → population variance (use when you have ALL the data)
```

> **S vs P**: Use `.S` (sample) when your data is a subset of a larger population. Use `.P` (population) when your data IS the entire population. In practice, `.S` is almost always correct - you rarely have data on every single entity that ever existed.

**Standard Deviation**: The square root of variance. Same unit as the original data (dollars, hours, barrels).
```
=STDEV.S(SalesData[Sales])     → sample standard deviation
=STDEV.P(SalesData[Sales])     → population standard deviation
```

**Interpretation**: If the mean is $500 and the standard deviation is $200, most values fall within $300-$700 (one standard deviation from the mean). A sale of $1,200 is unusually high (3.5 standard deviations above the mean).

### 5.1.3 Summary Statistics Table - Employee Dataset

Build this summary table in Excel for the `Salary` column of `EmployeeData`:

| Statistic | Formula | Value (approximate) |
|---|---|---|
| Count | `=COUNTA(EmployeeData[Salary])` | 200 |
| Mean | `=AVERAGE(EmployeeData[Salary])` | ~$85,000 |
| Median | `=MEDIAN(EmployeeData[Salary])` | ~$76,000 |
| Mode | `=MODE.SNGL(EmployeeData[Salary])` | Varies |
| Min | `=MIN(EmployeeData[Salary])` | ~$38,000 |
| Max | `=MAX(EmployeeData[Salary])` | ~$185,000 |
| Range | `=MAX(...) - MIN(...)` | ~$147,000 |
| Std Dev | `=STDEV.S(EmployeeData[Salary])` | ~$35,000 |
| Variance | `=VAR.S(EmployeeData[Salary])` | ~1.2 billion |

Notice: Mean > Median, which tells you the distribution is **right-skewed** (pulled up by high earners). This is typical for salary data worldwide.

---

## 5.2 Frequency Distributions & Histograms

### 5.2.1 What They Show

A frequency distribution groups values into ranges (bins) and counts how many values fall in each range. A histogram is its visual representation.

**Why you need this**: Summary statistics (mean, median) tell you the centre. A histogram tells you the *shape* - is the data symmetric? Skewed? Bimodal (two peaks)? Shape determines which statistics are valid and which analytical approaches are appropriate.

### 5.2.2 Building a Frequency Distribution in Excel

**Using COUNTIFS for manual binning**:

Define your bins for the `Sales` column:

| Bin Label | Lower | Upper | Count Formula |
|---|---|---|---|
| $0 - $500 | 0 | 500 | `=COUNTIFS(SalesData[Sales], ">="&0, SalesData[Sales], "<"&500)` |
| $500 - $1,000 | 500 | 1000 | `=COUNTIFS(SalesData[Sales], ">="&500, SalesData[Sales], "<"&1000)` |
| $1,000 - $2,000 | 1000 | 2000 | `=COUNTIFS(SalesData[Sales], ">="&1000, SalesData[Sales], "<"&2000)` |
| $2,000 - $5,000 | 2000 | 5000 | ... |
| $5,000+ | 5000 | ∞ | `=COUNTIFS(SalesData[Sales], ">="&5000)` |

### 5.2.3 Using the Data Analysis ToolPak

Excel has a built-in histogram tool (if you install the Analysis ToolPak add-in):

1. File → Options → Add-Ins → Go → check "Analysis ToolPak" → OK
2. Data → Data Analysis → Histogram
3. Input Range: select the Sales column
4. Bin Range: select your bin boundaries
5. Check "Chart Output"

### 5.2.4 Interpreting Shape

| Shape | Description | Example | Implication |
|---|---|---|---|
| **Symmetric (Normal)** | Bell-shaped, mean ≈ median | Test scores, heights | Mean is appropriate; standard deviation is meaningful |
| **Right-skewed** | Long tail to the right, mean > median | Salaries, house prices, company revenues | Use median, not mean; consider log transformation |
| **Left-skewed** | Long tail to the left, mean < median | Age at retirement, exam scores (if most students do well) | Use median |
| **Bimodal** | Two distinct peaks | Mixed populations (e.g., height of men and women combined) | Consider separating into subgroups |
| **Uniform** | Roughly equal frequencies across bins | Random number generator, roll of a fair die | Mean and median are nearly equal but not very informative |

---

## 5.3 Percentiles, Quartiles & Outlier Detection

### 5.3.1 Percentiles

A percentile tells you the value below which a given percentage of observations fall.

```
=PERCENTILE.INC(SalesData[Sales], 0.90)    → 90th percentile
```

The 90th percentile means: 90% of all sales are below this value.

**Common percentiles**:
- 25th percentile (Q1) = First quartile
- 50th percentile (Q2) = Median
- 75th percentile (Q3) = Third quartile
- 90th, 95th, 99th = Used for outlier detection and SLA thresholds

### 5.3.2 Quartiles

```
=QUARTILE.INC(SalesData[Sales], 1)    → Q1 (25th percentile)
=QUARTILE.INC(SalesData[Sales], 2)    → Q2 (median)
=QUARTILE.INC(SalesData[Sales], 3)    → Q3 (75th percentile)
```

### 5.3.3 Interquartile Range (IQR) and Outlier Detection

The **IQR** is the range of the middle 50% of data: `IQR = Q3 - Q1`.

**The 1.5×IQR Rule**: A value is an outlier if it falls below `Q1 - 1.5×IQR` or above `Q3 + 1.5×IQR`.

**Worked example - Oil production outliers**:

```
Q1 = QUARTILE.INC(OilData[Oil_BBL], 1)        → e.g., 3,500
Q3 = QUARTILE.INC(OilData[Oil_BBL], 3)        → e.g., 15,000
IQR = Q3 - Q1                                  → 11,500
Lower fence = Q1 - 1.5 * IQR                   → 3,500 - 17,250 = -13,750 (floor at 0)
Upper fence = Q3 + 1.5 * IQR                   → 15,000 + 17,250 = 32,250
```

Any well producing more than 32,250 barrels in a month is flagged as an outlier. These warrant investigation - are they genuinely exceptional wells, or data entry errors?

**Formula to flag outliers**:
```
=IF(OR([@Oil_BBL] < Q1 - 1.5 * IQR, [@Oil_BBL] > Q3 + 1.5 * IQR), "Outlier", "Normal")
```

### 5.3.4 Z-Scores - Standardised Distance from the Mean

A z-score tells you how many standard deviations a value is from the mean:

```
z = (value - mean) / standard_deviation
```

In Excel:
```
=([@Sales] - AVERAGE(SalesData[Sales])) / STDEV.S(SalesData[Sales])
```

| Z-Score | Interpretation |
|---|---|
| 0 | Exactly at the mean |
| 1.0 | One standard deviation above the mean (~84th percentile) |
| -1.0 | One standard deviation below the mean (~16th percentile) |
| 2.0 | Two standard deviations above (~97.7th percentile) - unusual |
| 3.0 | Three standard deviations above (~99.9th percentile) - very unusual |
| > 3.0 or < -3.0 | Potential outlier |

---

## 5.4 Probability Fundamentals

### 5.4.1 Basic Probability

**Probability** measures how likely an event is. It ranges from 0 (impossible) to 1 (certain).

```
P(event) = Number of favourable outcomes / Total number of possible outcomes
```

**Example from the sales dataset**: What is the probability that a randomly selected order is from the Technology category?

```
=COUNTIF(SalesData[Category], "Technology") / COUNTA(SalesData[Category])
```

If 350 of 1000 orders are Technology: P(Technology) = 0.35 or 35%.

### 5.4.2 Conditional Probability

**Conditional probability** is the probability of event A, given that event B has already occurred.

```
P(A|B) = P(A and B) / P(B)
```

**Example**: What is the probability an order is unprofitable, given that it has a discount > 30%?

```
P(Unprofitable | Discount > 30%) = Count(Profit < 0 AND Discount > 0.30) / Count(Discount > 0.30)
```

In Excel:
```
=COUNTIFS(SalesData[Profit], "<0", SalesData[Discount], ">0.30") / COUNTIFS(SalesData[Discount], ">0.30")
```

If this returns 0.45, then 45% of heavily discounted orders are unprofitable. Compare to the overall unprofitable rate - if that is only 15%, the high discount is clearly associated with losses.

### 5.4.3 Independent vs Dependent Events

**Independent events**: The outcome of one does not affect the other. Coin flips, separate customer orders.

**Dependent events**: The outcome of one affects the other. Drawing cards from a deck without replacement, equipment failures in a shared system.

**In analytics**: Understanding independence matters for A/B testing. If a customer sees both Test A and Test B (not independent), your test results are contaminated.

---

## 5.5 The Normal Distribution

### 5.5.1 Why It Matters

The **normal distribution** (bell curve) is the most important distribution in statistics because:
1. Many natural phenomena are approximately normal (heights, test scores, measurement errors)
2. The **Central Limit Theorem** says that the *average* of many random samples is approximately normal, even if the underlying data is not
3. Most statistical tests assume normality (or approximate it)

### 5.5.2 Properties

- Symmetric around the mean
- Mean = Median = Mode
- Defined by two parameters: mean (μ) and standard deviation (σ)

**The 68-95-99.7 Rule**:

```
                      99.7%
                 ┌──────────────────┐
            95%  │                  │
         ┌───────────────────┐     │
    68%  │                   │     │
    ┌─────────────────┐      │     │
    │                 │      │     │
────┼──────┼──────┼──────┼──────┼──────┼──────┼────
  -3σ   -2σ    -1σ     μ    +1σ   +2σ   +3σ
```

- 68% of data falls within ±1 standard deviation of the mean
- 95% falls within ±2 standard deviations
- 99.7% falls within ±3 standard deviations

### 5.5.3 Excel Normal Distribution Functions

```
=NORM.DIST(x, mean, stdev, TRUE)    → Cumulative probability (P ≤ x)
=NORM.DIST(x, mean, stdev, FALSE)   → Probability density at x
=NORM.INV(probability, mean, stdev)  → x value for a given cumulative probability
=NORM.S.DIST(z, TRUE)               → Standard normal cumulative (z-score)
```

**Example**: Employee salaries have mean $85,000 and std dev $35,000 (approximately normal). What percentage of employees earn less than $60,000?

```
=NORM.DIST(60000, 85000, 35000, TRUE)   → approximately 0.238 → 23.8%
```

What salary is at the 90th percentile?
```
=NORM.INV(0.90, 85000, 35000)   → approximately $129,850
```

---

## 5.6 Correlation

### 5.6.1 What Correlation Measures

**Correlation** measures the strength and direction of the linear relationship between two variables. The correlation coefficient (r) ranges from -1 to +1.

| r Value | Interpretation |
|---|---|
| +1.0 | Perfect positive linear relationship |
| +0.7 to +0.9 | Strong positive |
| +0.4 to +0.6 | Moderate positive |
| +0.1 to +0.3 | Weak positive |
| 0 | No linear relationship |
| -0.1 to -0.3 | Weak negative |
| -0.4 to -0.6 | Moderate negative |
| -0.7 to -0.9 | Strong negative |
| -1.0 | Perfect negative linear relationship |

### 5.6.2 Calculating in Excel

```
=CORREL(SalesData[Sales], SalesData[Profit])
```

**Example correlations to explore in the datasets**:

| Variables | Expected Correlation | Why |
|---|---|---|
| Sales vs Profit | Moderate positive (~0.5-0.7) | Higher sales generally mean higher profit, but discounts can create losses on high-revenue orders |
| Sales vs Discount | Weak positive | Higher discounts may drive larger orders |
| Discount vs Profit | Moderate negative | Higher discounts reduce margin |
| Employee Performance vs Satisfaction | Moderate positive (~0.55) | Designed into our dataset |
| Marketing Spend vs Revenue | Positive | More spend → more conversions (but is it causal?) |

### 5.6.3 Correlation ≠ Causation (Again, With Numbers)

Calculate: `=CORREL(SalesData[Sales], SalesData[Quantity])`. You will get a positive correlation. Does this mean selling more units *causes* higher revenue? No - it *is* higher revenue (Sales = Price × Quantity). The correlation is tautological.

A more insidious example: Employee tenure correlates with salary. Does staying longer *cause* higher pay? Partially. But it could also be that higher-paid employees have more reason to stay (reverse causation), or that both are driven by job level (confounding variable).

**Always ask**:
1. Is there a plausible mechanism? (Does X logically influence Y?)
2. Could a third variable explain both? (Confounding)
3. Could the direction be reversed? (Reverse causation)

### 5.6.4 Simple Linear Regression in Excel

Regression fits a line `y = mx + b` to your data:

```
=SLOPE(known_y's, known_x's)        → m (slope)
=INTERCEPT(known_y's, known_x's)    → b (y-intercept)
=RSQ(known_y's, known_x's)          → R² (coefficient of determination)
```

**R² interpretation**: The proportion of variance in Y explained by X.
- R² = 0.64 means 64% of the variation in Y is explained by its linear relationship with X
- The remaining 36% is due to other factors not in the model

**Example**: Does marketing spend predict revenue?
```
=SLOPE(MarketingData[Revenue], MarketingData[Spend])        → how much revenue per dollar spent
=INTERCEPT(MarketingData[Revenue], MarketingData[Spend])     → baseline revenue with zero spend
=RSQ(MarketingData[Revenue], MarketingData[Spend])           → how much of revenue variation does spend explain?
```

---

## 5.7 Hypothesis Testing - Making Claims About Data

### 5.7.1 The Logic of Hypothesis Testing

Every hypothesis test follows the same logic:

1. **State the null hypothesis (H₀)**: "Nothing interesting is happening. Any difference is due to random chance."
2. **State the alternative hypothesis (H₁)**: "Something real is happening. The difference is not due to chance."
3. **Calculate a test statistic**: How extreme is our observed result under the null hypothesis?
4. **Find the p-value**: If nothing were happening, how likely is a result this extreme?
5. **Compare p-value to significance level (α)**: Usually α = 0.05 (5%).
   - If p < α → Reject H₀ (the result is statistically significant)
   - If p ≥ α → Fail to reject H₀ (insufficient evidence)

### 5.7.2 The p-Value Explained Simply

**The p-value answers**: "If there were truly no difference (no effect, no relationship), what is the probability of seeing a result at least as extreme as what we observed?"

- p = 0.03 → "If nothing were happening, there is only a 3% chance of seeing this result by random chance. That is unlikely enough to conclude something real is happening."
- p = 0.42 → "If nothing were happening, there is a 42% chance of seeing this result by random chance. That is common enough that we cannot conclude anything special."

> **Critical misconception**: The p-value is NOT the probability that the null hypothesis is true. It is the probability of the data, given that the null is true. The distinction is subtle but important.

### 5.7.3 T-Test in Excel

The **t-test** compares the means of two groups. Are they different enough that the difference is unlikely to be random chance?

**Excel function**:
```
=T.TEST(array1, array2, tails, type)
```

| Parameter | Value | Meaning |
|---|---|---|
| `array1` | First group's values | e.g., Sales for "Technology" |
| `array2` | Second group's values | e.g., Sales for "Furniture" |
| `tails` | 1 or 2 | 1 = one-tailed (testing if A > B); 2 = two-tailed (testing if A ≠ B) |
| `type` | 1, 2, or 3 | 1 = paired; 2 = equal variance; 3 = unequal variance (use 3 if unsure) |

**Example** - Do Technology orders have significantly different sales amounts than Furniture orders?

First, separate the data (or use array formulas):
```
=T.TEST(
    IF(SalesData[Category]="Technology", SalesData[Sales]),
    IF(SalesData[Category]="Furniture", SalesData[Sales]),
    2, 3
)
```

> Note: This requires entering as a `Ctrl+Shift+Enter` array formula in older Excel, or will work naturally in Excel 365 with dynamic arrays.

If the result is p = 0.002, we conclude: "There is a statistically significant difference in sales between Technology and Furniture (p = 0.002, two-tailed t-test with unequal variances). Technology orders tend to be higher in value."

### 5.7.4 Type I and Type II Errors

| | H₀ is actually TRUE | H₀ is actually FALSE |
|---|---|---|
| **We reject H₀** | Type I Error (false positive) - we claim an effect exists when it does not | Correct decision (true positive) |
| **We fail to reject H₀** | Correct decision (true negative) | Type II Error (false negative) - we miss a real effect |

**Real consequences**:
- **Type I (false positive)**: A pharmaceutical company approves a drug that does not actually work → patients take ineffective medication, money is wasted
- **Type II (false negative)**: A marketing team concludes that a new campaign had no effect, when it actually did → they discard a profitable strategy

The significance level α controls Type I error rate. Setting α = 0.05 means you accept a 5% chance of false positives. Lower α (0.01) reduces false positives but increases false negatives.

---

## Common Mistakes & Misconceptions

### Mistake 1: Using the Mean for Skewed Data

If your histogram is not roughly symmetric, the mean is misleading. Report the median. Better yet, report both and explain why they differ.

### Mistake 2: Confusing Standard Deviation with Standard Error

Standard deviation measures spread in your data. Standard error measures precision of your estimate of the mean. They are related but different - standard error = standard deviation / √n.

### Mistake 3: Claiming Statistical Significance = Practical Importance

A p-value of 0.03 means the difference is unlikely to be random. It says nothing about whether the difference is *large enough to matter*. A 0.1% improvement in conversion rate might be statistically significant with enough data, but not worth the effort to implement.

### Mistake 4: Cherry-Picking Subgroups

If you test 20 subgroups at α = 0.05, you expect 1 false positive by chance. Finding one "significant" result in 20 tests is not a discovery - it is statistics working as designed. Always account for multiple comparisons.

### Mistake 5: Interpreting Correlation as Causation

Already covered in Chapter 1 and Section 5.6.3, but it bears repeating. High correlation between X and Y means they move together. It does not mean X causes Y, Y causes X, or that the relationship will hold in the future.

---



## In Simple Terms (TL;DR)

> **ELI5 (Explain Like I'm 5):**
> Statistics is just summarizing lots of numbers. Mean is the average. Median is the middle number (which is safer if you have crazy outliers). A normal distribution just means most things are average and extreme things are rare.

## Practice Exercises

### Beginner

**Exercise 5.1**: Using `EmployeeData`, calculate the mean, median, and standard deviation of `Salary`. Is the distribution symmetric? How do you know?

**Exercise 5.2**: Calculate the 25th, 50th, and 75th percentiles of `Sales` in `SalesData`. What is the IQR?

**Exercise 5.3**: Using `COUNTIFS`, build a frequency distribution for the `Wait_Time_Min` column in the hospital dataset. Use bins of 30 minutes (0-30, 30-60, 60-90, etc.).

**Exercise 5.4**: What is the probability that a randomly selected order from `SalesData` is: (a) from Europe? (b) from the Technology category? (c) unprofitable (Profit < 0)?

### Intermediate

**Exercise 5.5**: Using the IQR method, identify outliers in the `Oil_BBL` column of the oil & gas dataset. How many outlier records are there? Which wells are they from?

**Exercise 5.6**: Calculate the correlation between `Sales` and `Profit` in `SalesData`. Create a scatter plot to visualise it. Then calculate the correlation between `Discount` and `Profit`. What story do these correlations tell?

**Exercise 5.7**: Using the normal distribution, if employee salaries are approximately normal with mean $85,000 and std dev $35,000, what percentage of employees earn: (a) less than $50,000? (b) more than $120,000? (c) between $60,000 and $100,000?

### Challenge

**Exercise 5.8**: Perform a t-test to determine whether there is a statistically significant difference in `Satisfaction_Score` between employees who left the company (`Attrition = "Yes"`) and those who stayed (`Attrition = "No"`). Report the p-value and interpret the result.

**Exercise 5.9**: Using the hospital patient flow dataset, test whether weekend wait times are statistically significantly longer than weekday wait times. What is the p-value? What practical recommendation would you make based on this finding?

**Exercise 5.10**: In the employee dataset, calculate the average salary by Gender. Is there a difference? Perform a t-test. If significant, explain what confounding variables might account for the difference (Hint: job title distribution). Calculate the average salary by Gender *within each Job Title* - does the gap persist, shrink, or disappear? This is Simpson's Paradox in action.
