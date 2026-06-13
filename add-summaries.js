const fs = require('fs');
const path = require('path');

const dir = __dirname;
const chapters = [
  { file: '00-course-overview.md', summary: 'This course teaches you how to use Excel, stats, and Power BI to make smart business choices. We start simple and end with you building real dashboards.' },
  { file: '01-what-is-data-analytics.md', summary: 'Data analytics is just answering questions using numbers. "Descriptive" means what happened. "Diagnostic" means why it happened. "Predictive" means what will happen next. "Prescriptive" means what we should do about it.' },
  { file: '02-excel-foundations.md', summary: 'Excel is a giant grid where you can do math. The most important rules: keep your data neat (one thing per column), use "Tables" to make things easier, and lock cells with a dollar sign ($) so formulas don\'t break when you copy them.' },
  { file: '03-formulas-and-functions.md', summary: 'Functions are built-in math shortcuts. IF() lets Excel make decisions (like "If sales > 100, say Good"). VLOOKUP and XLOOKUP are like a phonebook - they search for a name and bring back the matching number.' },
  { file: '04-data-cleaning-transformation.md', summary: 'Data is usually messy. We use tools like TRIM (removes extra spaces) and Power Query (an automatic cleaning machine) to fix bad data so we can actually use it without errors.' },
  { file: '05-statistics-for-analysts.md', summary: 'Statistics is just summarizing lots of numbers. Mean is the average. Median is the middle number (which is safer if you have crazy outliers). A normal distribution just means most things are average and extreme things are rare.' },
  { file: '06-pivottables.md', summary: 'PivotTables are a magical tool that groups thousands of rows into a clean summary table in two seconds. You just drag and drop what you want to see, and Excel does the math.' },
  { file: '07-data-visualisation.md', summary: 'Charts make numbers easy to see. Bar charts compare sizes. Line charts show time. Avoid pie charts because human brains are bad at judging slices. Keep it simple and remove useless ink.' },
  { file: '08-advanced-excel.md', summary: 'Dynamic arrays let one formula spill out multiple answers automatically. What-If analysis lets you guess the future ("What if we raise prices by $5?").' },
  { file: '09-intro-to-power-bi.md', summary: 'Power BI is like Excel on steroids. Instead of one giant messy sheet, we use a "Star Schema" - one central table for events (Sales) surrounded by smaller tables for details (Products, Customers). It\'s much faster.' },
  { file: '10-dax.md', summary: 'DAX is the formula language for Power BI. The most important formula is CALCULATE, which is like saying "Do this math, but only for these specific rules (like only for the year 2023)."' },
  { file: '11-power-bi-reports-dashboards.md', summary: 'A dashboard is a collection of charts that tell a story. Good dashboards let users click on things (like a specific year) and everything else automatically updates to show just that data.' },
  { file: '12-capstone-and-foundations.md', summary: 'You are now an analyst! SQL is for pulling data directly from databases, and Python is for writing code to do math. These are the next steps in your journey.' }
];

let updated = 0;

chapters.forEach(ch => {
  const fp = path.join(dir, ch.file);
  if (fs.existsSync(fp)) {
    let content = fs.readFileSync(fp, 'utf8');
    
    // Skip if already added
    if (content.includes('## In Simple Terms (TL;DR)')) return;

    const summaryBlock = `\n\n## In Simple Terms (TL;DR)\n\n> **ELI5 (Explain Like I'm 5):**\n> ${ch.summary}\n\n`;
    
    if (content.includes('## Practice Exercises')) {
      content = content.replace('## Practice Exercises', summaryBlock + '## Practice Exercises');
    } else {
      content += summaryBlock;
    }
    
    fs.writeFileSync(fp, content, 'utf8');
    updated++;
  }
});

console.log(`Added summaries to ${updated} files.`);
