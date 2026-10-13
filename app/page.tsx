'use client';
import { useEffect,useMemo,useState } from 'react';
import { format,addDays,startOfWeek } from 'date-fns';
import { it } from 'date-fns/locale';
import { DayPlan } from '../lib/types';

export default function Home(){
 const [anchor,setAnchor]=useState(format(new Date(),'yyyy-MM-dd')); const [days,setDays]=useState<DayPlan[]|null>(null); const [error,setError]=useState('');const [updated,setUpdated]=useState('');
 async function load(){setError('');setDays(null);try{const r=await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH||''}/data.json`,{cache:'no-store'});if(!r.ok)throw new Error('Dati non ancora disponibili');const j=await r.json();const ws=startOfWeek(new Date(anchor),{weekStartsOn:1});setUpdated(j.generatedAt);setDays(Array.from({length:7},(_,i)=>{const d=format(addDays(ws,i),'yyyy-MM-dd');return j.days.find((x:DayPlan)=>x.date===d)||{date:d,lessons:[],outbound:[],inbound:[]}}))}catch(e){setError(e instanceof Error?e.message:'Errore')}}
 useEffect(()=>{load()},[anchor]);
 const weekStart=useMemo(()=>startOfWeek(new Date(anchor),{weekStartsOn:1}),[anchor]);
 return <main className="shell"><header className="top"><div><div className="brand">Uni → Treno</div><div className="sub">Sapienza · Lido di Lavinio ↔ Roma Termini</div></div><button className="pill" onClick={()=>setAnchor(format(new Date(),'yyyy-MM-dd'))}>Oggi</button></header>
 <div className="toolbar"><button className="pill" onClick={()=>setAnchor(format(addDays(weekStart,-7),'yyyy-MM-dd'))}>← settimana</button><span className="pill active">{format(weekStart,'d MMM',{locale:it})} – {format(addDays(weekStart,6),'d MMM',{locale:it})}</span><button className="pill" onClick={()=>setAnchor(format(addDays(weekStart,7),'yyyy-MM-dd'))}>settimana →</button></div>
 {error?<div className="error">{error}<br/><button className="pill" onClick={load}>Riprova</button></div>:!days?<div className="loading">Aggiorno lezioni e collegamenti…</div>:<Timetable days={days}/>}
 <div className="note">{updated&&<>Aggiornato: {new Date(updated).toLocaleString('it-IT')}. </>}Il calcolo del viaggio considera 20 minuti tra università e stazione. I treni mostrati sono suggerimenti: controlla sempre eventuali modifiche, ritardi o cancellazioni prima di partire.</div>
 </main>
}
const PX=0.9;
const mins=(t:string)=>{const [h,m]=t.split(':').map(Number);return h*60+m};
function Timetable({days}:{days:DayPlan[]}){
 const all:number[]=[];
 days.forEach(d=>{d.lessons.forEach(l=>all.push(mins(l.start),mins(l.end)));if(d.lessons.length){const o=d.outbound[0],i=d.inbound[0];if(o)all.push(mins(o.departure));if(i)all.push(mins(i.arrival))}});
 const from=(all.length?Math.floor(Math.min(...all)/60):8)*60-0, to=(all.length?Math.ceil(Math.max(...all)/60):20)*60;
 const hours=Array.from({length:(to-from)/60+1},(_,i)=>from/60+i);
 const box=(a:string,b:string)=>({top:(mins(a)-from)*PX,height:Math.max((mins(b)-mins(a))*PX,22)});
 return <div className="tt-wrap"><div className="tt">
  <div className="tt-corner"/>
  {days.map(d=><div className="tt-head" key={d.date}><b>{format(new Date(d.date+'T12:00:00'),'EEE',{locale:it})}</b> {format(new Date(d.date+'T12:00:00'),'d/M')}</div>)}
  <div className="tt-col tt-hours" style={{height:(to-from)*PX}}>{hours.map(h=><div key={h} className="tt-hour" style={{top:(h*60-from)*PX}}>{String(h).padStart(2,'0')}:00</div>)}</div>
  {days.map(d=><div className="tt-col" key={d.date} style={{height:(to-from)*PX}}>
   {hours.map(h=><div key={h} className="tt-line" style={{top:(h*60-from)*PX}}/>)}
   {d.lessons.map(l=><div key={l.id} className="tt-ev tt-lesson" style={box(l.start,l.end)}><b>{l.start}–{l.end}</b> {l.course}{l.room?` · ${l.room}`:''}</div>)}
   {d.lessons.length>0&&d.outbound[0]&&<div className="tt-ev tt-train" style={box(d.outbound[0].departure,d.outbound[0].arrival)}>🚆 {d.outbound[0].departure}→{d.outbound[0].arrival}</div>}
   {d.lessons.length>0&&d.inbound[0]&&<div className="tt-ev tt-train" style={box(d.inbound[0].departure,d.inbound[0].arrival)}>🚆 {d.inbound[0].departure}→{d.inbound[0].arrival}</div>}
  </div>)}
 </div></div>}
