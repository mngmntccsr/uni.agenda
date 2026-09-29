export const CONFIG={
  timetableUrl:process.env.SAPIENZA_TIMETABLE_URL||'https://corsidilaurea.uniroma1.it/it/course/33443/attendance/timetable',
  transferMinutes:20,
  origin:'Padiglione',
  destination:'Roma Termini',
  courses:[
    {id:'valutazione',code:'10627660',name:"Valutazione d'azienda"},
    {id:'gestione',code:'10628744',name:"Gestione economica e finanziaria dell'azienda"},
    {id:'innovazione',code:'10626387',name:"Economia e politiche dell'innovazione"},
  ],
};
