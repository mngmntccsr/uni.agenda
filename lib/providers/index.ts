import { Train } from '../types';
import { searchTrenitalia } from './trenitalia';
import { searchTrainline } from './trainline';
export async function searchTrains(from:string,to:string,date:string):Promise<Train[]>{
  if(process.env.ENABLE_LIVE_TRAINS==='false')return [];
  for(const p of [searchTrenitalia,searchTrainline]){
    try{const r=await p(from,to,date); if(r.length)return r}catch{}
  }
  return [];
}
