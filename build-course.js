// build-course.js — Run with: node build-course.js
// Generates an Ultra-Modern Retro SPA with Dark Mode, Doodles, Full-Stack Auth, RLS, and Flashcards

const fs = require('fs');
const path = require('path');

const dir = __dirname;

const chapters = [
  { id:'ch00', num:'Welcome', title:'Course Overview', desc:'The complete data analytics toolkit covering Excel, Statistics, Power BI, and the mindset required to drive real business decisions.', file:'00-course-overview.md' },
  { id:'ch01', num:'Chapter 1', title:'What Is Data Analytics?', desc:'Understand the mindset of an analyst and the difference between descriptive, diagnostic, predictive, and prescriptive analytics.', file:'01-what-is-data-analytics.md' },
  { id:'ch02', num:'Chapter 2', title:'Excel Foundations', desc:'Master structured data, absolute references, and keyboard shortcuts.', file:'02-excel-foundations.md' },
  { id:'ch03', num:'Chapter 3', title:'Formulas & Functions', desc:'A deep dive into logic, lookups, text manipulation, and math functions.', file:'03-formulas-and-functions.md' },
  { id:'ch04', num:'Chapter 4', title:'Data Cleaning & Transformation', desc:'Fixing dirty data using text functions and an introduction to Power Query.', file:'04-data-cleaning-transformation.md' },
  { id:'ch05', num:'Chapter 5', title:'Statistics for Analysts', desc:'Descriptive stats, distributions, and hypothesis testing.', file:'05-statistics-for-analysts.md' },
  { id:'ch06', num:'Chapter 6', title:'PivotTables', desc:'The engine of rapid analysis. Master the pivot mental model.', file:'06-pivottables.md' },
  { id:'ch07', num:'Chapter 7', title:'Data Visualisation', desc:'Learn the Data-Ink ratio and how to choose the right chart.', file:'07-data-visualisation.md' },
  { id:'ch08', num:'Chapter 8', title:'Advanced Excel', desc:'Dynamic arrays, folder combines, and What-If analysis.', file:'08-advanced-excel.md' },
  { id:'ch09', num:'Chapter 9', title:'Intro to Power BI', desc:'Transitioning from spreadsheets to the Star Schema data model.', file:'09-intro-to-power-bi.md' },
  { id:'ch10', num:'Chapter 10', title:'DAX: The Language of Power BI', desc:'Master Filter Context, Row Context, and the CALCULATE function.', file:'10-dax.md' },
  { id:'ch11', num:'Chapter 11', title:'Reports & Dashboards', desc:'Building interactive visuals and crafting data stories.', file:'11-power-bi-reports-dashboards.md' },
  { id:'ch12', num:'Chapter 12', title:'Capstone & Foundations', desc:'Four industry projects and an intro to SQL and Python.', file:'12-capstone-and-foundations.md' }
];

// Read all markdown files
const mdData = {};
for (const ch of chapters) {
  const fp = path.join(dir, ch.file);
  if (fs.existsSync(fp)) {
    let content = fs.readFileSync(fp, 'utf8');
    
    // Parse "## Practice Exercises" section into interactive activity cards
    content = content.replace(/## Practice Exercises([\s\S]*?)($)/, function(match, p1, p2) {
      let transformed = p1.replace(/(### \w+)([\s\S]*?)(?=(###|$))/g, function(subMatch, heading, exercises) {
         let cards = exercises.replace(/\*\*(Exercise .*?)\*\*: (.*?)(?=\*\*Exercise|$)/gs, `<div class="activity-card"><div class="activity-header"><span class="activity-icon">⚡</span> $1</div><div class="activity-body">$2</div></div>`);
         return `<div class="exercise-section">${heading}\n${cards}</div>`;
      });
      return `<div class="class-activities"><h2>Practice Exercises</h2>${transformed}</div>\n` + p2;
    });

    mdData[ch.id] = content;
  } else {
    mdData[ch.id] = `# ${ch.title}\n\n_Content file not found._`;
  }
}

// Read all datasets
const datasetsDir = path.join(dir, 'datasets');
let datasetsHtml = '';
if (fs.existsSync(datasetsDir)) {
  const files = fs.readdirSync(datasetsDir).filter(f => f.endsWith('.csv'));
  datasetsHtml = `
    <div class="syllabus-section" style="margin-top: 4rem;">
      <h2 class="syllabus-title" style="background:var(--primary); color:#fff; display:inline-block; padding:0.5rem 1rem; border:var(--border-width) solid var(--border-color); box-shadow:4px 4px 0px var(--shadow-color);">Course Datasets</h2>
      <div class="syllabus-list">
  `;
  files.forEach(file => {
    datasetsHtml += `
      <div class="syllabus-item dataset-item">
        <div style="display:flex; align-items:center; gap: 1rem;">
          <div class="syl-num" style="font-size:1.5rem; background:var(--bg-card);">💾</div>
          <div class="syl-content"><h3 style="margin:0; font-family:'Space Mono', monospace; font-size:1.1rem; color:var(--text);">${file}</h3></div>
        </div>
        <a href="datasets/${file}" download class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Download</a>
      </div>
    `;
  });
  datasetsHtml += `
      </div>
    </div>
  `;
}

