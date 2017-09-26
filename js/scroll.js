$(document).ready(function () {
    $(window).on("scroll", function () {
      var wn = $(window).scrollTop();
      if (wn > 546) {
        $(".nav").css("background", "#4D4D4D");
      } else {
        $(".nav").css("background", "rgba(0,0,0,0)");
      }
    });
  });