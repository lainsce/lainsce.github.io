today = new Date();
document.getElementById('year').innerHTML = today.getFullYear();

var birth = new Date('1993-06-06');
function getAge(birth) {
  ageMS = Date.parse(Date()) - Date.parse(birth);
  age = new Date();
  age.setTime(ageMS);
  ageYear = age.getFullYear() - 1970;
  return ageYear;
}
document.getElementById('age').innerHTML = getAge(birth);
