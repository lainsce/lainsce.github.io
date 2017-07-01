$(function() {
  var fonts = 'https://fonts.googleapis.com/css?family=Raleway:300|Roboto:300,400,500';
  if (document.createStyleSheet) document.createStyleSheet(fonts);
  else $("head").append($("<link rel='stylesheet' href='"+ fonts +"' type='text/css' media='screen' />"));
});
