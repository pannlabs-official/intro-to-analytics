# Chapter 11 - Power BI Reports, Dashboards & Storytelling

---

## Chapter Overview

You have extracted and cleaned data (Power Query). You have built the Star Schema (Data Model). You have written the logic (DAX). Now, it is time to build the interface that stakeholders will actually see.

Building a report in Power BI is fundamentally different from building charts in Excel. In Excel, visuals are static islands of data. In Power BI, every visual on the page interacts with every other visual by default. Click a bar in a chart, and the whole page filters to that category.

This chapter covers the mechanics of the Report Canvas, advanced interactivity (drill-throughs, custom tooltips), publishing to the Power BI Service, and the design principles of data storytelling - ensuring your dashboard drives action, rather than just displaying numbers.

### Prerequisites

- Chapter 9 and 10 completed.
- A Power BI model containing the `Sales` and `Products` tables, with the base measures (`Total Sales`, `Profit Margin`) created in Chapter 10.

---

## Learning Objectives

By the end of this chapter, you will be able to:

1. Build and format interactive report pages using core visuals (Cards, Matrices, Bar/Line charts)
2. Control visual interactions (filtering vs highlighting)
3. Implement advanced navigation using Drill-Through and Bookmarks
4. Design custom Report Tooltips that show underlying data on hover
5. Understand Row-Level Security (RLS) to restrict data access by user
6. Explain the difference between a Report and a Dashboard in the Power BI Service
7. Apply storytelling frameworks to structure a presentation of analytical findings

---

## 11.1 The Report Canvas Mechanics

### 11.1.1 Core Visual Types

Not all visuals are created equal. These are the workhorses of corporate reporting:

| Visual | Use Case | Configuration |
|---|---|---|
| **Card (New)** | High-level KPIs. "What is our total revenue?" | Add `[Total Sales]` to Fields. Format the callout value size. |
| **Matrix** | Detailed cross-tabulations. The PivotTable equivalent. | Rows: `Category`, `Sub_Category`. Columns: `Year`. Values: `[Total Sales]`. Expand/Collapse headers. |
| **Clustered Bar Chart** | Ranking categorical data. | Y-Axis: `Region`. X-Axis: `[Total Sales]`. Sort descending. |
| **Line Chart** | Time series trends. | X-Axis: `Date` (Month/Year). Y-Axis: `[Total Profit]`. |
| **Slicer** | User-controlled filtering. | Field: `Segment`. Format as Dropdown or Tile (Buttons). |

### 11.1.2 Formatting Best Practices

Apply the Data-Ink principles from Chapter 7, adapted for Power BI:
- **Remove backgrounds**: Turn off the white background on visuals if you are using a light grey page canvas. It creates a cleaner, seamless look.
- **Titles**: Left-align titles. Make them descriptive ("Sales by Region", not "Total Sales by Region").
- **Gridlines & Axes**: Turn off the Y-axis title if it is obvious (e.g., if the axis is just years, you do not need a label saying "Year").
- **Shadows**: Use very subtle drop shadows on visual borders to create depth, but do not overuse them.

### 11.1.3 The Default Interactivity: Cross-Filtering

Place a Bar Chart (Sales by Region) and a Line Chart (Sales over Time) on the same page.
Click the "Europe" bar.
Notice what happens to the Line Chart:
- It dims the total line, and highlights the portion belonging to Europe. This is called **Cross-Highlighting**.

Sometimes, highlighting is confusing (especially on line charts). You want the visual to completely filter instead.
1. Click the Bar Chart.
2. Go to the **Format** ribbon at the very top of the screen → **Edit Interactions**.
3. Small icons appear above every *other* visual on the page.
4. Hover over the Line Chart. Click the **Filter** icon (solid funnel) instead of the Highlight icon (faded chart).
5. Click "Europe" on the Bar Chart again. The Line chart now completely redraws to show only European data.

---

## 11.2 Advanced Navigation & Interactivity

A good report guides the user through layers of detail. Start high-level, and let them drill down if they have questions.

### 11.2.1 Drill-Through

Drill-through allows a user to right-click a data point on a summary page and jump to a detailed page filtered exactly to that data point.

**How to set it up**:
1. Create Page 1: "Summary". Add a Bar Chart showing Sales by `Category`.
2. Create Page 2: "Details". Rename the page. Add a Matrix showing detailed order lines (Order ID, Date, Customer, Profit).
3. On Page 2, look at the **Visualizations** pane. Below the formatting options, find the **Drill-through** section.
4. Drag the `Category` field into the "Add drill-through fields here" box.
5. Power BI automatically adds a back button to Page 2.

