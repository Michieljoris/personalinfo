/*global localStorage:false angular:false $:false jQuery:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

var myAppModule = angular.module('myApp', ['ngView', 'ui', 'ui.bootstrap'])
    .directive('compile', function($compile) {
        // directive factory creates a link function
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);
 
                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };

    });

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

myAppModule.factory('mainScope', function() {
  var shinyNewServiceInstance = { a:1 };
    // var msgs = [];
    // return function(msg) {
    //   msgs.push(msg);
    //   if (msgs.length == 3) {
    //     win.alert(msgs.join("\n"));
    //     msgs = [];
    //   }
    // };
  //factory function body that constructs shinyNewServiceInstance
  return shinyNewServiceInstance;
});

// var TabsDemoCtrl = function ($scope) {
//   $scope.panes = [
//     { title:"Dynamic Title 1", content:"Dynamic content 1" },
//     { title:"Dynamic Title 2", content:"Dynamic content 2" }
//   ];
// };

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

// function AccordionDemoCtrl($scope) {
//   $scope.oneAtATime = true;

//   $scope.groups = [
//     {
//       title: "Dynamic Group Header - 1",
//       content: "Dynamic Group Body - 1"
//     },
//     {
//       title: "Dynamic Group Header - 2",
//       content: "Dynamic Group Body - 2"
//     }
//   ];

//   $scope.items = ['Item 1', 'Item 2', 'Item 3'];

//   $scope.addItem = function() {
//     var newItemNo = $scope.items.length + 1;
//     $scope.items.push('Item ' + newItemNo);
//   };
// }

function initScrollToTop() {
    
    jQuery('#bla').click(function(){
        console.log('clicked scroll to top');
        jQuery("html, body").animate({
            scrollTop: 110
        }, 700);
        return false;
    });

    jQuery(window).scroll(function(){
        if (jQuery(this).scrollTop() > 100) {
            jQuery('#scroll-to-top').fadeIn();
        } else {
            jQuery('#scroll-to-top').fadeOut();
        }
    }); 
    
}

function scrollOnClick() {
    
    $(".scroll").click(function(event){
        
        // console.log('click on scroll');
        //prevent the default action for the click event
        event.preventDefault();
        
        //get the full url - like mysitecom/index.htm#home
        var full_url = this.href;
        
        //split the url by # and get the anchor target name - home in mysitecom/index.htm#home
        var parts = full_url.split("#");
        // console.log(parts);
        var trgt = parts[parts.length-1];
        
        if (trgt[0] === '!') return;
        //get the top offset of the target anchor
        var target_offset = $("#"+trgt).offset();
        if (target_offset) {
            var target_top = target_offset.top-50;
            // console.log(target_offset);
            //     //goto that anchor by setting the body scroll top to anchor top
            $('html, body').animate({scrollTop:target_top }, 1000, 'easeOutQuad');
        }
    });
}

function save($http) {
    $http({ 
        method: 'POST',
        url: '/db', // This is a URL on your website.
        data: {
            mydata: 123,
            moredata: "a string"
        } })
        .success(function(data, status, headers, config) {
            console.log('save post success', data);
        })
        .error(function(data, status, headers, config) {
            console.log('save post failure', status,  data);
        });
}

function mainCntl($location, $scope, $http, $dialog, dialogData) {
    console.log('in main');
    initPersona($scope, $http);
    
    $scope.isGuideView = function() {
        return $location.$$url !== '/template';
        };
    
    $scope.signout = function($event) {
        $event.preventDefault();
        console.log('Logging out');
        navigator.id.logout();
        
    };
    
    $scope.signin = function($event) {
        $event.preventDefault();
        console.log('Logging in');
        navigator.id.request();
        
        
    };
    
    $scope.data = {
        children: [{
            title: 'hello, world',
            children: []
        }]
    };
    
    $scope.docChoices =[
         'New', 'Delete', 'Rename', 'Access'
    ];
    
    $scope.title = "A Document of Personal Information";
    $scope.editButtonText = "Edit";
    $scope.radioModel = "local";
    $scope.viewMode = false;
    
    $scope.click = function($event, selection) {
        $event.preventDefault();
        switch (selection) {
          case 'edit':
            $scope.viewMode = !$scope.viewMode;
            $scope.editButtonText = $scope.viewMode ? 'Edit' : 'Done';
            break;
          case 'open':
            openDoc[$scope.radioModel]($dialog, dialogData);
            break;
          case 'save':
            saveDoc[$scope.radioModel]($dialog, dialogData);
            break;
        default: console.log(selection  + ' is not implemented yet..');
        }
    }; 
}

myAppModule.factory('dialogData', function() {
    var data = {};
    return data;
});


function DialogController($scope, dialog, dialogData){
    $scope.title = dialogData.title;
    $scope.docs = dialogData.docs;
    $scope.close = function(result){
        dialog.close(result);
    };
}
function openDialog($dialog, cb) {
    var opts = {
        backdrop: true,
        backdropFade: true,
        keyboard: true,
        // dialogFade: true,
        backdropClick: true,
        templateUrl: 'built/openDialog.html',
        controller: 'DialogController'
    };
    var d = $dialog.dialog(opts);
    d.open().then(function(result){
        if(result)
        {
            cb(result);
        }
    });
}


var openDoc = {
    local: function ($dialog, dialogData) {
        dialogData.title = "Local storage";
        dialogData.docs = Object.keys(localStorage);
        openDialog($dialog, function(result) {
            console.log(result);
        });
    }
    ,dropbox: function() {
    
    }
    ,database: function() {
    
    }
    ,disk: function() {
    
    }
};


var saveDoc = {
    local: function ($dialog, dialogData) {
        dialogData.title = "Local storage";
        dialogData.docs = Object.keys(localStorage);
        openDialog($dialog, function(result) {
            console.log(result);
        });
    }
    ,dropbox: function() {
    
    }
    ,database: function() {
    
    }
    ,disk: function() {
    
    }
};


function DefaultCntl($scope) {
    console.log('In DefaultCntl');
    // console.log('Targets', $('body').find("#menu-- .nav li > a"));
    initScrollToTop();
    
    //any href with class scroll with smoothly scroll to the #target
    scrollOnClick(); 
    
    //Fix menu, but let it scroll to the top
    var $window = $(window);
    $('.bs-docs-sidenav').affix({
        offset: {
            top: function () { return $window.width() <= 980 ? 210 : 110 }
            // , bottom: 270
            , bottom:0 
        }
    });
    
    //spy on the scrolling body and match data-target in #menu-- 
    $('body').scrollspy({target: '#menu--', offset:60});
    
}


// var app = angular.module('app', []);

myAppModule.directive('yaTree', function () {
  return {
    restrict: 'A',
    transclude: 'element',
    priority: 1000,
    terminal: true,
    compile: function (tElement, tAttrs, transclude) {

      var repeatExpr, childExpr, rootExpr, childrenExpr;

      repeatExpr = tAttrs.yaTree.match(/^(.*) in ((?:.*\.)?(.*)) at (.*)$/);
      childExpr = repeatExpr[1];
      rootExpr = repeatExpr[2];
      childrenExpr = repeatExpr[3];
      branchExpr = repeatExpr[4];

      return function link (scope, element, attrs) {
        var rootElement = element[0].parentNode,
            cache = [];

        // Reverse lookup object to avoid re-rendering elements
        function lookup (child) {
          var i = cache.length;
          while (i--) {
            if (cache[i].scope[childExpr] === child) {
              return cache.splice(i, 1)[0];
            }
          }
        }

          scope.$watch(rootExpr, function (root) {
                  var currentCache = [];

              // Recurse the data structure
              function walk (children, parentNode, parentScope, depth) {

                  var i = 0,
                  n = children.length,
                  last = n - 1,
                  cursor,
                  child,
                  cached,
                  childScope,
                  grandchildren;

                  // Iterate the children at the current level
                  for (; i < n; ++i) {

                      // We will compare the cached element to the element in 
                      // at the destination index. If it does not match, then 
                      // the cached element is being moved into this position.
                      cursor = parentNode.childNodes[i];

                      child = children[i];

                      // See if this child has been previously rendered
                      // using a reverse lookup by object reference
                      cached = lookup(child);
              
                      // If the parentScope no longer matches, we've moved.
                      // We'll have to transclude again so that scopes 
                      // and controllers are properly inherited
                      if (cached && cached.parentScope !== parentScope) {
                          cache.push(cached);
                          cached = null;
                      }
              
                      // If it has not, render a new element and prepare its scope
                      // We also cache a reference to its branch node which will
                      // be used as the parentNode in the next level of recursion
                      if (!cached) {
                          transclude(parentScope.$new(), function (clone, childScope) {

                              childScope[childExpr] = child;
                  
                              cached = {
                                  scope: childScope,
                                  parentScope: parentScope,
                                  element: clone[0],
                                  branch: clone.find(branchExpr)[0]
                              };

                              // This had to happen during transclusion so inherited 
                              // controllers, among other things, work properly
                              if (!cursor)
                                  parentNode.appendChild(cached.element);
                              else parentNode.insertBefore(cached.element, cursor);

                          });
                      } else if (cached.element !== cursor) {
                          if (!cursor)
                              parentNode.appendChild(cached.element);
                          else parentNode.insertBefore(cached.element, cursor);
                      }

                      // Lets's set some scope values
                      childScope = cached.scope;

                      // Store the current depth on the scope in case you want 
                      // to use it (for good or evil, no judgment).
                      childScope.$depth = depth;
              
                      // Emulate some ng-repeat values
                      childScope.$index = i;
                      childScope.$first = (i === 0);
                      childScope.$last = (i === last);
                      childScope.$middle = !(childScope.$first || childScope.$last);

                      // Push the object onto the new cache which will replace
                      // the old cache at the end of the walk.
                      currentCache.push(cached);

                      // If the child has children of its own, recurse 'em.             
                      grandchildren = child[childrenExpr];
                      if (grandchildren && grandchildren.length) {
                          walk(grandchildren, cached.branch, childScope, depth + 1);
                      }
                  }
              };
              walk(root, rootElement, scope, 0);

              // Cleanup objects which have been removed.
              // Remove DOM elements and destroy scopes to prevent memory leaks.
              i = cache.length;

              while (i--) {
                  cached = cache[i];
                  if (cached.scope) {
                      cached.scope.$destroy();
                  }
                  if (cached.element) {
                      cached.element.parentNode.removeChild(cached.element);
                  } 
              }

                  // Replace previous cache.
              cache = currentCache;

          }, true);
      };
    }
  };
});




myAppModule.directive('uiNestedSortable', ['$parse', function ($parse) {

  'use strict';

  var eventTypes = 'Create Start Sort Change BeforeStop Stop Update Receive Remove Over Out Activate Deactivate'.split(' ');

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      var options = attrs.uiNestedSortable ? $parse(attrs.uiNestedSortable)() : {};

      angular.forEach(eventTypes, function (eventType) {

        var attr = attrs['uiNestedSortable' + eventType],
          callback;

        if (attr) {
          callback = $parse(attr);
          options[eventType.charAt(0).toLowerCase() + eventType.substr(1)] = function (event, ui) {
            scope.$apply(function () {

              callback(scope, {
                $event: event,
                $ui: ui
              });
            });
          };
        }

      });

      element.nestedSortable(options);

    }
  };
}]);
