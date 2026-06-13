// generate_datasets.js — Run with: node generate_datasets.js
// Generates all course datasets as CSV files
// No external dependencies required

const fs = require('fs');
const path = require('path');

const dir = __dirname;

// ===== Seeded PRNG (Mulberry32) =====
function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);

function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function randFloat(min, max, decimals = 2) { return parseFloat((rand() * (max - min) + min).toFixed(decimals)); }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function toCSV(headers, rows) {
  const escape = v => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  return [headers.map(escape).join(','), ...rows.map(r => r.map(escape).join(','))].join('\n');
}

function dateStr(d) { return d.toISOString().split('T')[0]; }

function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

// ===== Reference Data =====

const firstNames = ['Maria','John','Amara','Chen','Fatima','James','Yuki','Carlos','Priya','Ahmed','Sarah','Oluwaseun','Hans','Mei','David','Aisha','Roberto','Ingrid','Kenji','Lucia','Omar','Emma','Kwame','Sven','Nadia','Marcus','Isabella','Raj','Sophie','Emeka','Liam','Chioma','Henrik','Yuna','Diego','Zara','Patrick','Anya','Takeshi','Elena','Abdul','Freya','Kofi','Marta','Hiroshi','Celine','Tariq','Astrid','Juan','Sakura','Viktor','Nina','Bayo','Lars','Diya','Felix','Rosa','Jide','Katya','Tomoko','Andre','Leah','Obinna','Elise','Ryu','Carmen','Hassan','Greta','Paolo','Mina','Chidi','Signe','Akiko','Luis','Petra','Tunde','Ayumi','Rafael','Olga','Koji','Ana','Idris','Hanna','Shin','Gloria','Femi','Lina','Tadashi','Vera','Segun','Birgit','Haruto','Julia','Ade','Margot','Daichi','Eva','Kola','Elin'];
const lastNames = ['Schmidt','Okafor','Wei','Al-Rashid','Nakamura','Fernandez','Sharma','Johansson','Okonkwo','Mueller','Tanaka','Santos','Petrov','Kim','Anderson','Adeyemi','Berg','Hayashi','Rodriguez','Patel','Jensen','Yamamoto','Costa','Ibrahim','Larsson','Suzuki','Martinez','Khan','Eriksson','Sato','Oliveira','Hassan','Lindgren','Watanabe','Garcia','Nwosu','Holm','Ito','Perez','Choudhury','Andersen','Kobayashi','Silva','Ali','Nilsson','Kato','Lopez','Osei','Gustafsson','Takahashi'];

const countries = {
  'North America': [{ c: 'United States', cities: ['New York','Los Angeles','Chicago','Houston','Phoenix'] }, { c: 'Canada', cities: ['Toronto','Vancouver','Montreal'] }, { c: 'Mexico', cities: ['Mexico City','Guadalajara'] }],
  'Europe': [{ c: 'Germany', cities: ['Munich','Berlin','Hamburg'] }, { c: 'United Kingdom', cities: ['London','Manchester','Edinburgh'] }, { c: 'France', cities: ['Paris','Lyon','Marseille'] }, { c: 'Netherlands', cities: ['Amsterdam','Rotterdam'] }],
  'Asia Pacific': [{ c: 'Japan', cities: ['Tokyo','Osaka','Yokohama'] }, { c: 'India', cities: ['Mumbai','Delhi','Bangalore'] }, { c: 'South Korea', cities: ['Seoul','Busan'] }, { c: 'Australia', cities: ['Sydney','Melbourne'] }],
  'Middle East & Africa': [{ c: 'Nigeria', cities: ['Lagos','Abuja','Port Harcourt'] }, { c: 'UAE', cities: ['Dubai','Abu Dhabi'] }, { c: 'South Africa', cities: ['Johannesburg','Cape Town'] }, { c: 'Kenya', cities: ['Nairobi','Mombasa'] }],
  'Latin America': [{ c: 'Brazil', cities: ['Sao Paulo','Rio de Janeiro'] }, { c: 'Colombia', cities: ['Bogota','Medellin'] }, { c: 'Argentina', cities: ['Buenos Aires','Cordoba'] }]
};

const regionWeights = [
  { r: 'North America', w: 0.40 },
  { r: 'Europe', w: 0.25 },
  { r: 'Asia Pacific', w: 0.15 },
  { r: 'Middle East & Africa', w: 0.10 },
  { r: 'Latin America', w: 0.10 }
];

function pickWeighted(items) {
  const r = rand();
  let cum = 0;
  for (const item of items) { cum += item.w; if (r < cum) return item; }
  return items[items.length - 1];
}

