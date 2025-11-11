// scripts/import-to-supabase.js
// Usage:
// 1) Install dependency: npm install @supabase/supabase-js
// 2) Set env: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file
// 3) Run: node scripts/import-to-supabase.js

// Load environment variables from .env file
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const ProblemsDatabase = require('../js/problems.js');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function importAll() {
  const db = new ProblemsDatabase();
  const problemsObj = db.problems || {};
  const microDrillsObj = db.microDrills || {};

  const problemRows = [];
  for (const lang of Object.keys(problemsObj)) {
    const topics = problemsObj[lang];
    for (const topic of Object.keys(topics)) {
      const arr = topics[topic] || [];
      for (const p of arr) {
        problemRows.push({
          id: `${lang}::${p.id}`, // namespaced id to avoid collisions
          language: lang,
          topic,
          title: p.title || null,
          description: p.description || null,
          solution: p.solution || null,
          patterns: p.patterns || null
        });
      }
    }
  }

  const drillRows = [];
  for (const lang of Object.keys(microDrillsObj)) {
    const arr = microDrillsObj[lang] || [];
    for (const d of arr) {
      drillRows.push({
        id: `${lang}::${d.id}`,
        language: lang,
        title: d.title || null,
        pattern: d.pattern || null,
        description: d.description || null
      });
    }
  }

  try {
    if (problemRows.length) {
      console.log('Upserting problems:', problemRows.length);
      const { error: pErr } = await supabase.from('problems').upsert(problemRows, { onConflict: 'id' });
      if (pErr) throw pErr;
    } else {
      console.log('No problems to import');
    }

    if (drillRows.length) {
      console.log('Upserting micro_drills:', drillRows.length);
      const { error: dErr } = await supabase.from('micro_drills').upsert(drillRows, { onConflict: 'id' });
      if (dErr) throw dErr;
    } else {
      console.log('No micro drills to import');
    }

    console.log('Import completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err.message || err);
    process.exit(2);
  }
}

importAll();