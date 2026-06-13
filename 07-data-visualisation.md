# Chapter 7 - Data Visualisation: Charts That Communicate

---

## Chapter Overview

If statistics is how analysts reason with data, visualisation is how they communicate it. A brilliant analysis presented poorly will be ignored. A mediocre analysis presented brilliantly will drive action. Your goal is brilliant analysis presented brilliantly.

Most people learn to make charts by highlighting a table and clicking "Recommended Charts." Excel then produces something with 3D effects, clashing colours, a redundant legend, and slanted axis labels. In this chapter, you will learn to turn off Excel's bad defaults. You will learn the cognitive principles of data visualisation: what chart types to use when, how to reduce "data ink," and how to use colour strategically to draw the eye to the insight.

We will move from basic charts (bar, line, scatter) to advanced visualisations (waterfalls, bullet graphs) and finally cover dashboard design principles.

### Prerequisites

- Chapters 2-6 completed
- `datasets/01_global_superstore_sales.csv` loaded
- `datasets/05_marketing_campaigns.csv` available
- `datasets/06_financial_budget_actuals.csv` available

---

## Learning Objectives

By the end of this chapter, you will be able to:

1. Select the correct chart type for a given analytical question (comparison, trend, relationship, composition)
2. Apply the "Data-Ink Ratio" principle to strip away visual clutter from Excel's default charts
3. Use colour strategically to highlight the main message, rather than for decoration
4. Create and format Bar/Column charts, Line charts, Scatter plots, and Combo charts
5. Build advanced charts: Waterfalls (for variance) and Bullet graphs (for target tracking)
6. Understand why Pie charts are often the wrong choice, and when it is acceptable to use them
7. Apply the principles of dashboard layout (the "F-pattern", whitespace, and visual hierarchy)

---

## 7.1 Principles of Effective Visualisation

Before building a single chart, you need to understand *why* some charts work and others fail. Data visualisation relies on "preattentive attributes" - visual cues that the human brain processes in milliseconds, before conscious thought.

Length (bar charts), position (scatter plots), and line direction (line charts) are processed accurately and instantly. Area (pie charts) and colour intensity (heatmaps) are processed less accurately. This biology dictates which charts we use.

### 7.1.1 Edward Tufte and the Data-Ink Ratio

Edward Tufte, a pioneer of data visualisation, coined the term **Data-Ink Ratio**:

`Data-Ink Ratio = (Ink used to display data) / (Total ink used to print the graphic)`

**Your goal is to maximise this ratio.** Erase any ink that does not convey data.

**What to strip away from Excel's default charts**:
1. **Chart borders**: Remove the outline around the chart box
2. **Gridlines**: If you label the data points, delete the gridlines. If you keep gridlines, make them light grey, not black
3. **Axes**: If you label the bars with exact numbers, delete the vertical axis. You do not need both
4. **Legends**: If you only have one data series, delete the legend. Use the chart title to explain the data
5. **3D Effects**: Never use 3D. It distorts the data (the piece closer to the viewer looks larger than it is)
6. **Shadows and gradients**: These add cognitive load without adding information

### 7.1.2 Colour as a Tool, Not Decoration

Colour is the most abused element in Excel charts. A bar chart showing sales across 5 regions does not need 5 different colours. The labels already tell you which bar is which region.

**The rules of colour**:
1. **Start with grey**: Make all data elements a muted grey
2. **Highlight the insight**: Use a strong, bold colour (like dark blue or teal) *only* on the data point you want the audience to focus on
3. **Use semantic colours**: Red implies bad/negative. Green implies good/positive. Do not make the "Returns" bar green. Do not make the "Profit" bar red
4. **Be colourblind-friendly**: Avoid relying solely on red/green distinctions (the most common type of colour blindness). Add symbols, or use a blue/orange palette instead

### 7.1.3 The Chart Title is the Headline

Default title: *"Sales by Region"* (This just describes the axes).
Better title: *"Asia Pacific drove 45% of Q3 revenue growth, while Europe stalled."*

Treat the chart title like a newspaper headline. Tell the audience the conclusion, then use the chart to prove it.

---

## 7.2 Choosing the Right Chart Type

The biggest mistake is choosing a chart because it "looks cool." You must choose the chart that answers the analytical question.

### 7.2.1 Comparison (Magnitude)

"Which item is the biggest/smallest? How do they rank?"

**The tool**: Bar Chart or Column Chart.
- Use **Column charts** (vertical bars) when you have few categories (e.g., 4 quarters) or ordinal data (e.g., Age 20-30, 30-40, 40-50).
- Use **Bar charts** (horizontal bars) when you have long category names (e.g., product names) or many categories. It prevents tilted axis text.

