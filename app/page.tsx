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
 return <main className="shell"><header className="top"><div><div className="brand">Uni → Treno</div><div className="sub">Sapienza · Padiglione ↔ Roma Termini</div></div><button className="pill" onClick={()=>setAnchor(format(new Date(),'yyyy-MM-dd'))}>Oggi</button></header>
 <div className="toolbar"><button className="pill" onClick={()=>setAnchor(format(addDays(weekStart,-7),'yyyy-MM-dd'))}>← settimana</button><span className="pill active">{format(weekStart,'d MMM',{locale:it})} – {format(addDays(weekStart,6),'d MMM',{locale:it})}</span><button className="pill" onClick={()=>setAnchor(format(addDays(weekStart,7),'yyyy-MM-dd'))}>settimana →</button></div>
 {error?<div className="error">{error}<br/><button className="pill" onClick={load}>Riprova</button></div>:!days?<div className="loading">Aggiorno lezioni e collegamenti…</div>:<section className="week">{days.map(day=><Day key={day.date} day={day}/>)}</section>}
 <div className="note">{updated&&<>Aggiornato: {new Date(updated).toLocaleString('it-IT')}. </>}Il calcolo del viaggio considera 20 minuti tra università e stazione. I treni mostrati sono suggerimenti: controlla sempre eventuali modifiche, ritardi o cancellazioni prima di partire.</div>
 </main>
}
function Day({day}:{day:DayPlan}){return <article className="day"><div className="dayhead"><span className="dow">{format(new Date(day.date+'T12:00:00'),'EEEE',{locale:it})}</span><span className="date">{format(new Date(day.date+'T12:00:00'),'d MMM',{locale:it})}</span></div>{day.lessons.length===0?<div className="sub">Nessuna delle 3 materie</div>:day.lessons.map(l=><div className="lesson" key={l.id}><div className="time">{l.start}–{l.end}</div><b>{l.course}</b>{l.room&&<div className="room">{l.room}</div>}</div>)}{day.lessons.length>0&&<><Travel title="Andata" trains={day.outbound}/><Travel title="Ritorno" trains={day.inbound}/></>}</article>}
function Travel({title,trains}:{title:string;trains:DayPlan['outbound']}){return <div className="travel"><h4>{title}</h4>{trains.length?trains.slice(0,3).map(t=><div className="train" key={t.id}><div><strong>{t.departure}</strong> → <strong>{t.arrival}</strong><div className="sub">{t.provider}{t.direct?' · diretto':''}</div></div>{t.price&&<div>{t.price.toFixed(2)} €</div>}</div>):<div className="sub">Nessun collegamento trovato automaticamente.</div>}</div>}
