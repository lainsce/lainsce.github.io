var birth = new Date('07/11/2003');
var check = new Date();
var milliDay = 1000 * 60 * 60 * 24; // a day in milliseconds;
var ageInDays = (check - birth) / milliDay;
var ageInYears =  Math.floor(ageInDays / 365 );

document.getElementById('age').innerText= ageInYears; 
