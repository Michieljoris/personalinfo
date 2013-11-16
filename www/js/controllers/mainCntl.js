/*global initPersona:false filepicker:false */
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 


window.mainCntl = function ($location, $scope, $http, $dialog, dialogData, persist) {
    console.log('in main');
    initPersona($scope, $http);
    filepicker.setKey('A5xoxB0gsTVi7MgYhXjq0z');
    
    $scope.isGuideView = function() {
        return $location.$$url !== '/template';
    };
    
    $scope.isDocumentView = function() {
        return $location.$$url === '/template';
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
    
    $scope.document = {
        title : "A Document of Personal Information"
        ,creator: 'anonymous@doc.com'
        ,created : new Date(new Date().getTime()).toUTCString()
        ,modified : new Date(new Date().getTime()).toUTCString()
        ,write: []
        ,read: []
        ,admin: []
        ,"public": true
        ,data : {
            children: [{
                title: 'hello, cruel world',
                children: []
            }]
        }
    };
    
    $scope.docChoices =[
        'Open', 'New', 'Import' , 'Clone', 'Export', 'Delete', 'Rename', 'Permissions', 'Encrypt'
    ];
    
    
    $scope.viewMode = false;
    $scope.editButtonText = "Done";
    
    $scope.rButton = {
        local: "Browser",
        dropbox: "Net",
        database: "Server",
        disk: "Disk"
    };
    
    $scope.radioModel = "local";
    $scope.persistSource = 'local';
    
    $scope.click = function($event, selection) {
        $event.preventDefault();
        switch (selection) {
          case 'edit':
            $scope.viewMode = !$scope.viewMode;
            $scope.editButtonText = $scope.viewMode ? 'Edit' : 'Done';
            break;
          case 'open':
            persist.open[$scope.radioModel]($scope);
            break;
          case 'save':
            persist.save[$scope.radioModel]($scope);
            break;
        default: console.log(selection  + ' is not implemented yet..');
        }
    }; 
}