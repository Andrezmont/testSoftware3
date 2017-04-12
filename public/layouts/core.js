/* global app:true */
/* exported app */
/**
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-23794447-6', 'auto');
  ga('send', 'pageview');
**/

var app; //the main declaration

(function() {
  'use strict';

  $(document).ready(function() {
    //active (selected) navigation elements
    $('.nav [href="'+ window.location.pathname +'"]').closest('li').toggleClass('active');

    //register global ajax handlers
    $(document).ajaxStart(function(){ $('.ajax-spinner').show(); });
    $(document).ajaxStop(function(){  $('.ajax-spinner').hide(); });


    //ajax spinner follows mouse
    $(document).bind('mousemove', function(e) {
      $('.ajax-spinner').css({
        left: e.pageX + 15,
        top: e.pageY
      });
    });
  });
}());