**Crucial rule**: Bar/column charts must *always* start their axis at zero. Because our brains compare the *length* of the bars, cutting off the bottom exaggerates small differences.

### 7.2.2 Trends Over Time

"How is this metric changing? Is it going up, down, or flat?"

**The tool**: Line Chart.
- Place time on the horizontal (X) axis.
- Use solid lines for historical data, dashed lines for projections/forecasts.

**Alternative**: Column chart. If you have very few time periods (e.g., 3 years), a column chart is acceptable. If you have 24 months, use a line chart.

### 7.2.3 Correlation / Relationship

"Does X increase when Y increases?"

**The tool**: Scatter Plot.
- Both axes are numerical (e.g., X = Marketing Spend, Y = Revenue).
- Every dot represents one record (e.g., one campaign).
- Add a trendline to show the direction of the relationship.

### 7.2.4 Composition (Part-to-Whole)

"What percentage of the total does each piece represent?"

**The tool**: Pie Chart or 100% Stacked Bar Chart.

**The Pie Chart Controversy**: Data visualisation experts hate pie charts. Human brains are terrible at comparing angles and areas. We are great at comparing lengths.
- Is slice A bigger than slice B? In a pie chart, it is often hard to tell. In a bar chart, it is instantly obvious.

**When you CAN use a pie chart**:
1. You have 2-3 categories maximum (e.g., Male/Female, Domestic/International).
2. The differences are massive and obvious (e.g., 80% vs 20%).
3. You include the percentage labels on the slices.

For more than 3 categories, use a horizontal bar chart instead.

---

## 7.3 Hands-On: Building and Formatting Core Charts

Let us build a clean, professional chart step-by-step using `SalesData`.

### 7.3.1 Building a Clean Column Chart

**Goal**: Show total sales by Region.

1. **Create the data**: Build a PivotTable. Rows: `Region`, Values: `Sales`. Sort largest to smallest.
2. **Insert the chart**: Click inside the PivotTable → Insert → Column Chart → Clustered Column (the first option).
3. **Clean it up (Data-Ink Ratio)**:
   - Click the legend and press `Delete`.
   - Click the gridlines and press `Delete`.
   - Right-click any of the grey "Field Buttons" on the chart → **Hide All Field Buttons on Chart**.
4. **Format the axes**:
   - Double-click the vertical axis to open the Format pane.
   - If the numbers are too long (e.g., $1,000,000), change Display Units to "Millions" or "Thousands".
