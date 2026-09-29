import * as cheerio from 'cheerio';
import { CONFIG } from '../config';
import { Lesson } from '../types';
export function parseTimetableHtml(html:string):Lesson[]{
  const $=cheerio.load(html); const out:Lesson[]=[];
  $('table').each((_,tb)=>{
    let roomIdx=-1;
    $(tb).find('tr').each((_,tr)=>{
      const cells=$(tr).find('th,td').map((_,c)=>$(c).text().replace(/\s+/g,' ').trim()).get();
      if($(tr).find('th').length){roomIdx=cells.findIndex(c=>/aula/i.test(c));return}
      const row=cells.join(' | ');
      const course=CONFIG.courses.find(c=>row.includes(c.code)); if(!course)return;
      const d=row.match(/(\d{2})\/(\d{2})\/(\d{4})/); const t=row.match(/(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})/);
      if(!d||!t)return;
      const f=(x:string)=>x.replace('.',':').padStart(5,'0');
      const date=`${d[3]}-${d[2]}-${d[1]}`;
      const room=roomIdx>=0?cells[roomIdx]:cells[cells.length-1];
      out.push({id:`${course.id}-${date}-${f(t[1])}`,courseId:course.id,course:course.name,date,start:f(t[1]),end:f(t[2]),room:room&&!row.startsWith(room)?room:undefined});
    });
  });
  return out;
}
export async function fetchLessons():Promise<Lesson[]>{
  const {chromium}=await import('playwright');
  const b=await chromium.launch();
  try{
    const p=await b.newPage(); await p.goto(CONFIG.timetableUrl,{waitUntil:'networkidle',timeout:45000});
    await p.waitForSelector('table',{timeout:20000}).catch(()=>{});
    const lessons=parseTimetableHtml(await p.content());
    if(!lessons.length)throw new Error('Orario Sapienza non trovato o senza le 3 materie richieste.');
    return lessons;
  } finally{await b.close()}
}
