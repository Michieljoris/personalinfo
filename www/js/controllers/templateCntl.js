/*global angular:false $:false jQuery:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

function templateCntl($scope, $timeout) {
    console.log('in template controller');
    // var items = [];
    // var anItem = {
    //     type: 'text'  //or table, or calendar
    //     ,isSection: false
    //     ,title: 'my first item'
    //     ,content: 'and this is the content'
    // };
    // $scope.items = items;
    console.log('parent:',$scope.$parent) ;
    console.log($scope);
    
    
    $scope.toggleMinimized = function (child) {
        child.minimized = !child.minimized;
    };
    
    $scope.addChild = function (child) {
        child.children.push({
            title: '',
            content: '',
            children: []
        });
    };

    $scope.remove = function (child) {
        function walk(target) {
            var children = target.children,
            i;
            if (children) {
                i = children.length;
                while (i--) {
                    if (children[i] === child) {
                        children.splice(i, 1);
                    } else {
                        walk(children[i]);
                    }
                }
            }
        }
        walk($scope.document.data);
    };

    $scope.update = function (event, ui) {
        var root = event.target,
            item = ui.item,
            parent = item.parent(),
        target = (parent[0] === root) ? $scope.document.data : parent.scope().child,
        child = item.scope().child,
        index = item.index();

        if (!target.children)  target.children = [];

        function walk(target, child) {
                var children = target.children,
            i;
            if (children) {
                i = children.length;
                while (i--) {
                    if (children[i] === child) {
                        children.splice(i, 1);
                    } else {
                        walk(children[i], child);
                    }
                }
            }
        }
        walk($scope.document.data, child);

        target.children.splice(index, 0, child);
    };

}
