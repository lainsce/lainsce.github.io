$(function () {
    // Copyright year stuff
    $("#year").text((new Date).getFullYear ());

    // Buy me a foo plz
    var things = ["Beer", "Coffee", "Drink", "Pizza", "Snack", "Pop"];
    $("#thing").text (things[Math.floor(Math.random()*things.length)]);
});

function yearsSince (epoch) {
    var diff = new Date () - new Date (epoch);
    var age = Math.floor (diff/31536000000);
    return age;
}
