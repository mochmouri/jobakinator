import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env') });

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, key);

const professions = JSON.parse(
  readFileSync(join(__dirname, '..', 'src', 'data', 'professions.json'), 'utf8')
);

async function seed() {
  console.log(`Seeding ${professions.length} professions…`);

  // Clear existing
  const { error: delErr } = await supabase
    .from('professions')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (delErr) console.warn('Clear warning:', delErr.message);

  const rows = professions.map(p => ({
    name: p.title,
    category: p.category,
    traits: p.traits,
    description: p.description,
    why: p.why,
    status: 'active',
    submission_count: 1,
  }));

  const { error } = await supabase.from('professions').insert(rows);
  if (error) {
    console.error('Insert failed:', error.message);
    process.exit(1);
  }
  console.log('Done.');
}

seed();
