$(document).ready(function () {
    $(window).on("scroll", function () {
      var wn = $(window).scrollTop();
      if (wn > 46) {
        $(".nav").css("background", "rgba(63, 63, 63, 1)");
      } else {
        $(".nav").css("background", "transparent");
      }
    });
  });