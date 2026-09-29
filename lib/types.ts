export type Lesson={id:string;courseId:string;course:string;date:string;start:string;end:string;room?:string};
export type Train={id:string;provider:string;departure:string;arrival:string;price?:number;direct?:boolean};
export type DayPlan={date:string;lessons:Lesson[];outbound:Train[];inbound:Train[]};