**How to use it**:
1. Go back to Page 1.
2. Right-click the "Technology" bar in the chart.
3. Select **Drill through** → **Details**.
4. You are transported to Page 2, and the matrix is automatically filtered to show only Technology orders.

### 11.2.2 Custom Report Tooltips

Default tooltips (the black box that appears when you hover over a data point) just repeat the numbers on the axis. You can replace this with an entire mini-report page.

1. Create a new page. Rename it "Tooltip".
2. Go to Format Page (click the canvas) → Page Information → **Allow use as tooltip** (On).
3. Page Setup → Type: **Tooltip** (this makes the canvas very small, like a tooltip box).
4. Add visuals to this tiny page (e.g., a mini line chart showing the trend of sales, and a card showing Profit Margin).
5. Go back to your main report page. Click the Bar Chart.
6. Format Visual → General → Tooltips → Type: Report page → Page: Tooltip.

Now, hover over the "Europe" bar. A mini-dashboard pops up showing the 12-month sales trend specifically for Europe.

### 11.2.3 Bookmarks and Buttons

Bookmarks capture the current state of a page (filters applied, visuals hidden/visible). You can link bookmarks to Buttons to create app-like navigation.

Example: A button that toggles a chart between displaying Revenue and Profit.
1. Layer a Revenue chart and a Profit chart exactly on top of each other.
2. Open View → Selection pane (to hide/show visuals) and View → Bookmarks pane.
3. Hide the Profit chart. Create a bookmark named "Show Revenue".
4. Hide the Revenue chart, unhide the Profit chart. Create a bookmark named "Show Profit".
5. Insert → Buttons → Blank. Add text "Revenue". Action: Bookmark → "Show Revenue".
6. Do the same for a "Profit" button.

---

## 11.3 Security and Governance

If you build an HR dashboard, managers should only see their own employees' salaries. You cannot rely on them to "filter nicely." You need hard security.

### 11.3.1 Row-Level Security (RLS)

RLS filters the data model based on who is logged in.

1. Modeling ribbon → **Manage Roles**.
2. Create a Role named "European Managers".
3. Select the `Sales` table. Enter a DAX filter expression:
   ```dax
   [Region] = "Europe"
   ```
4. Click Save.

To test it in Desktop: Modeling → **View as**. Check "European Managers". The entire dashboard instantly filters to Europe, and the user has no ability to clear the filter to see other regions.

When you publish to the Power BI Service, you assign user email addresses to these roles in the Security settings.

---

## 11.4 The Power BI Service (Cloud)

Once Desktop work is done, click **Publish** (Home ribbon). The file (`.pbix`) is uploaded to a Workspace in `app.powerbi.com`.

### 11.4.1 Reports vs. Dashboards

In common business language, everything is a "dashboard." In Power BI terminology, they are strictly defined:

| Feature | Power BI Report | Power BI Dashboard |
|---|---|---|
| **Structure** | Multiple pages, many visuals | A single, scrolling page canvas |
| **Interactivity** | High (cross-filtering, slicers, drill-through) | Low (clicking a visual jumps you to the underlying Report) |
| **Data Sources** | Visuals come from one dataset | Visuals can be pinned from many different reports/datasets |
| **Update Frequency** | Refreshes when the dataset refreshes | Updates dynamically |
| **Use Case** | Deep-dive analysis, filtering | High-level executive monitoring across multiple business areas |

**Workflow**: You publish a *Report*. In the Service, you hover over a visual on that report and click the "Pin" icon to pin it to a *Dashboard*.

### 11.4.2 Workspaces and Apps

- **My Workspace**: Your personal sandbox. Do not use this for company-wide reports.
- **Shared Workspace**: A collaborative environment for developers (e.g., "Finance Analytics Team").
- **Power BI App**: The final packaged product. You bundle reports and dashboards from a workspace into an "App" and publish it to the end-users. Users get a clean, read-only navigation menu without seeing the messy backend workspace.

### 11.4.3 Scheduled Refresh

If your data source is an on-premise SQL database or a shared network drive, the cloud cannot reach it automatically. You must install a **Data Gateway** on a machine within your corporate network.
Once configured in the Service, you can set the dataset to refresh automatically (e.g., daily at 6:00 AM).

---

## 11.5 Data Storytelling

A dashboard is not a story; it is a tool. A story has a narrative arc: a beginning (context), a middle (conflict/insight), and an end (resolution/recommendation).

When presenting your findings to stakeholders, do not just walk them through the dashboard ("Here is the revenue chart, here is the region filter"). Use the **SCR Framework**:

