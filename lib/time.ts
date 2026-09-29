export function toMinutes(hhmm:string){ const [h,m]=hhmm.split(':').map(Number); return h*60+m; }
export function fromMinutes(n:number){ n=(n+1440)%1440; return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`; }
export function minutesBetween(a:string,b:string){ return toMinutes(b)-toMinutes(a); }
