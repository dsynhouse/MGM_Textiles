import { createClient } from '@supabase/supabase-js';
import { MACHINES, BEAMS, PRODUCTION_ORDERS, CONSUMPTION_LOGS, DOC_ARTICLES, DOWNTIME_ENTRIES } from './src/data/mockData.ts';

const supabase = createClient('https://ubxhgumkvibrzcqtxbyt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVieGhndW1rdmlicnpjcXR4Ynl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTIwNDcsImV4cCI6MjA5NjU2ODA0N30.U5FjjkEORZ2j51p-dXMwppUZJYv4ZjNdM-0JkmFKGQk');

async function seed() {
  console.log('Seeding machines...');
  const { error: err1 } = await supabase.from('machines').insert([MACHINES[0]]);
  if (err1) console.error('Error machines:', err1);

  console.log('Seeding beams...');
  const { error: err2 } = await supabase.from('beams').insert([BEAMS[0]]);
  if (err2) console.error('Error beams:', err2);

  console.log('Seeding orders...');
  const { error: err3 } = await supabase.from('production_orders').insert([PRODUCTION_ORDERS[0]]);
  if (err3) console.error('Error orders:', err3);

  console.log('Seeding downtime...');
  const { error: err4 } = await supabase.from('downtime_logs').insert([DOWNTIME_ENTRIES[0]]);
  if (err4) console.error('Error downtime:', err4);

  console.log('Seeding consumption...');
  const { error: err5 } = await supabase.from('consumption_logs').insert([CONSUMPTION_LOGS[0]]);
  if (err5) console.error('Error consumption:', err5);

  console.log('Seeding docs...');
  const { error: err6 } = await supabase.from('docs').insert([DOC_ARTICLES[0]]);
  if (err6) console.error('Error docs:', err6);

  console.log('Seeding done!');
}

seed().catch(console.error);