function escapeJS(str) {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

const dataBlock = `const chapterData = {\n${chapters.map(ch =>
  `  "${ch.id}": \`${escapeJS(mdData[ch.id])}\``
).join(',\n')}\n};`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Data Analytics Course | Full-Stack Edition</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js"><\\/script>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"><\\/script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"><\\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"><\\/script>
<style>
:root {
  /* Light Theme Palette */
  --bg: #F4F0EA;       
  --bg-card: #FFFFFF;  
  --primary: #FF4D00;  
  --secondary: #00E676; 
  --accent: #0055FF;   
  --text: #111111;     
  --border-color: #111111;
  --border-width: 3px;
  --shadow-color: #111111;
  --bg-pattern: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10c0 0 20 20 40 0s40 20 40 20M10 50c0 0 20-20 40 0s40-20 40 0M10 90c0 0 20 20 40 0s40 20 40 20' stroke='%23000' stroke-width='3' fill='none' opacity='0.05'/%3E%3C/svg%3E");
  
  --sidebar-w: 320px;
  --sidebar-collapsed-w: 80px;
  
  --font-body: 'Inter', system-ui, sans-serif;
  --font-heading: 'Space Grotesk', sans-serif;
  --font-mono: 'Space Mono', monospace;
  --trans: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] {
  /* Dark Theme Palette */
  --bg: #151515;       
  --bg-card: #222222;  
  --primary: #FF4D00;  
  --secondary: #00E676; 
  --accent: #0055FF;   
  --text: #F4F0EA;     
  --border-color: #FFFFFF;
  --shadow-color: #FFFFFF;
  --bg-pattern: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10c0 0 20 20 40 0s40 20 40 20M10 50c0 0 20-20 40 0s40-20 40 0M10 90c0 0 20 20 40 0s40 20 40 20' stroke='%23FFF' stroke-width='3' fill='none' opacity='0.05'/%3E%3C/svg%3E");
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--font-body); background-color: var(--bg); background-image: var(--bg-pattern); color: var(--text); overflow-x: hidden; line-height: 1.6; transition: background-color 0.3s ease; }

/* Brutalist Buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.8rem 2rem; border-radius: 0px; font-family: var(--font-heading); font-weight: 700; font-size: 1.1rem; text-decoration: none; cursor: pointer; transition: var(--trans); border: var(--border-width) solid var(--border-color); box-shadow: 4px 4px 0px var(--shadow-color); text-transform: uppercase; letter-spacing: 0.05em; }
.btn-primary { background: var(--primary); color: #fff; border-color: var(--border-color); }
.btn-primary:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0px var(--shadow-color); background: #E64500; }
.btn-primary:active { transform: translate(4px, 4px); box-shadow: 0px 0px 0px var(--shadow-color); }

.btn-secondary { background: var(--secondary); color: #111; border-color: var(--border-color); }
.btn-secondary:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0px var(--shadow-color); }
.btn-secondary:active { transform: translate(4px, 4px); box-shadow: 0px 0px 0px var(--shadow-color); }

/* Progress Bar Components */
.progress-container { background: var(--bg-card); padding: 0.8rem; display: flex; align-items: center; gap: 1rem; border: var(--border-width) solid var(--border-color); box-shadow: 4px 4px 0px var(--shadow-color); margin: 2rem 0; }
.progress-track { flex: 1; height: 24px; background: var(--bg); border: var(--border-width) solid var(--border-color); position: relative; }
.progress-fill { height: 100%; background: var(--secondary); width: 0%; border-right: var(--border-width) solid var(--border-color); transition: width 0.5s ease; }
.progress-text { font-family: var(--font-mono); font-weight: 700; font-size: 1.1rem; color: var(--text); min-width: 50px; text-align: right; }
.progress-label { font-family: var(--font-heading); font-weight: 800; text-transform: uppercase; font-size: 0.9rem; }

/* Views - Setup for absolute footer */
.view { display: none; opacity: 0; min-height: 100vh; flex-direction: column; }
.view.active { display: flex; opacity: 1; animation: fadeIn 0.3s ease forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Landing Page (Home View) */
.home-wrapper { width: 100%; max-width: 1100px; margin: 0 auto; padding: 4rem 5% 0; display: flex; flex-direction: column; flex: 1; }
.hero-card { background: var(--accent); color: #fff; border: var(--border-width) solid var(--border-color); padding: 5rem 4rem; text-align: left; box-shadow: 8px 8px 0px var(--shadow-color); margin-bottom: 5rem; position: relative; overflow: hidden; }
.hero-title { font-family: var(--font-heading); font-size: 4.5rem; font-weight: 800; margin-bottom: 1.5rem; letter-spacing: -0.04em; line-height: 1.05; text-shadow: 4px 4px 0px #111; color: #fff; }
.hero-desc { font-family: var(--font-mono); font-size: 1.1rem; max-width: 600px; margin-bottom: 3rem; background: var(--bg-card); color: var(--text); padding: 1rem; border: var(--border-width) solid var(--border-color); box-shadow: 4px 4px 0px var(--shadow-color); line-height: 1.5; }
.hero-badge { position: absolute; top: 2rem; right: -3rem; background: #FFD500; color: #111; font-family: var(--font-mono); font-weight: 700; padding: 0.5rem 4rem; transform: rotate(45deg); border: var(--border-width) solid var(--border-color); box-shadow: 4px 4px 0px var(--shadow-color); text-transform: uppercase; }

.syllabus-title { font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800; margin-bottom: 2rem; text-transform: uppercase; }
.syllabus-list { border: var(--border-width) solid var(--border-color); background: var(--bg-card); box-shadow: 6px 6px 0px var(--shadow-color); }
.syllabus-item { border-bottom: var(--border-width) solid var(--border-color); padding: 1.5rem 2rem; display: flex; gap: 2rem; align-items: center; cursor: pointer; transition: var(--trans); }
.syllabus-item:last-child { border-bottom: none; }
.syllabus-item:hover { background: var(--bg); }
.syl-num { font-family: var(--font-mono); font-size: 1.8rem; font-weight: 700; color: var(--text); background: var(--bg); border: var(--border-width) solid var(--border-color); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; box-shadow: 3px 3px 0px var(--shadow-color); }
.syllabus-item.completed .syl-num { background: var(--secondary); color: #111; }
.syl-content { flex: 1; }
.syl-content h3 { font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text); }
.syl-content p { font-size: 1.05rem; }

/* Course Player (Reading View) */
.main-layout { display: flex; flex: 1; }
.sidebar { width: var(--sidebar-w); background: var(--bg-card); border-right: var(--border-width) solid var(--border-color); height: 100vh; position: fixed; display: flex; flex-direction: column; transition: var(--trans); z-index: 100; }
.sidebar.collapsed { width: var(--sidebar-collapsed-w); }

.sidebar-header { padding: 1.5rem; border-bottom: var(--border-width) solid var(--border-color); display: flex; align-items: center; justify-content: space-between; background: var(--accent); color: #fff; }
.sidebar-brand { cursor: pointer; white-space: nowrap; overflow: hidden; opacity: 1; transition: opacity 0.2s; }
.sidebar-brand h2 { font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; text-shadow: 2px 2px 0px #111; }
.back-link { font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem; display: inline-block; background: var(--bg-card); color: var(--text); padding: 0.2rem 0.5rem; border: 2px solid var(--border-color); }
.sidebar.collapsed .sidebar-brand { opacity: 0; width: 0; display: none; }
.sidebar-toggle { background: var(--bg-card); border: var(--border-width) solid var(--border-color); width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--trans); color: var(--text); flex-shrink: 0; font-family: var(--font-mono); font-weight: 700; box-shadow: 2px 2px 0px var(--shadow-color); }
.sidebar-toggle:hover { transform: translate(1px, 1px); box-shadow: 1px 1px 0px var(--shadow-color); }

.sidebar-progress { padding: 1.5rem; border-bottom: var(--border-width) solid var(--border-color); white-space: nowrap; overflow: hidden; background: var(--bg); }
.sidebar.collapsed .sidebar-progress { padding: 0; height: 0; border: none; }

.sidebar-nav { flex: 1; overflow-y: auto; }
.nav-item { display: flex; align-items: center; padding: 1rem 1.5rem; color: var(--text); text-decoration: none; font-size: 1rem; font-weight: 600; border-bottom: var(--border-width) solid var(--border-color); transition: var(--trans); cursor: pointer; white-space: nowrap; font-family: var(--font-heading); }
.nav-item:hover { background: var(--bg); padding-left: 2rem; }
.nav-item.active { background: var(--primary); color: #fff; }
.nav-icon { font-family: var(--font-mono); font-weight: 700; font-size: 1.1rem; width: 30px; margin-right: 1rem; color: var(--text); }
.nav-item.active .nav-icon { color: #fff; }
.nav-item.completed .nav-icon { color: var(--secondary); text-shadow: 1px 1px 0px #111; }
.nav-item.active.completed .nav-icon { color: #fff; text-shadow: none; }
.sidebar.collapsed .nav-item { padding: 1rem 0; justify-content: center; }
.sidebar.collapsed .nav-item .nav-text { display: none; }
.sidebar.collapsed .nav-icon { margin-right: 0; text-align: center; width: auto; }

.main-content { flex: 1; margin-left: var(--sidebar-w); display: flex; flex-direction: column; transition: var(--trans); min-height: 100vh; position: relative; }
.sidebar.collapsed ~ .main-content { margin-left: var(--sidebar-collapsed-w); }
.content-wrapper { flex: 1; padding: 4rem 5% 0; max-width: 1000px; margin: 0 auto; width: 100%; }
.article-card { background: var(--bg-card); padding: 3rem 4rem; border: var(--border-width) solid var(--border-color); box-shadow: 8px 8px 0px var(--shadow-color); margin-bottom: 4rem; }

/* Scroll & Theme FABs */
.scroll-fabs { position: fixed; bottom: 2rem; right: 2rem; display: flex; flex-direction: column; gap: 1rem; z-index: 500; }
.fab { width: 50px; height: 50px; background: #FFD500; border: var(--border-width) solid var(--border-color); box-shadow: 4px 4px 0px var(--shadow-color); color: #111; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--trans); }
.fab:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0px var(--shadow-color); background: #FFEA00; }

/* Markdown Typography */
.md h1 { font-family: var(--font-heading); font-size: 3rem; font-weight: 800; color: var(--text); margin-bottom: 2rem; line-height: 1.1; letter-spacing: -0.03em; text-transform: uppercase; }
.md h2 { font-family: var(--font-heading); font-size: 2rem; font-weight: 700; color: var(--text); margin: 4rem 0 1.5rem; padding-bottom: 0.5rem; border-bottom: var(--border-width) solid var(--border-color); display: inline-block; }
.md h3 { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; margin: 2rem 0 1rem; }
.md p { margin-bottom: 1.5rem; font-size: 1.15rem; color: var(--text); }
.md a { color: var(--accent); text-decoration: none; font-weight: 600; border-bottom: 2px solid var(--accent); transition: var(--trans); }
.md a:hover { background: var(--accent); color: #fff; }
.md strong { font-weight: 700; color: #111; background: #FFD500; padding: 0 0.2em; border: 1px solid #111; }
[data-theme="dark"] .md strong { color: #111; border-color: #fff; }
.md ul, .md ol { margin-bottom: 1.5rem; padding-left: 1.5rem; font-size: 1.15rem; }
.md li { margin-bottom: 0.5rem; }
.md hr { border: none; border-top: var(--border-width) solid var(--border-color); margin: 4rem 0; }

/* Code & Tables */
.md pre { background: var(--bg); border: var(--border-width) solid var(--border-color); box-shadow: 6px 6px 0px var(--primary); padding: 1.5rem; overflow-x: auto; margin: 2.5rem 0; }
.md pre code { font-family: var(--font-mono); font-size: 1rem; color: var(--text); }
.md code { font-family: var(--font-mono); font-size: 0.95em; background: var(--bg); border: 2px solid var(--border-color); padding: 0.2em 0.4em; color: var(--text); font-weight: 700; }
.md table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 3rem 0; font-size: 1.05rem; border: var(--border-width) solid var(--border-color); box-shadow: 6px 6px 0px var(--shadow-color); background: var(--bg-card); }
.md th { background: var(--accent); padding: 1rem; text-align: left; font-weight: 700; color: #fff; border-bottom: var(--border-width) solid var(--border-color); border-right: var(--border-width) solid var(--border-color); font-family: var(--font-heading); text-transform: uppercase; }
.md th:last-child { border-right: none; }
.md td { padding: 1rem; border-bottom: var(--border-width) solid var(--border-color); border-right: var(--border-width) solid var(--border-color); }
.md tr:last-child td { border-bottom: none; }
.md td:last-child { border-right: none; }

/* Blockquotes */
.md blockquote { border: var(--border-width) solid var(--border-color); box-shadow: 4px 4px 0px var(--accent); padding: 1.5rem; margin: 3rem 0; background: var(--bg-card); font-size: 1.2rem; font-weight: 500; font-style: italic; position: relative; }
.md blockquote::before { content: '"'; font-family: var(--font-heading); font-size: 4rem; color: var(--accent); position: absolute; top: -1rem; left: 1rem; line-height: 1; }

/* ELI5 Summary Specific styling */
.md blockquote strong { background: transparent; border: none; padding: 0; color: var(--primary); }

/* Images and Mermaid */
.md img { max-width: 100%; border: var(--border-width) solid var(--border-color); margin: 3rem 0; box-shadow: 8px 8px 0px var(--shadow-color); display: block; background: var(--bg-card); }
.mermaid { text-align: center; margin: 3rem 0; background: var(--bg-card); border: var(--border-width) solid var(--border-color); box-shadow: 8px 8px 0px var(--shadow-color); padding: 2rem; }

/* Class Activities */
.class-activities { margin-top: 5rem; padding-top: 3rem; border-top: var(--border-width) dashed var(--border-color); }
.class-activities h2 { border: none; background: #FFD500; color: #111; padding: 0.5rem 1rem; display: inline-block; border: var(--border-width) solid var(--border-color); box-shadow: 4px 4px 0px var(--shadow-color); }
[data-theme="dark"] .class-activities h2 { border-color: #fff; box-shadow: 4px 4px 0px #fff; }
.exercise-section h3 { font-family: var(--font-mono); font-size: 1.2rem; text-transform: uppercase; margin-bottom: 1.5rem; color: var(--primary); }
.activity-card { background: var(--bg); border: var(--border-width) solid var(--border-color); box-shadow: 4px 4px 0px var(--shadow-color); padding: 2rem; margin-bottom: 1.5rem; }
.activity-header { font-family: var(--font-heading); font-weight: 800; margin-bottom: 1rem; display: flex; align-items: center; font-size: 1.3rem; text-transform: uppercase; border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem; }
.activity-icon { margin-right: 0.5rem; font-size: 1.5rem; }
.activity-body { font-size: 1.1rem; }

/* Chapter Footer */
.chapter-footer { margin-top: 5rem; padding-top: 3rem; border-top: var(--border-width) solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }

/* Global Footer */
.global-footer { margin-top: auto; text-align: center; padding: 4rem 5%; color: var(--text); border-top: var(--border-width) solid var(--border-color); background: var(--bg-card); font-family: var(--font-mono); font-weight: 700; text-transform: uppercase; font-size: 0.9rem; }

/* Mobile Menu Button */
.mobile-menu-btn { display: none; background: #FFD500; color: #111; border: var(--border-width) solid var(--border-color); box-shadow: 4px 4px 0px var(--shadow-color); padding: 0.8rem 1rem; position: fixed; top: 1rem; left: 1rem; z-index: 200; cursor: pointer; font-family: var(--font-heading); font-weight: 700; text-transform: uppercase; }

/* Mobile Adaptations */
@media (max-width: 900px) {
  .hero-title { font-size: 3rem; }
  .sidebar { transform: translateX(-100%); width: 280px; box-shadow: 10px 0px 0px rgba(17,17,17,0.2); }
  .sidebar.open { transform: translateX(0); }
  .main-content { margin-left: 0; padding-top: 6rem; }
  .sidebar.collapsed ~ .main-content { margin-left: 0; }
  .content-wrapper { padding: 0 5%; }
  .article-card { padding: 2rem; }
  .mobile-menu-btn { display: block; }
  .scroll-fabs { bottom: 1rem; right: 1rem; gap: 0.5rem; }
  .fab { width: 40px; height: 40px; font-size: 1.2rem; }
  .chapter-footer { flex-direction: column; gap: 1rem; }
}

/* Auth Modal */
.auth-input { width: 100%; padding: 0.8rem; margin-bottom: 1rem; border: var(--border-width) solid var(--border-color); font-family: var(--font-mono); font-size: 1rem; background: var(--bg); color: var(--text); }
</style>
</head>
<body>

<!-- Top Navigation -->
<div style="position:absolute; top:1rem; right:2rem; z-index: 300; display:flex; align-items:center; gap: 1rem;">
  <span style="font-family:var(--font-mono); font-size:0.8rem; font-weight:700; color:var(--text); text-transform:uppercase; display:none;" id="optional-login-text">Login to save progress ➔</span>
  <button class="btn btn-secondary" id="auth-ui-btn" onclick="document.getElementById('auth-modal').style.display='flex'" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Login / Sync</button>
</div>

<!-- Landing Page (Home View) -->
<div id="home-view" class="view active">
  <div class="home-wrapper">
    <div class="hero-card">
      <div class="hero-badge">Full Stack</div>
      <h1 class="hero-title">WELCOME TO<br/>DATA ANALYTICS</h1>
      <p class="hero-desc">Master the core tools of data analysis—from Excel foundations to advanced Power BI dashboards. <strong>No account required to learn!</strong> You can read the entire course for free. (Optional: Log in to save your progress to the cloud and generate completion flashcards).</p>
      
      <div class="progress-container" id="home-progress-container" style="display:none;">
        <span class="progress-label">Progress</span>
        <div class="progress-track">
          <div class="progress-fill" id="home-progress-fill"></div>
        </div>
        <span class="progress-text" id="home-progress-text">0%</span>
      </div>

      <div style="display:flex; gap:1rem; flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="openChapter(1)" id="hero-btn" style="font-size: 1.3rem; padding: 1.2rem 3rem;">Start Learning</button>
        <button class="btn btn-secondary" onclick="generateFlashcard()" style="font-size: 1.3rem; padding: 1.2rem 3rem;">Share Progress 📸</button>
      </div>
    </div>

    <div class="syllabus-section">
      <h2 class="syllabus-title"><span style="background:var(--secondary); color:#111; padding:0 0.5rem; border:3px solid var(--border-color);">Course</span> Syllabus</h2>
      <div class="syllabus-list" id="syllabus-list">
        <!-- Generated by JS -->
      </div>
    </div>

    ${datasetsHtml}

  </div>
  
  <footer class="global-footer">
    <p>&copy; 2026 Data Analytics Course. Built by Humans.</p>
  </footer>
</div>

<!-- Course Player (Reading View) -->
<div id="reading-view" class="view">
  <div class="main-layout">
    <button class="mobile-menu-btn" onclick="toggleMobileSidebar()">☰ Menu</button>
    
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-brand" onclick="goHome()">
          <div class="back-link">← GO BACK</div>
          <h2>ANALYTICS</h2>
        </div>
        <button class="sidebar-toggle" onclick="toggleSidebarCollapse()" id="sidebar-toggle-btn">❮</button>
      </div>
      
      <div class="sidebar-progress">
        <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem; font-family:var(--font-mono); font-weight:700; text-transform:uppercase;">
          <span style="font-size:0.8rem;">Completion</span>
          <span style="font-size:0.9rem; color:var(--primary);" id="side-progress-text">0%</span>
        </div>
        <div class="progress-track" style="height:12px;">
          <div class="progress-fill" id="side-progress-fill"></div>
        </div>
      </div>

      <nav class="sidebar-nav" id="sidebar-nav">
        <!-- Generated by JS -->
      </nav>
    </aside>

    <main class="main-content" id="main-content">
      <div class="content-wrapper">
        <div class="article-card">
          <div id="content" class="md"></div>
          <div class="chapter-footer" id="chapter-footer">
            <!-- Next button injected here -->
          </div>
        </div>
      </div>
      
      <footer class="global-footer">
        <p>&copy; 2026 Built by Humans.</p>
      </footer>
      
      <!-- Floating Action Buttons -->
      <div class="scroll-fabs">
        <button class="fab" id="theme-toggle" onclick="toggleTheme()" title="Toggle Theme">🌙</button>
        <button class="fab" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="Scroll to Top">⬆</button>
        <button class="fab" onclick="window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})" title="Scroll to Bottom">⬇</button>
      </div>
    </main>
  </div>
</div>

<!-- Auth Modal -->
<div id="auth-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center;">
  <div class="article-card" style="width:400px; max-width:90%; margin:0; padding:2rem;">
    <h2 style="font-family:var(--font-heading); margin-bottom:1.5rem; text-transform:uppercase; color:var(--text);">Account</h2>
    <input type="email" id="auth-email" class="auth-input" placeholder="Email Address"/>
    <input type="password" id="auth-pass" class="auth-input" placeholder="Password"/>
    <button class="btn btn-primary" onclick="handleAuth('login')" style="width:100%; margin-bottom:1rem;">Login</button>
    <button class="btn btn-secondary" onclick="handleAuth('signup')" style="width:100%;">Sign Up</button>
    <div style="text-align:center; margin-top:1.5rem;">
      <button onclick="document.getElementById('auth-modal').style.display='none'" style="background:none; border:none; text-decoration:underline; cursor:pointer; font-family:var(--font-mono); color:var(--text); font-weight:700;">Cancel</button>
    </div>
    <p id="auth-error" style="color:#FF4D00; margin-top:1rem; font-family:var(--font-mono); font-size:0.9rem; font-weight:700; text-align:center;"></p>
  </div>
</div>

<!-- Hidden Flashcard element for html2canvas -->
<div id="flashcard" style="position:fixed; top:-9999px; left:-9999px; width:600px; height:315px; background:var(--bg); border:8px solid var(--border-color); box-shadow:12px 12px 0px var(--shadow-color); display:flex; flex-direction:column; justify-content:center; align-items:center; padding:2rem; font-family:'Space Grotesk', sans-serif;">
  <div style="position:absolute; top:1rem; left:1rem; font-family:'Space Mono', monospace; font-weight:700; font-size:0.8rem; border:2px solid #111; padding:0.2rem 0.5rem; background:#FFD500; color:#111;">VERIFIED PROGRESS</div>
  <h1 style="font-size:3rem; text-transform:uppercase; margin-bottom:1.5rem; color:var(--text); text-shadow:3px 3px 0px var(--shadow-color);">DATA ANALYTICS</h1>
  <div style="background:var(--primary); color:#fff; padding:0.5rem 1.5rem; border:4px solid var(--border-color); box-shadow:4px 4px 0px var(--shadow-color); font-size:1.4rem; font-weight:800; margin-bottom:1.5rem;" id="flashcard-chapter">Course In Progress</div>
  <p style="font-family:'Space Mono', monospace; font-size:1.3rem; font-weight:700; color:var(--text);">Current Completion: <span style="color:var(--secondary); background:#111; padding:0.2rem 0.5rem; margin-left:0.5rem;" id="flashcard-pct">0%</span></p>
</div>

<script>
window.onerror = function(msg, url, line) { alert("Global Error: " + msg + "\\nAt line: " + line); };

${dataBlock}
const chapters = ${JSON.stringify(chapters)};

// ----------------------------------------------------
// SUPABASE INTEGRATION (Graceful Fallback)
// ----------------------------------------------------
const supabaseUrl = 'https://dpvibjgwstolrkjbznxm.supabase.co';
const supabaseKey = 'sb_publishable_3QhJaZ5USUIqwoD0acyQIw_mmqMc1ON';
let supabase = null;
let currentUser = null;

try {
  if (window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        currentUser = session.user;
        document.getElementById('auth-modal').style.display = 'none';
        document.getElementById('auth-error').innerText = '';
        syncProgressFromDb();
      } else {
        currentUser = null;
      }
      updateAuthUI();
    });
  } else {
    console.warn("Supabase library not loaded. Falling back to local storage only.");
  }
} catch (e) {
  console.error("Failed to initialize Supabase:", e);
}

async function handleAuth(action) {
  if (!supabase) {
    alert("Authentication is currently unavailable. Please check your adblocker or internet connection.");
    return;
  }
  const email = document.getElementById('auth-email').value;
  const pass = document.getElementById('auth-pass').value;
  const errEl = document.getElementById('auth-error');
  errEl.innerText = 'Loading...';
  
  let res;
  if (action === 'signup') {
    res = await supabase.auth.signUp({ email, password: pass });
    if(!res.error) errEl.innerText = "Check your email for the confirmation link! (If email confirmations are off, you can just login now).";
  } else {
    res = await supabase.auth.signInWithPassword({ email, password: pass });
  }
  
  if (res.error) {
    errEl.innerText = res.error.message;
  }
}

function updateAuthUI() {
  const authBtn = document.getElementById('auth-ui-btn');
  const optText = document.getElementById('optional-login-text');
  if(authBtn) {
    if (currentUser) {
      authBtn.innerText = 'Logout';
      authBtn.onclick = () => { if(supabase) supabase.auth.signOut(); };
      if(optText) optText.style.display = 'none';
    } else {
      authBtn.innerText = 'Login / Sync';
      authBtn.onclick = () => document.getElementById('auth-modal').style.display = 'flex';
      if(optText) optText.style.display = 'inline-block';
    }
  }
}

async function syncProgressFromDb() {
  if (!currentUser || !supabase) return;
  const { data, error } = await supabase.from('user_progress').select('completed_chapters').eq('user_id', currentUser.id).single();
  if (data && data.completed_chapters && data.completed_chapters.length > 0) {
    completedChapters = [...new Set([...completedChapters, ...data.completed_chapters])];
    localStorage.setItem('da_completed_chapters', JSON.stringify(completedChapters));
    updateProgressUI();
    renderNavigation();
  }
}

async function syncProgressToDb() {
  if (!currentUser || !supabase) return;
  const { error } = await supabase.from('user_progress').upsert({
    user_id: currentUser.id,
    completed_chapters: completedChapters
  });
  if(error) console.error("Error syncing to DB:", error);
}

// ----------------------------------------------------
// FLASHCARD GENERATOR
// ----------------------------------------------------
async function generateFlashcard() {
  // Update flashcard data
  const pct = document.getElementById('home-progress-text').innerText;
  document.getElementById('flashcard-pct').innerText = pct;
  
  let lastCh = 0;
  if (completedChapters.length > 0) {
    lastCh = Math.max(...completedChapters);
  }
  
  let badgeText = lastCh > 0 ? \`Completed: \${chapters[lastCh].title}\` : 'Just Started';
  if (completedChapters.length === chapters.length - 1) {
    badgeText = "Course Fully Completed! 🎉";
  }
  document.getElementById('flashcard-chapter').innerText = badgeText;

  // Render to canvas
  const element = document.getElementById('flashcard');
  element.style.top = '50%';
  element.style.left = '50%';
  element.style.transform = 'translate(-50%, -50%)';
  element.style.zIndex = '99999';
  
  try {
    const canvas = await html2canvas(element, { backgroundColor: null, scale: 2 });
    const link = document.createElement('a');
    link.download = 'data-analytics-accomplishment.png';
    link.href = canvas.toDataURL();
    link.click();
  } catch(e) {
    console.error("Failed to generate flashcard", e);
    alert("Sorry, could not generate the flashcard image.");
  }
  
  element.style.top = '-9999px';
  element.style.left = '-9999px';
  element.style.transform = 'none';
}

// ----------------------------------------------------
// GAMIFICATION STATE
// ----------------------------------------------------
let completedChapters = [];
try {
  completedChapters = JSON.parse(localStorage.getItem('da_completed_chapters') || '[]');
} catch(e) {
  console.warn("localStorage blocked", e);
}

function saveProgress() {
  try {
    localStorage.setItem('da_completed_chapters', JSON.stringify(completedChapters));
  } catch(e) {}
  updateProgressUI();
}

function markCompleted(idx) {
  if (!completedChapters.includes(idx) && idx !== 0) {
    completedChapters.push(idx);
    saveProgress();
    syncProgressToDb();
  }
}

// Theme State
let isDark = false;
try {
  isDark = localStorage.getItem('da_theme') === 'dark';
} catch(e) {}

function applyTheme(dark) {
  if(dark) {
    document.body.setAttribute('data-theme', 'dark');
    document.getElementById('theme-toggle').innerText = '🌞';
  } else {
    document.body.removeAttribute('data-theme');
    document.getElementById('theme-toggle').innerText = '🌙';
  }
}
function toggleTheme() {
  isDark = !isDark;
  try { localStorage.setItem('da_theme', isDark ? 'dark' : 'light'); } catch(e) {}
  applyTheme(isDark);
}
applyTheme(isDark); // Apply on boot

// Setup Marked safely
try {
  if (typeof marked !== 'undefined') {
    marked.setOptions({ gfm: true, breaks: false });
    const renderer = new marked.Renderer();
    renderer.heading = function(text, level) {
      let c = typeof text === 'object' ? (text.text||'') : text;
      let l = typeof text === 'object' ? (text.depth||2) : level;
      return '<h'+l+'>'+c+'</h'+l+'>';
    };
    renderer.code = function(code, language) {
      if (language === 'mermaid') {
        return '<div class="mermaid">' + code + '</div>';
      }
      return '<pre><code class="language-' + language + '">' + code + '</code></pre>';
    };
    marked.use({ renderer });
  } else {
    console.error("Marked.js failed to load from CDN.");
  }
} catch (e) {
  console.error("Error setting up marked:", e);
}

// Render Syllabus and Sidebar Nav
const syllabusListEl = document.getElementById('syllabus-list');
const sidebarNavEl = document.getElementById('sidebar-nav');

function renderNavigation() {
  if(!syllabusListEl) return;
  syllabusListEl.innerHTML = '';
  sidebarNavEl.innerHTML = '';
  
  chapters.forEach((ch, idx) => {
    // Home Syllabus List (Show all chapters including Welcome)
    const isCompleted = completedChapters.includes(idx);
    const item = document.createElement('div');
    item.className = 'syllabus-item' + (isCompleted ? ' completed' : '');
    item.onclick = () => openChapter(idx);
    item.innerHTML = \`
      <div class="syl-num">\${isCompleted ? '✓' : (idx === 0 ? '★' : idx)}</div>
      <div class="syl-content">
        <h3>\${ch.title}</h3>
        <p>\${ch.desc}</p>
      </div>
      <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">READ</button>
    \`;
    syllabusListEl.appendChild(item);

    // Sidebar Nav
    const navItem = document.createElement('a');
    navItem.className = 'nav-item' + (completedChapters.includes(idx) ? ' completed' : '');
    navItem.id = 'nav-item-' + idx;
    navItem.onclick = () => openChapter(idx);
    navItem.innerHTML = \`
      <div class="nav-icon">\${idx === 0 ? '🏠' : (idx < 10 ? '0'+idx : idx)}</div>
      <span class="nav-text">\${ch.title}</span>
    \`;
    if(completedChapters.includes(idx)) {
      navItem.innerHTML = \`<div class="nav-icon">✓✓</div><span class="nav-text">\${ch.title}</span>\`;
    }
    sidebarNavEl.appendChild(navItem);
  });
}

function updateProgressUI() {
  const total = chapters.length - 1; // excluding welcome
  const count = completedChapters.length;
  const pct = Math.round((count / total) * 100);
  
  const homeProgCont = document.getElementById('home-progress-container');
  if(homeProgCont) {
    if(count > 0) homeProgCont.style.display = 'flex';
    document.getElementById('home-progress-fill').style.width = pct + '%';
    document.getElementById('home-progress-text').innerText = pct + '%';
  }
  
  const sideFill = document.getElementById('side-progress-fill');
  if(sideFill) {
    sideFill.style.width = pct + '%';
    document.getElementById('side-progress-text').innerText = pct + '%';
  }
  
  // Update Hero Button
  const heroBtn = document.getElementById('hero-btn');
  if(heroBtn) {
    if (count === 0) heroBtn.innerText = "START COURSE ➔";
    else if (count === total) heroBtn.innerText = "REVIEW COURSE ➔";
    else heroBtn.innerText = "RESUME COURSE ➔";
  }
}

// Navigation Logic
function openChapter(idx) {
  const ch = chapters[idx];
  
  // Render content
  let rawMd = chapterData[ch.id] || '_Content not found_';
  document.getElementById('content').innerHTML = marked.parse(rawMd);
  
  // Render Footer Button
  const footer = document.getElementById('chapter-footer');
  if (idx < chapters.length - 1) {
    footer.innerHTML = \`
      <button class="btn btn-primary" onclick="markCompleted(\${idx}); openChapter(\${idx + 1});">MARK COMPLETE & CONTINUE ➔</button>
      <button class="btn btn-secondary" onclick="generateFlashcard()">Share Progress 📸</button>
    \`;
  } else if (idx !== 0) {
    footer.innerHTML = \`
      <button class="btn btn-primary" onclick="markCompleted(\${idx}); goHome();">COMPLETE COURSE 🎉</button>
      <button class="btn btn-secondary" onclick="generateFlashcard()">Share Progress 📸</button>
    \`;
  } else {
    footer.innerHTML = \`\`;
  }
  
  // Update UI State
  renderNavigation();
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById('nav-item-' + idx).classList.add('active');
  
  // Switch Views
  document.getElementById('home-view').classList.remove('active');
  document.getElementById('reading-view').classList.add('active');
  window.scrollTo(0,0);
  
  // Close mobile sidebar if open
  document.getElementById('sidebar').classList.remove('open');
  
  // Render Mermaid diagrams with neutral theme
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
    mermaid.run({ querySelector: '.mermaid' });
  }
}

function goHome() {
  document.getElementById('reading-view').classList.remove('active');
  document.getElementById('home-view').classList.add('active');
  renderNavigation(); // Refresh checkmarks
  window.scrollTo(0,0);
}

// Sidebar Toggles
function toggleSidebarCollapse() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
  const btn = document.getElementById('sidebar-toggle-btn');
  if (sidebar.classList.contains('collapsed')) {
    btn.innerText = '❯';
  } else {
    btn.innerText = '❮';
  }
}

function toggleMobileSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// Boot
renderNavigation();
updateProgressUI();
<\\/script>
</body>
</html>`;

const finalHtml = html.split('<\\/script>').join('</script>');
fs.writeFileSync(path.join(dir, 'index.html'), finalHtml, 'utf8');
console.log('Built Full-Stack SPA index.html with Supabase Auth and Flashcards successfully!');