function pickRegionCountryCity() {
  const region = pickWeighted(regionWeights).r;
  const countryData = pick(countries[region]);
  return { region, country: countryData.c, city: pick(countryData.cities) };
}

const segments = ['Consumer', 'Corporate', 'Home Office'];
const shipModes = ['Standard Class', 'Second Class', 'First Class', 'Same Day'];
const shipModeDays = { 'Standard Class': [5, 7], 'Second Class': [3, 5], 'First Class': [1, 3], 'Same Day': [0, 0] };

const products = {
  'Technology': {
    'Phones': ['Samsung Galaxy S24', 'iPhone 15 Pro', 'Google Pixel 8', 'OnePlus 12', 'Xiaomi 14'],
    'Laptops': ['Dell XPS 15', 'MacBook Air M3', 'Lenovo ThinkPad X1', 'HP Spectre x360', 'ASUS ZenBook 14'],
    'Tablets': ['iPad Air', 'Samsung Galaxy Tab S9', 'Microsoft Surface Go'],
    'Accessories': ['Logitech MX Master 3S', 'Apple AirPods Pro', 'Anker USB-C Hub', 'Samsung T7 SSD', 'Keychron K2 Keyboard']
  },
  'Furniture': {
    'Chairs': ['Herman Miller Aeron', 'Steelcase Leap V2', 'Autonomous ErgoChair', 'IKEA Markus'],
    'Desks': ['Uplift V2 Standing Desk', 'IKEA Bekant', 'Flexispot E7', 'Autonomous SmartDesk'],
    'Bookcases': ['IKEA Billy', 'Sauder Heritage Hill', 'Bush Furniture Cabot'],
    'Tables': ['IKEA Lisabo Dining Table', 'West Elm Box Frame Table', 'Article Seno Table']
  },
  'Office Supplies': {
    'Binders': ['Avery Heavy Duty Binder 3"', 'Wilson Jones Binder 1"', 'Staples Better Binder 2"'],
    'Paper': ['HP Premium Paper A4', 'Hammermill Copy Plus', 'Xerox Multipurpose Paper'],
    'Pens': ['Pilot G2 Gel Pen (12pk)', 'Sharpie Permanent Markers (8pk)', 'Paper Mate Flair (6pk)'],
    'Storage': ['Bankers Box File Storage', 'Fellowes File Organiser', 'Staples Hanging Folders (25pk)'],
    'Envelopes': ['Quality Park #10 Envelopes (500pk)', 'JAM Paper A7 Invitation Envelopes'],
    'Art Supplies': ['Prismacolor Premier Pencils (24)', 'Crayola Markers (64pk)', 'Faber-Castell Pitt Pens (8pk)'],
    'Labels': ['Avery Address Labels (750)', 'DYMO LabelWriter Labels', 'Brother P-Touch Labels'],
    'Fasteners': ['Swingline Stapler', 'Bostitch Paper Clips (1000)', 'ACCO Binder Clips Assorted']
  }
};

// Build flat product list with pricing
const productList = [];
let prodId = 1;
for (const cat of Object.keys(products)) {
  for (const sub of Object.keys(products[cat])) {
    for (const name of products[cat][sub]) {
      let basePrice;
      if (cat === 'Technology') basePrice = randFloat(80, 2500);
      else if (cat === 'Furniture') basePrice = randFloat(50, 1800);
      else basePrice = randFloat(3, 120);
      
      const cost = parseFloat((basePrice * randFloat(0.45, 0.75)).toFixed(2));
      productList.push({
        id: `PROD-${String(prodId).padStart(3, '0')}`,
        name, category: cat, subCategory: sub,
        listPrice: basePrice, unitCost: cost
      });
      prodId++;
    }
  }
}

// ===== Generate Customers =====
const customerList = [];
for (let i = 1; i <= 200; i++) {
  const loc = pickRegionCountryCity();
  customerList.push({
    id: `CUST-${String(i).padStart(4, '0')}`,
    name: `${pick(firstNames)} ${pick(lastNames)}`,
    segment: pick(segments),
    ...loc
  });
}

// ===== DATASET 1: Global Superstore Sales =====
console.log('Generating Dataset 1: Global Superstore Sales...');

const salesHeaders = ['Order_ID','Order_Date','Ship_Date','Ship_Mode','Customer_ID','Customer_Name','Segment','Region','Country','City','Category','Sub_Category','Product_Name','Sales','Quantity','Discount','Profit','Cost'];
const salesRows = [];

const startDate = new Date('2022-01-03');
const endDate = new Date('2024-12-28');
const dateRange = (endDate - startDate) / (1000 * 60 * 60 * 24);

