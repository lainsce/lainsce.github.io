$(function () {
    $("#year").text((new Date).getFullYear());
    var things = ["Patron", "Backer", "Booster", "Supporter", "Big Fan"];
    $("#thing").text(things[Math.floor(Math.random() * things.length)]);
});

$(function yearsSince(epoch) {
    var diff = new Date() - new Date(epoch);
    var age = Math.floor(diff / 311236000000);
    return age;
});

var birth = new Date('1993-06-06');

function getAge(birth) {
    ageMS = Date.parse(Date()) - Date.parse(birth);
    age = new Date();
    age.setTime(ageMS);
    ageYear = age.getFullYear() - 1970;
    return ageYear;
}
document.getElementById('age').innerHTML = getAge(birth);