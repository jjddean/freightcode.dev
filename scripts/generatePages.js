import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Page configurations 
const visitorPagesBatch1 = [ 
  { name: 'HomePage', route: '/', content: '/* Content for Home Page */' }, 
  { name: 'ServicesPage', route: '/services', content: '/* Content for Services Page */' }, 
  { name: 'SolutionsPage', route: '/solutions', content: '/* Content for Solutions Page */' }, 
  { name: 'PlatformPage', route: '/platform', content: '/* Content for Platform Page */' }, 
  { name: 'ResourcesPage', route: '/resources', content: '/* Content for Resources Page */' }, 
]; 

const visitorPagesBatch2 = [ 
  { name: 'AboutPage', route: '/about', content: '/* Content for About Page */' }, 
  { name: 'ContactPage', route: '/contact', content: '/* Content for Contact Page */' }, 
  { name: 'TeamPage', route: '/team', content: '/* Content for Team Page */' }, 
  { name: 'CareersPage', route: '/careers', content: '/* Content for Careers Page */' }, 
  { name: 'BlogPage', route: '/blog', content: '/* Content for Blog Page */' }, 
]; 

const visitorPagesBatch3 = [ 
  { name: 'FAQPage', route: '/faq', content: '/* Content for FAQ Page */' }, 
  { name: 'CaseStudiesPage', route: '/case-studies', content: '/* Content for Case Studies Page */' }, 
  { name: 'NewsPage', route: '/news', content: '/* Content for News Page */' }, 
]; 

// Create pages directory if it doesn't exist 
const pagesDir = path.join(__dirname, '..', 'src', 'pages'); 
if (!fs.existsSync(pagesDir)) { 
  fs.mkdirSync(pagesDir, { recursive: true }); 
} 

// Function to generate pages 
const generatePages = (pages) => { 
  pages.forEach(page => { 
    const pagePath = path.join(pagesDir, `${page.name}.tsx`); 
    fs.writeFileSync( 
      pagePath, 
      `import React from 'react';

` + 
      `const ${page.name} = () => {
` + 
      `  return (
` + 
      `    <div className="page-container">
` + 
      `      <h1>${page.name.replace(/Page$/, '')}</h1>
` + 
      `      <div className="page-content">
` + 
      `        ${page.content}
` + 
      `      </div>
` + 
      `    </div>
` + 
      `  );
` + 
      `};

` + 
      `export default ${page.name};` 
    ); 
    console.log(`Created: ${pagePath}`); 
  }); 
}; 

// Generate pages in batches 
console.log('Generating first batch of 5 visitor pages...'); 
generatePages(visitorPagesBatch1); 

console.log('Generating second batch of 5 visitor pages...'); 
generatePages(visitorPagesBatch2); 

console.log('Generating third batch of 3 visitor pages...'); 
generatePages(visitorPagesBatch3); 

console.log('All pages have been generated!');