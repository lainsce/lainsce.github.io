$(function() {
  var fonts = 'https://fonts.googleapis.com/css?family=Raleway:300|Roboto:300,400';
  var icons = 'https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css';
  if (document.createStyleSheet) document.createStyleSheet(fonts);
  else $("head").append($("<link rel='stylesheet' href='"+ fonts +"' type='text/css' media='screen' />"));
  if (document.createStyleSheet) document.createStyleSheet(icons);
  else $("head").append($("<link rel='stylesheet' href='"+ icons +"' type='text/css' media='screen' />"));
});