for (let i = 1; i <= 1000; i++) {
  const orderDate = addDays(startDate, randInt(0, dateRange));
  const month = orderDate.getMonth();
  const shipMode = pick(shipModes);
  const [minD, maxD] = shipModeDays[shipMode];
  const shipDate = addDays(orderDate, randInt(minD, maxD));
  
  const customer = pick(customerList);
  const product = pick(productList);
  
  let quantity = randInt(1, 8);
  // Occasional large orders
  if (rand() < 0.05) quantity = randInt(9, 14);
  
  const discountOptions = [0, 0, 0, 0, 0.05, 0.10, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45];
  const discount = pick(discountOptions);
  
  let unitSale = product.listPrice * (1 - discount);
  // Q4 Technology boost
  if (product.category === 'Technology' && month >= 9) unitSale *= 1.15;
  
  const sales = parseFloat((unitSale * quantity).toFixed(2));
  const cost = parseFloat((product.unitCost * quantity).toFixed(2));
  const profit = parseFloat((sales - cost).toFixed(2));
  
  salesRows.push([
    `ORD-${String(i).padStart(4, '0')}`,
    dateStr(orderDate), dateStr(shipDate), shipMode,
    customer.id, customer.name, customer.segment,
    customer.region, customer.country, customer.city,
    product.category, product.subCategory, product.name,
    sales, quantity, discount, profit, cost
  ]);
}

fs.writeFileSync(path.join(dir, '01_global_superstore_sales.csv'), toCSV(salesHeaders, salesRows));
console.log(`  → ${salesRows.length} rows written`);


// ===== DATASET 2: Dirty Sales Data =====
console.log('Generating Dataset 2: Dirty Sales Data...');

const dirtyHeaders = ['Order_ID','Order_Date','Customer_Name','Region','City','Category','Sub_Category','Product_Name','Sales','Quantity','Discount','Profit'];
const dirtyRows = [];
const baseDirtyRows = salesRows.slice(0, 70);