### 11.5.1 Situation, Complication, Resolution

**1. Situation (The Context)**
Establish the baseline that everyone agrees on.
*Example: "As you know, our Q3 goal was $5M in revenue across all regions, relying heavily on the launch of the new Technology product line."*

**2. Complication (The Insight / Problem)**
Introduce the anomaly or the challenge revealed by the data.
*Example: "While overall revenue hit $4.8M, the Technology line dramatically underperformed in Europe, dragging down our global margins by 12% due to heavy discounting."* (Use the dashboard here, applying the Europe and Technology filters to show the red profit margins).

**3. Resolution (The Recommendation)**
Tell them what the data suggests they should do.
*Example: "The data shows that Technology products sold at standard price in Asia moved quickly. We should pause discounting in Europe, reallocate that marketing budget to Asia for Q4, and investigate the European pricing strategy."*

### 11.5.2 The 5-Second Rule

An executive should be able to look at your dashboard and understand whether the business is winning or losing within 5 seconds.
- If it takes 30 seconds of hunting through table matrices to find the answer, the design has failed.
- Use conditional formatting (red/green text), big KPI cards at the top left, and clear titles to pass the 5-second test.

---

## Common Mistakes & Misconceptions

### Mistake 1: The "Everything" Dashboard

Trying to answer every possible question for every possible department on one page. The result is 30 tiny charts that are impossible to read, resulting in a slow-loading, confusing mess.
**Fix**: Design for personas. Build a "Sales Manager" page (high-level KPIs) and a "Sales Analyst" page (detailed matrices). Use bookmarks or separate reports to divide the content.

### Mistake 2: Poor Visual Hierarchy

Placing a detailed matrix of 500 product names in the top left corner, and the critical "Total Revenue" KPI card in the bottom right.
**Fix**: Follow the F-pattern. Big numbers top-left. Filters top-right or far-left margin. Details at the bottom.

### Mistake 3: Relying on Default Tooltips

Leaving the default tooltips on maps or scatter plots.
**Fix**: Spend 5 minutes designing a Report Tooltip. It adds massive "wow factor" and provides deep context without taking up screen real estate.

### Mistake 4: Sharing `.pbix` Files via Email

Sending a 50MB Power BI Desktop file to a manager. They open it, accidentally delete a visual, and cannot see the latest data tomorrow.
**Fix**: Desktop is for developers. Publish to the Power BI Service and share a web link. The user gets a secure, read-only, auto-updating view.

---



## In Simple Terms (TL;DR)

> **ELI5 (Explain Like I'm 5):**
> A dashboard is a collection of charts that tell a story. Good dashboards let users click on things (like a specific year) and everything else automatically updates to show just that data.

## Practice Exercises

### Beginner

**Exercise 11.1**: Open your Power BI Desktop file. Create a clean, three-visual layout:
- A Card visual showing `[Total Revenue]` (formatted as millions, e.g., $5.2M).
- A Line chart showing `[Total Revenue]` over `Order_Date` (Months).
- A Bar chart showing `[Total Revenue]` by `Region`.
Test cross-filtering by clicking the bars.

**Exercise 11.2**: Change the interaction between the Bar chart and the Line chart from "Highlight" to "Filter". Observe the difference in how the Line chart reacts when you select a region.

### Intermediate

**Exercise 11.3**: Set up a Drill-Through.
1. Create a "Summary" page with a Pie Chart (or Bar Chart) showing Sales by `Segment`.
2. Create a "Customer Details" page with a Table showing `Customer_Name`, `Order_Date`, `Sales`, and `Profit Margin`.
3. Configure the Details page to accept Drill-Through from `Segment`.
4. Test it by drilling through from "Corporate" on the Summary page.

**Exercise 11.4**: Create a custom Report Tooltip. Design a small tooltip page that contains a Bar Chart of Sales by `Sub_Category`. Attach this tooltip to the main Region Bar Chart. Hover over "Europe" to see Europe's top-selling sub-categories instantly.

### Challenge

**Exercise 11.5**: Implement Row-Level Security. Create two roles: "North America Team" and "Asia Team". Apply the appropriate DAX filters to the `Region` column in the `Sales` table (or wherever your Region column lives). Use the "View As" feature to test both roles. Ensure the dashboard accurately limits the data without breaking any measures.

**Exercise 11.6**: Prepare a 3-minute data story using the SCR framework. Find one interesting insight in the `Sales` dataset (e.g., a specific category losing money in a specific region). Write down your Situation, Complication, and Resolution. Configure your dashboard to support this narrative.
