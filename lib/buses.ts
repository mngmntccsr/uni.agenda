import { Train } from './types';
const mk=(provider:string,rows:string[][]):Train[]=>rows.map(([departure,arrival])=>({id:`${provider}-${departure}-${arrival}`,provider,departure,arrival,direct:true}));
// Tiburtina -> Lanciano (ritorno del giovedì). Arrivo < partenza = giorno dopo.
export const BUS_FROM_TIBURTINA:Train[]=[
...mk('Clickbus',[['07:15','10:20'],['09:50','12:55'],['12:45','15:40'],['14:15','17:10'],['16:00','19:05'],['17:25','22:20'],['19:00','22:00'],['20:40','23:35']]),
...mk('Flixbus',[['13:00','16:30'],['18:30','22:00'],['23:14','02:25']]),
...mk('Dicarlobus',[['08:15','11:00'],['10:00','12:48'],['21:00','23:40']]),
...mk('Prontobus',[['07:00','10:20'],['10:45','14:00'],['23:25','02:40']]),
];
// Lanciano -> Tiburtina (andata del lunedì): da aggiungere
export const BUS_TO_TIBURTINA:Train[]=[];