for (let i = 0; i < baseDirtyRows.length; i++) {
  const src = baseDirtyRows[i];
  let orderId = src[0];
  let orderDate = src[1];
  let custName = src[5];
  let region = src[7];
  let city = src[9];
  let category = src[10];
  let subCat = src[11];
  let prodName = src[12];
  let sales = String(src[13]);
  let qty = String(src[14]);
  let discount = String(src[15]);
  let profit = String(src[16]);

  // Apply quality issues randomly
  // Leading/trailing spaces (15% chance)
  if (rand() < 0.15) custName = '  ' + custName + ' ';
  if (rand() < 0.10) city = ' ' + city;

  // Inconsistent casing (20% chance)
  if (rand() < 0.10) region = region.toLowerCase();
  else if (rand() < 0.10) region = region.toUpperCase();
  
  if (rand() < 0.10) category = category.toLowerCase();
  else if (rand() < 0.05) category = category.toUpperCase();

  // Date format inconsistency (30% chance)
  if (rand() < 0.15) {
    const d = new Date(orderDate);
    orderDate = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
  } else if (rand() < 0.15) {
    const d = new Date(orderDate);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    orderDate = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  // Numbers as text with currency symbols (20% chance)
  if (rand() < 0.20) sales = `$${parseFloat(sales).toLocaleString('en-US', {minimumFractionDigits:2})}`;
  
  // Missing values (10% chance per field)
  if (rand() < 0.08) custName = '';
  if (rand() < 0.05) region = 'N/A';
  if (rand() < 0.05) profit = '-';
  if (rand() < 0.03) profit = 'n/a';

  // Typos in categories (10% chance)
  const typos = { 'Technology': 'Technolgy', 'Furniture': 'Furntiure', 'Office Supplies': 'Offce Supplies' };
  if (rand() < 0.10 && typos[category]) category = typos[category];

  // Crammed data in name field (5% chance)
  if (rand() < 0.05 && custName && !custName.includes(',')) {
    custName = `${custName}, ${randInt(100,999)} ${pick(['Main St','Oak Ave','Park Rd','1st St'])}, ${city}`;
  }

  // Special characters in product names (5% chance)
  if (rand() < 0.05) prodName = prodName.replace(' ', ' – ');

  // Inconsistent ID formats (15% chance)
  if (rand() < 0.05) orderId = orderId.replace('ORD-', 'ORD');
  else if (rand() < 0.05) orderId = orderId.replace('ORD-', '').replace(/^0+/, '');
  else if (rand() < 0.05) orderId = orderId.toLowerCase();

  // Negative quantity (rare)
  if (rand() < 0.04) qty = `-${qty}`;

  dirtyRows.push([orderId, orderDate, custName, region, city, category, subCat, prodName, sales, qty, discount, profit]);
}

// Add 5 exact duplicates
for (let i = 0; i < 5; i++) dirtyRows.push([...dirtyRows[randInt(0, 30)]]);

// Add 3 blank rows scattered
dirtyRows.splice(randInt(10, 20), 0, Array(12).fill(''));
dirtyRows.splice(randInt(35, 45), 0, Array(12).fill(''));
dirtyRows.splice(randInt(55, 65), 0, Array(12).fill(''));

fs.writeFileSync(path.join(dir, '02_sales_dirty.csv'), toCSV(dirtyHeaders, shuffle(dirtyRows)));
console.log(`  → ${dirtyRows.length} rows written`);


// ===== DATASET 3: Employee Data =====
console.log('Generating Dataset 3: Employee Data...');

const empHeaders = ['Employee_ID','First_Name','Last_Name','Gender','Age','Department','Job_Title','Hire_Date','Salary','Bonus_Pct','Performance_Rating','Satisfaction_Score','Attrition','Years_at_Company','Manager_ID','Office_Location'];
const empRows = [];

const departments = ['Engineering','Sales','Marketing','HR','Finance','Operations','Legal','IT'];
const titles = ['Analyst','Senior Analyst','Manager','Senior Manager','Director','VP'];
const genders = ['Male','Male','Male','Female','Female','Female','Non-Binary'];
const offices = ['New York','London','Lagos','Dubai','Singapore'];

const salaryRanges = {
  'Analyst': [38000, 65000], 'Senior Analyst': [55000, 90000], 'Manager': [70000, 120000],
  'Senior Manager': [90000, 145000], 'Director': [110000, 165000], 'VP': [140000, 185000]
};

// Create management hierarchy
const managers = {};
for (const dept of departments) {
  managers[dept] = `EMP-${String(randInt(1, 20)).padStart(3, '0')}`;
}

for (let i = 1; i <= 200; i++) {
  const dept = pick(departments);
  
  // Title distribution: more juniors
  let title;
  const r = rand();
  if (r < 0.30) title = 'Analyst';
  else if (r < 0.55) title = 'Senior Analyst';
  else if (r < 0.75) title = 'Manager';
  else if (r < 0.88) title = 'Senior Manager';
  else if (r < 0.95) title = 'Director';
  else title = 'VP';

  const [minSal, maxSal] = salaryRanges[title];
  let salary = randInt(minSal, maxSal);
  // Round to nearest 1000
  salary = Math.round(salary / 1000) * 1000;

  const gender = pick(genders);
  // Embed subtle pay gap for analytical discovery
  if (gender === 'Female' && rand() < 0.4) salary = Math.round(salary * 0.94 / 1000) * 1000;

  const hireYear = randInt(2015, 2024);
  const hireMonth = randInt(1, 12);
  const hireDay = randInt(1, 28);
  const hireDate = `${hireYear}-${String(hireMonth).padStart(2, '0')}-${String(hireDay).padStart(2, '0')}`;
  
  const yearsAtCompany = 2025 - hireYear;
  const age = randInt(22, 28) + yearsAtCompany + randInt(0, 15);
  const clampedAge = Math.min(age, 62);

  const bonusPct = randFloat(0, 0.25);
  
  // Performance: roughly normal around 3
  let perf;
  const pr = rand();
  if (pr < 0.05) perf = 1;
  else if (pr < 0.20) perf = 2;
  else if (pr < 0.55) perf = 3;
  else if (pr < 0.85) perf = 4;
  else perf = 5;

  // Satisfaction correlates with performance (r ≈ 0.55)
  let satisfaction = perf + randFloat(-1.5, 1.5);
  satisfaction = Math.max(1.0, Math.min(5.0, satisfaction));
  satisfaction = parseFloat(satisfaction.toFixed(1));

  // Attrition: ~16% overall, higher for low satisfaction
  let attrition = 'No';
  if (satisfaction < 2.5 && rand() < 0.35) attrition = 'Yes';
  else if (satisfaction < 3.5 && rand() < 0.15) attrition = 'Yes';
  else if (rand() < 0.08) attrition = 'Yes';

  const managerId = i <= 8 ? '' : managers[dept];

  empRows.push([
    `EMP-${String(i).padStart(3, '0')}`,
    pick(firstNames), pick(lastNames), gender, clampedAge,
    dept, title, hireDate, salary, bonusPct, perf, satisfaction,
    attrition, yearsAtCompany, managerId, pick(offices)
  ]);
}

fs.writeFileSync(path.join(dir, '03_employee_data.csv'), toCSV(empHeaders, empRows));
console.log(`  → ${empRows.length} rows written`);


// ===== DATASET 4: Oil & Gas Production =====
console.log('Generating Dataset 4: Oil & Gas Production...');

const oilHeaders = ['Well_ID','Well_Name','Basin','Operator','Production_Date','Oil_BBL','Gas_MCF','Water_BBL','Days_Online','Status','Spud_Date','Latitude','Longitude'];
const oilRows = [];

const basins = [
  { name: 'Permian', lat: [31.5, 32.5], lon: [-102.5, -101.5] },
  { name: 'Eagle Ford', lat: [28.5, 29.5], lon: [-99.0, -97.5] },
  { name: 'Bakken', lat: [47.5, 48.5], lon: [-104.0, -103.0] },
  { name: 'DJ Basin', lat: [39.5, 40.5], lon: [-105.0, -104.0] },
  { name: 'Marcellus', lat: [40.0, 41.5], lon: [-80.0, -78.0] }
];
const operators = ['Apex Energy','Frontier Drilling','Summit Oil','Basin Resources','Prairie Petroleum'];

const wells = [];
for (let w = 1; w <= 25; w++) {
  const basin = pick(basins);
  const lat = randFloat(basin.lat[0], basin.lat[1], 4);
  const lon = randFloat(basin.lon[0], basin.lon[1], 4);
  const spudYear = randInt(2020, 2023);
  const spudDate = `${spudYear}-${String(randInt(1,12)).padStart(2,'0')}-${String(randInt(1,28)).padStart(2,'0')}`;
  const baseProd = randInt(5000, 35000); // initial oil production
  const isOutlier = w <= 3; // first 3 wells are outliers
  
  wells.push({
    id: `WELL-${String.fromCharCode(65 + Math.floor((w-1)/10))}${String((w-1)%10+1).padStart(2,'0')}`,
    name: `${basin.name} ${w}`,
    basin: basin.name,
    operator: pick(operators),
    lat, lon, spudDate, baseProd, isOutlier
  });
}

for (const well of wells) {
  // Monthly data from 2022-01 to 2024-12
  for (let y = 2022; y <= 2024; y++) {
    for (let m = 1; m <= 12; m++) {
      const monthsFromStart = (y - 2022) * 12 + (m - 1);
      const prodDate = `${y}-${String(m).padStart(2, '0')}-01`;
      
      // Decline curve: production decreases over time
      const declineFactor = Math.exp(-0.015 * monthsFromStart);
      let oil = Math.round(well.baseProd * declineFactor * randFloat(0.85, 1.15));
      let gas = Math.round(oil * randFloat(2.0, 4.0));
      let water = Math.round(oil * randFloat(0.3, 0.8));
      
      if (well.isOutlier) {
        oil = Math.round(oil * randFloat(1.5, 3.0));
        gas = Math.round(gas * 2.5);
      }

      // Seasonal maintenance (some wells shut down)
      let daysOnline = randInt(27, 31);
      let status = 'Active';
      
      if (rand() < 0.03) {
        daysOnline = 0; oil = 0; gas = 0; water = 0;
        status = 'Shut-in';
      } else if (rand() < 0.02) {
        daysOnline = randInt(5, 15);
        oil = Math.round(oil * daysOnline / 30);
        gas = Math.round(gas * daysOnline / 30);
        water = Math.round(water * daysOnline / 30);
      }

      oilRows.push([
        well.id, well.name, well.basin, well.operator,
        prodDate, oil, gas, water, daysOnline, status,
        well.spudDate, well.lat, well.lon
      ]);
    }
  }
}

fs.writeFileSync(path.join(dir, '04_oil_gas_production.csv'), toCSV(oilHeaders, oilRows));
console.log(`  → ${oilRows.length} rows written`);


// ===== DATASET 5: Marketing Campaigns =====
console.log('Generating Dataset 5: Marketing Campaigns...');

const mktHeaders = ['Campaign_ID','Campaign_Name','Channel','Start_Date','End_Date','Budget','Spend','Impressions','Clicks','Conversions','Revenue','Target_Audience','A_B_Group','Region'];
const mktRows = [];

const channels = ['Email','Social Media','Search Ads','Display Ads','Content Marketing'];
const audiences = ['18-24','25-34','35-44','45-54','55+'];
const abGroups = ['Control','Variant_A','Variant_B'];

const campaignNames = [
  'Summer Sale 2023','Black Friday Push','New Year Kickoff','Spring Collection','Back to School',
  'Holiday Special','Flash Sale Weekend','Customer Appreciation','Product Launch Alpha','Brand Awareness Q1',
  'Retargeting Wave','Loyalty Program Push','End of Season Clearance','Early Bird Deals','Mid-Year Mega Sale',
  'Valentine\'s Day Special','Mother\'s Day Campaign','Father\'s Day Promo','Independence Day Blitz','Cyber Monday Rush',
  'Winter Warmup','Fall Fashion Forward','Tech Tuesday','Wellness Wednesday','Fresh Start January',
  'Easter Special','Memorial Day Sale','Labor Day Deals','Thanksgiving Thanks','Green Monday Push'
];

// Channel performance profiles (conversion rates differ by channel)
const channelProfiles = {
  'Email': { ctr: [0.02, 0.08], cvr: [0.05, 0.12], roiMult: [3, 8] },
  'Social Media': { ctr: [0.005, 0.03], cvr: [0.02, 0.06], roiMult: [1.5, 5] },
  'Search Ads': { ctr: [0.03, 0.10], cvr: [0.08, 0.18], roiMult: [4, 12] },
  'Display Ads': { ctr: [0.001, 0.008], cvr: [0.01, 0.04], roiMult: [0.5, 3] },
  'Content Marketing': { ctr: [0.01, 0.05], cvr: [0.03, 0.08], roiMult: [2, 7] }
};

for (let i = 1; i <= 300; i++) {
  const channel = pick(channels);
  const profile = channelProfiles[channel];
  const budget = randInt(5, 500) * 100;
  const spend = Math.round(budget * randFloat(0.85, 1.08));
  const impressions = Math.round(spend * randFloat(8, 40));
  const ctr = randFloat(profile.ctr[0], profile.ctr[1], 4);
  const clicks = Math.max(Math.round(impressions * ctr), 1);
  const cvr = randFloat(profile.cvr[0], profile.cvr[1], 4);
  const conversions = Math.max(Math.round(clicks * cvr), 0);
  const roiMult = randFloat(profile.roiMult[0], profile.roiMult[1]);
  const revenue = Math.round(spend * roiMult);

  const startDate = addDays(new Date('2023-01-01'), randInt(0, 700));
  const duration = randInt(3, 45);
  const endDate = addDays(startDate, duration);

  const loc = pickRegionCountryCity();

  mktRows.push([
    `MKT-${String(i).padStart(3, '0')}`,
    pick(campaignNames),
    channel,
    dateStr(startDate), dateStr(endDate),
    budget, spend, impressions, clicks, conversions, revenue,
    pick(audiences), pick(abGroups), loc.region
  ]);
}

fs.writeFileSync(path.join(dir, '05_marketing_campaigns.csv'), toCSV(mktHeaders, mktRows));
console.log(`  → ${mktRows.length} rows written`);


// ===== DATASET 6: Financial Budget vs Actuals =====
console.log('Generating Dataset 6: Financial Budget vs Actuals...');

const finHeaders = ['Period','Department','Line_Item','Budget_Amount','Actual_Amount','Variance','Variance_Pct','Notes'];
const finRows = [];

const finDepts = ['Sales','Engineering','Marketing','Operations','G&A'];
const lineItems = ['Salaries','Software Licenses','Travel','Equipment','Utilities','Marketing Spend','Consulting','Training','Office Supplies','Insurance'];

const varianceNotes = {
  large_over: ['Unplanned server migration','Emergency contractor hire','Market expansion initiative','Regulatory compliance upgrade','Urgent equipment replacement'],
  large_under: ['Conference cancelled','Hiring freeze savings','Vendor renegotiation','Project delayed to next quarter','Travel restrictions'],
  normal: ['On track','Within tolerance','Seasonal adjustment','']
};

for (let m = 1; m <= 12; m++) {
  const period = `2024-${String(m).padStart(2, '0')}-01`;
  for (const dept of finDepts) {
    // Each department has 3-4 line items
    const deptItems = shuffle(lineItems).slice(0, randInt(3, 5));
    for (const item of deptItems) {
      let baseBudget;
      if (item === 'Salaries') baseBudget = randInt(150, 450) * 1000;
      else if (item === 'Software Licenses') baseBudget = randInt(10, 80) * 1000;
      else if (item === 'Marketing Spend') baseBudget = randInt(20, 120) * 1000;
      else baseBudget = randInt(2, 50) * 1000;

      // Q4 budget flush
      if (m >= 10) baseBudget = Math.round(baseBudget * 1.15);

      const variancePct = randFloat(-0.20, 0.25);
      const actual = Math.round(baseBudget * (1 + variancePct));
      const variance = baseBudget - actual;
      const vPct = parseFloat((variance / baseBudget * 100).toFixed(1));

      let note = '';
      if (Math.abs(vPct) > 15) note = pick(varianceNotes[variance < 0 ? 'large_over' : 'large_under']);
      else if (rand() < 0.3) note = pick(varianceNotes.normal);

      finRows.push([period, dept, item, baseBudget, actual, variance, vPct, note]);
    }
  }
}

fs.writeFileSync(path.join(dir, '06_financial_budget_actuals.csv'), toCSV(finHeaders, finRows));
console.log(`  → ${finRows.length} rows written`);


// ===== DATASET 7: Hospital Patient Flow =====
console.log('Generating Dataset 7: Hospital Patient Flow...');

const hospHeaders = ['Patient_ID','Arrival_Date','Arrival_Time','Triage_Level','Chief_Complaint','Wait_Time_Min','Treatment_Time_Min','Discharge_Status','Age_Group','Day_of_Week','Shift'];
const hospRows = [];

const complaints = ['Chest Pain','Fracture','Abdominal Pain','Laceration','Fever','Shortness of Breath','Back Pain','Headache','Allergic Reaction','Dizziness','Nausea/Vomiting','Sprain','Burn','Seizure','Urinary Symptoms'];
const dischargeStatus = ['Discharged','Admitted','Transferred','Left Without Being Seen'];
const ageGroups = ['0-17','18-34','35-54','55-74','75+'];
const daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const shifts = ['Day (7-15)','Evening (15-23)','Night (23-7)'];

// Wait time depends on triage level and shift
const waitTimeByTriage = {
  1: [2, 10],   // Resuscitation — immediate
  2: [5, 30],   // Emergency
  3: [15, 90],  // Urgent
  4: [30, 150], // Semi-urgent
  5: [45, 240]  // Non-urgent
};

for (let i = 1; i <= 300; i++) {
  const arrDate = addDays(new Date('2024-01-01'), randInt(0, 180));
  const hour = randInt(0, 23);
  const minute = randInt(0, 59);
  const arrTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  
  // Triage distribution: most are level 3-4
  let triage;
  const tr = rand();
  if (tr < 0.03) triage = 1;
  else if (tr < 0.15) triage = 2;
  else if (tr < 0.50) triage = 3;
  else if (tr < 0.82) triage = 4;
  else triage = 5;

  const [minW, maxW] = waitTimeByTriage[triage];
  let waitTime = randInt(minW, maxW);
  
  // Determine shift
  let shift;
  if (hour >= 7 && hour < 15) shift = 'Day (7-15)';
  else if (hour >= 15 && hour < 23) shift = 'Evening (15-23)';
  else shift = 'Night (23-7)';

  const dayOfWeek = daysOfWeek[arrDate.getDay() === 0 ? 6 : arrDate.getDay() - 1];

  // Weekend evening = longer waits
  if ((dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') && shift === 'Evening (15-23)') {
    waitTime = Math.round(waitTime * randFloat(1.3, 1.8));
  }

  // Treatment time
  const treatTime = randInt(15, 480);

  // Discharge status
  let discharge;
  if (waitTime > 120 && rand() < 0.15) discharge = 'Left Without Being Seen';
  else if (triage <= 2 && rand() < 0.5) discharge = 'Admitted';
  else if (rand() < 0.03) discharge = 'Transferred';
  else discharge = 'Discharged';

  // Log-normal-ish wait times: occasionally add extra
  if (rand() < 0.1) waitTime = Math.round(waitTime * randFloat(1.5, 2.5));
  waitTime = Math.min(waitTime, 240);

  hospRows.push([
    `PAT-${String(i).padStart(4, '0')}`,
    dateStr(arrDate), arrTime, triage,
    pick(complaints), waitTime, treatTime,
    discharge, pick(ageGroups), dayOfWeek, shift
  ]);
}

fs.writeFileSync(path.join(dir, '07_hospital_patient_flow.csv'), toCSV(hospHeaders, hospRows));
console.log(`  → ${hospRows.length} rows written`);


// ===== DATASET 8: Product Catalog =====
console.log('Generating Dataset 8: Product Catalog...');

const catHeaders = ['Product_ID','Product_Name','Category','Sub_Category','Unit_Cost','List_Price','Supplier','Weight_KG','Reorder_Level'];
const catRows = [];

const suppliers = ['TechCo Distributors','Global Office Supply','Nordic Furniture Group','Pacific Trade Co','Continental Electronics','Sahara Import-Export'];

for (const p of productList) {
  catRows.push([
    p.id, p.name, p.category, p.subCategory,
    p.unitCost, p.listPrice,
    pick(suppliers),
    randFloat(0.1, 45.0, 1),
    randInt(5, 100)
  ]);
}

fs.writeFileSync(path.join(dir, '08_product_catalog.csv'), toCSV(catHeaders, catRows));
console.log(`  → ${catRows.length} rows written`);


// ===== DATASET 9: Monthly Sales Files =====
console.log('Generating Dataset 9: Monthly Sales Files...');

const monthlyDir = path.join(dir, 'monthly_sales');
if (!fs.existsSync(monthlyDir)) fs.mkdirSync(monthlyDir, { recursive: true });

const monthNames = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

// Filter 2024 sales rows and split by month
const sales2024 = salesRows.filter(r => r[1].startsWith('2024'));

for (let m = 0; m < 12; m++) {
  const monthRows = sales2024.filter(r => {
    const month = parseInt(r[1].split('-')[1]) - 1;
    return month === m;
  });

  // Introduce subtle messiness: some months have different column orders or casing
  let headers = [...salesHeaders];
  let rows = monthRows;
  
  if (m === 2 || m === 7) {
    // March and August: uppercase headers
    headers = headers.map(h => h.toUpperCase());
  }
  if (m === 5) {
    // June: slightly different column name
    headers = headers.map(h => h === 'Customer_Name' ? 'Cust_Name' : h);
  }

  const filename = `sales_${monthNames[m]}.csv`;
  fs.writeFileSync(path.join(monthlyDir, filename), toCSV(headers, rows));
  console.log(`  → ${filename}: ${rows.length} rows`);
}


// ===== Dataset README =====
console.log('Writing dataset README...');

const readme = `# Course Datasets — Documentation

## Overview

This directory contains all datasets used in **The Complete Data Analytics Course**. Each dataset is a CSV file designed to teach specific analytical skills while being realistic enough to represent real-world data challenges.

## Dataset Summary

| # | File | Rows | Domain | Used In |
|---|---|---|---|---|
| 1 | \`01_global_superstore_sales.csv\` | 1,000 | Retail sales | Ch. 2–12 (primary dataset) |
| 2 | \`02_sales_dirty.csv\` | ~80 | Retail sales (dirty) | Ch. 4 (data cleaning) |
| 3 | \`03_employee_data.csv\` | 200 | HR / People analytics | Ch. 5, 6, 7, Project 2 |
| 4 | \`04_oil_gas_production.csv\` | ~900 | Oil & gas upstream | Ch. 5, 7, Project 4 |
| 5 | \`05_marketing_campaigns.csv\` | 300 | Digital marketing | Ch. 5, 7, Project 5 |
| 6 | \`06_financial_budget_actuals.csv\` | ~200 | Corporate finance | Ch. 7, 8, Project 3 |
| 7 | \`07_hospital_patient_flow.csv\` | 300 | Emergency department | Ch. 5, 7, Project 6 |
| 8 | \`08_product_catalog.csv\` | ~50 | Product reference | Ch. 3 (lookups), Ch. 9 (relationships) |
| 9 | \`monthly_sales/*.csv\` | ~1,000 total | Monthly retail files | Ch. 8 (Power Query folder combine) |

## How to Use

1. **Download** or copy the \`datasets\` folder to your local machine
2. **Open in Excel**: File → Open → navigate to the CSV file
3. **Import in Power BI**: Get Data → Text/CSV → select the file
4. For Power Query folder combine exercises (Ch. 8), point to the \`monthly_sales/\` folder

## Data Characteristics

### Intentional Data Patterns
- **Sales dataset**: Q4 spike in Technology, seasonal trends, negative profits on high-discount items
- **Employee data**: Right-skewed salary distribution, gender pay gap embedded for discovery, attrition correlation with satisfaction
- **Oil & gas**: Production decline curves, 3 outlier wells, seasonal shutdowns
- **Marketing**: Channel performance differences (Search > Email > Social > Display), A/B test variations
- **Financial**: Q4 budget flush, large variance outliers with explanatory notes
- **Hospital**: Log-normal wait times, weekend evening understaffing pattern, triage-based wait time ordering

### Dirty Data (Dataset 2) Issues
- Leading/trailing spaces
- Inconsistent casing
- Mixed date formats
- Numbers stored as text (with currency symbols)
- Missing values (blank, "N/A", "n/a", "-")
- Category typos
- Duplicate rows (5 exact)
- Blank rows (3 scattered)
- Inconsistent ID formats
- Address data crammed into name fields
- Special characters
- Negative quantities

## Regenerating Datasets

If you need to regenerate the datasets (e.g., to change the seed or row counts):

\`\`\`bash
node generate_datasets.js
\`\`\`

The script uses a seeded PRNG (seed: 42) for reproducibility. The same seed always produces the same data.
`;

fs.writeFileSync(path.join(dir, 'README.md'), readme);

console.log('\n✅ All datasets generated successfully!');