5. **Format the bars**:
   - Right-click a bar → Format Data Series.
   - Change **Gap Width** to 50% or 75% (Excel's default is too skinny. Fatter bars look more professional).
   - Change the Fill Color to a muted grey.
6. **Highlight the insight**:
   - Click the bars once (selects all). Click the "Asia Pacific" bar again (selects just that one).
   - Change its Fill Color to a bold blue.
7. **Add data labels**:
   - Click the chart → `+` icon (Chart Elements) → Check **Data Labels**.
   - Now that you have labels, you can delete the vertical axis entirely.
8. **Add a headline**: Change the title to *"Asia Pacific leads regional sales at $1.2M"*.

Compare your result to Excel's default. Yours is cleaner, faster to read, and tells a specific story.

### 7.3.2 Building a Line Chart with a Target

**Goal**: Show monthly sales against a target.

1. **Create the data**: PivotTable. Rows: `Order_Date` (grouped by Year and Month). Values: `Sales`. Filter to a specific year.
2. **Insert the chart**: Insert → Line Chart → Line with Markers.
3. **Clean it up**: Delete legend, hide field buttons.
4. **Add a target line**:
   - In the cells next to the PivotTable, type a target number (e.g., $100,000) and copy it down for all months.
   - Copy these target cells (`Ctrl+C`). Select the chart, and Paste (`Ctrl+V`). A second line appears.
5. **Format the target line**:
   - Right-click the target line → Format Data Series.
   - Change line colour to red or dark grey.
   - Change "Dash type" to a dashed line (this is the universal visual language for targets/projections).
   - Remove the markers from the target line (Marker Options → None).

### 7.3.3 Building a Combo Chart (Dual Axis)

**Goal**: Show Sales (magnitude, large numbers) and Profit Margin (percentage, very small numbers) on the same chart over time.

If you put both on a standard chart, the Profit Margin line will sit flat at the bottom because 0.15 (15%) is invisible on an axis that goes up to $100,000.

1. **Create the data**: PivotTable. Rows: `Order_Date` (Months). Values: `Sales` and `Profit Margin` (Calculated Field).
2. **Insert Combo Chart**: Insert → Recommended Charts → All Charts → **Combo**.
3. **Configure**:
   - Sales: Clustered Column, Primary Axis.
   - Profit Margin: Line with Markers, **Secondary Axis** (check the box).
4. **Format**:
   - Ensure the secondary axis (percentages) is formatted as %.
   - Colour the Sales bars light grey. Colour the Profit Margin line a bold colour.
   - Make the chart title explicitly mention both metrics so the dual axes do not confuse the reader.

---

## 7.4 Advanced Business Charts

These charts are not in Excel's standard gallery, but they are essential for corporate reporting.

### 7.4.1 The Waterfall Chart (Variance Analysis)

**Purpose**: To explain *why* a number changed from Point A to Point B by showing the positive and negative contributing factors.

**Example**: Why did profit drop from Q1 to Q2?
- Q1 Profit: $50,000
- Technology grew: +$10,000
- Furniture crashed: -$25,000
- Office Supplies dropped: -$5,000
- Q2 Profit: $30,000

**How to build in Excel (2016+)**:
1. You must build this from a plain Table or range, *not* a PivotTable (Waterfall charts do not support PivotTables directly).
2. Set up your data with the start value, the changes, and the end value.
3. Select the data → Insert → Waterfall Chart.
4. **Crucial step**: Double-click the "Q1 Profit" bar to select just that bar. Right-click → **Set as Total**. Repeat for "Q2 Profit". This anchors them to the baseline instead of letting them float.
5. Format the positive changes green and negative changes red.

### 7.4.2 The Bullet Graph (Target Tracking)

Invented by Stephen Few, the bullet graph was designed to replace dashboard gauges and dials (which take up too much space and provide too little context).

A bullet graph shows a primary measure (bar), a target (marker), and qualitative ranges (e.g., poor, satisfactory, good) as background bands.

**How to build in Excel** (using a workaround, as it is not a native chart type):
1. Use a Clustered Column chart.
2. Put the actual value, target value, and the background ranges (e.g., 0-50, 50-75, 75-100) in your data.
3. Move the Target to a Secondary Axis, change its chart type to a Line with Markers (no line, just the marker). Change the marker to a horizontal dash.
4. Move the Actual value to the Secondary Axis as well. Make its Gap Width very wide (so the bar is skinny).
5. Ensure the Primary and Secondary axes have the exact same maximum value, then hide the Secondary axis.

*(Note: Bullet graphs are natively supported in Power BI, which we will cover in Chapter 11. In Excel, they require significant formatting effort).*

---

## 7.5 Conditional Formatting as Visualisation

Sometimes a chart is the wrong tool. If a stakeholder wants to see the exact numbers in a table, but you want to guide their eye to the insights, use **in-cell visualisation**.

### 7.5.1 Data Bars

Data bars turn a column of numbers into tiny in-cell bar charts.
- Select the numbers → Home → Conditional Formatting → Data Bars.
- **Tip**: Check the box "Show Bar Only" (Edit Rule) to hide the numbers and just show the bars, effectively creating a mini chart column within a table.

### 7.5.2 Heatmaps (Color Scales)

Heatmaps use colour intensity to represent values. Excellent for cross-tabulations (e.g., Sales by Day of Week vs Hour of Day).
- Select the grid of numbers → Home → Conditional Formatting → Color Scales.
- **Tip**: Do not use the Red-Yellow-Green scale. It is terrible for colourblind users and implies good/bad when that might not be true. Use a single-colour gradient (e.g., Light Blue to Dark Blue) for pure magnitude.

### 7.5.3 Sparklines

Sparklines are tiny line or column charts that fit inside a single cell. They provide historical context to a current-status table without taking up space.
- Select the cell where you want the sparkline → Insert → Sparklines (Line or Column) → Select the data range (e.g., the 12 months of historical data).
- **Tip**: Always add the "High Point" and "Low Point" markers (Sparkline tab) to provide reference points.

---

## 7.6 Designing an Excel Dashboard

A dashboard is a visual display of the most important information needed to achieve one or more objectives, consolidated on a single screen.

### 7.6.1 The Grid Layout

Never place charts randomly on a sheet. Use the spreadsheet grid to enforce alignment.
1. Create a new sheet named "Dashboard".
2. Turn off gridlines for the entire sheet (View → uncheck Gridlines).
3. Resize the columns to be narrow (e.g., width 2 or 3) to create a fine grid.
4. Snap your charts to this grid (Hold `Alt` while dragging a chart to snap it perfectly to the cell borders).

### 7.6.2 The F-Pattern and Visual Hierarchy

Eye-tracking studies show that in western cultures, people scan dashboards in an "F" pattern: Top-left across, then down the left side, then across again.

**Layout strategy**:
- **Top Left**: The most important high-level KPIs (Total Revenue, Total Profit). Large numbers, no charts.
- **Top Right**: Interactive controls (Slicers, Timelines).
- **Middle Row**: Context charts (Trends over time, Performance against target).
- **Bottom Row**: Detailed charts (Breakdowns by category, region, product).

### 7.6.3 The Dashboard Construction Workflow

Do not build charts directly from raw data on the dashboard sheet. Use a three-layer architecture:

1. **Data Layer** (Sheet: `SalesData`): The raw table. Hide this from the end user.
2. **Calculation Layer** (Sheet: `Pivot_Calcs`): A sheet containing all the PivotTables and formulas driving the dashboard. Hide this.
3. **Presentation Layer** (Sheet: `Dashboard`): The clean sheet containing only Charts, KPI text boxes, and Slicers.

When you create a chart from a PivotTable in the Calculation layer, simply cut it (`Ctrl+X`) and paste it (`Ctrl+V`) onto the Dashboard layer. The chart remains linked to the hidden PivotTable.

---

## Common Mistakes & Misconceptions

### Mistake 1: The Exploding 3D Pie Chart

The worst chart in business. 3D distorts the area (making the front slice look bigger than it is mathematically). "Exploding" the slices makes it harder for the eye to compare them. Never use 3D charts for 2D data.

### Mistake 2: Dual Axes with Different Baselines

If you use a secondary axis, both axes **must** start at zero. If the primary axis starts at 0 and the secondary axis starts at 50, the lines will cross in meaningless places, implying correlations that do not exist.

### Mistake 3: Putting a Line Chart on Categorical Data

A line implies continuity. You can draw a line from January to February. You **cannot** draw a line from "Furniture" to "Technology" - there is no continuous space between them. Use a bar chart for categorical data.

### Mistake 4: Overusing Red and Green

Red and Green mean "Bad" and "Good". If you use a red bar for "North Region" and a green bar for "South Region", the audience will subliminally assume the North is failing and the South is succeeding, regardless of the actual numbers.

### Mistake 5: "Decorating" Instead of Communicating

Adding corporate logos in the background of a chart, using pictures of products instead of bars, or applying heavy bevel effects. This is chartjunk. It distracts from the data.

---



## In Simple Terms (TL;DR)

> **ELI5 (Explain Like I'm 5):**
> Charts make numbers easy to see. Bar charts compare sizes. Line charts show time. Avoid pie charts because human brains are bad at judging slices. Keep it simple and remove useless ink.

## Practice Exercises

### Beginner

**Exercise 7.1**: Open `datasets/01_global_superstore_sales.csv`. Create a PivotTable of Sales by Sub_Category. Insert a default Clustered Column chart. Now apply the Data-Ink principles: remove gridlines, remove the legend, hide field buttons, change the bars to grey, and make the top-selling Sub_Category blue. Add data labels. Compare the before and after.

**Exercise 7.2**: Change the chart from 7.1 to a Bar chart (horizontal). Why is this better for the Sub_Category data?

**Exercise 7.3**: Create a PivotTable of Sales by Month. Create a Line Chart. Delete the legend. Add a linear trendline. Change the trendline to a dashed grey line.

### Intermediate

**Exercise 7.4**: Using `datasets/05_marketing_campaigns.csv`, create a Scatter Plot with `Spend` on the X-axis and `Revenue` on the Y-axis. Does there appear to be a correlation? Add a trendline to confirm.

**Exercise 7.5**: Open `datasets/06_financial_budget_actuals.csv`. Create a PivotTable comparing `Budget` vs `Actual` by Department. Create a Combo Chart where `Budget` is a grey Column chart and `Actual` is a red Line chart with markers (no connecting line). This is a clean way to show "actual vs target" without overlapping bars.

**Exercise 7.6**: On a new sheet, build a KPI grid. Write formulas that extract the Total Sales, Total Profit, and Profit Margin for the most recent month. Format these numbers with very large font sizes (e.g., 24pt). Below each, insert a Sparkline showing the 12-month trend for that metric.

### Challenge

**Exercise 7.7**: Build a complete, interactive Dashboard using the three-layer architecture (Data, Calculation, Dashboard sheets).
- Include 3 high-level KPIs at the top
- Include a Line chart showing sales over time
- Include a Bar chart showing sales by Region
- Include Slicers for `Category` and `Segment` (connected to all charts and KPIs)
- Apply the F-pattern layout and remove all gridlines
- Ensure all charts follow the Data-Ink ratio principles (no unnecessary borders, legends, or gridlines)
