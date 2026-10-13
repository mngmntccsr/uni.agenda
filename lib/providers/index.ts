import { Train } from '../types';
import { TO_TERMINI,FROM_TERMINI } from '../trains';
export async function searchTrains(from:string,_to:string,_date:string):Promise<Train[]>{
  const rows=from.toLowerCase().includes('termini')?FROM_TERMINI:TO_TERMINI;
  return rows.map(([departure,arrival])=>({id:`${departure}-${arrival}`,provider:'Trenitalia FL8',departure,arrival,direct:true}));
}
