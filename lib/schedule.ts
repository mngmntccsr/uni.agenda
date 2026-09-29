import { Lesson,Train } from './types';
import { CONFIG } from './config';
import { toMinutes } from './time';
const T=CONFIG.transferMinutes;
export function selectOutbound(trains:Train[],l:Lesson){
  return trains.filter(t=>toMinutes(t.arrival)+T<=toMinutes(l.start)).sort((a,b)=>toMinutes(b.departure)-toMinutes(a.departure));
}
export function selectInbound(trains:Train[],l:Lesson){
  return trains.filter(t=>toMinutes(t.departure)>=toMinutes(l.end)+T).sort((a,b)=>toMinutes(a.departure)-toMinutes(b.departure));
}
