$(function () {
    // How old am I?
    $("#age").text (yearsSince ("1993/06/06"));
});

function yearsSince (epoch) {
    var diff = new Date () - new Date (epoch);
    var age = Math.floor (diff/31536000000);
    return age;
}
