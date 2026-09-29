import { mkdirSync,writeFileSync } from 'node:fs';
import { fetchLessons } from '../lib/scrapers/sapienza';
import { searchTrains } from '../lib/providers';
import { selectInbound,selectOutbound } from '../lib/schedule';
import { CONFIG } from '../lib/config';
import { DayPlan } from '../lib/types';
async function main(){
  const all=await fetchLessons();
  const dates=[...new Set(all.map(l=>l.date))].sort();
  const days:DayPlan[]=[];
  for(const date of dates){
    const lessons=all.filter(l=>l.date===date).sort((a,b)=>a.start.localeCompare(b.start));
    const [go,back]=await Promise.all([searchTrains(CONFIG.origin,CONFIG.destination,date),searchTrains(CONFIG.destination,CONFIG.origin,date)]);
    days.push({date,lessons,outbound:selectOutbound(go,lessons[0]),inbound:selectInbound(back,lessons[lessons.length-1])});
  }
  mkdirSync('public',{recursive:true});
  writeFileSync('public/data.json',JSON.stringify({generatedAt:new Date().toISOString(),days}));
  console.log('Salvati',days.length,'giorni');
}
main().catch(e=>{console.error(e);process.exit(1)});
