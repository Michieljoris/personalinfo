/*global localStorage:false angular:false $:false jQuery:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

var myAppModule = angular.module('myApp', ['ngView', 'ui', 'ui.bootstrap']);


// angular.module('myModule', [], function($provide) {
//   $provide.factory('notify', ['$window', function(win) {
//     var msgs = [];
//     return function(msg) {
//       msgs.push(msg);
//       if (msgs.length == 3) {
//         win.alert(msgs.join("\n"));
//         msgs = [];
//       }
//     };
//   }]);
// });

myAppModule.value('ui.config', {
   // The ui-jq directive namespace
   jq: {
      // The Tooltip namespace
      tooltip: {
         // Tooltip options. This object will be used as the defaults
         placement: 'left'
      }
   }
});


function DefaultCntl($scope) {
    console.log('In DefaultCntl');

   } 

