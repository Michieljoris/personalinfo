/*global myAppModule:false filepicker:false */
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

myAppModule.factory('dialogData', function() {
    var data = {};
    return data;
});

window.DialogController = function($scope, dialog, dialogData){
    $scope.title = dialogData.title;
    $scope.button = 'Close';
    $scope.docs = dialogData.docs;
    $scope.click = function(selection) {
        console.log('click');
        dialog.close(selection);
    };
    $scope.close = function(result){
        dialog.close(result);
    };
};

myAppModule.factory('persist', function($dialog, dialogData) {
    var persist = {};
    
    function openDialog(cb) {
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
//     Access Key ID: AKIAI4SBO5IENLJJMCGQ
// Secret Access Key: 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


    persist.open = {
        local: function ($scope) {
            dialogData.title = "Browser";
            dialogData.docs = Object.keys(localStorage);
            openDialog(function(result) {
                $scope.document.title = result;
                var data = localStorage.getItem(result);
                try {
                    $scope.document.data = JSON.parse(data);
                } catch(e) {
                    $scope.document.data = {};
                }
                // $scope.$apply();
                console.log(result);
            });
        }
        ,dropbox: function() {
            filepicker.pickAndStore({
                // mimetypes: ['image/*', 'text/plain'],
                extension: '.pi',
                container: 'modal',
                services:['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'BOX', 'SKYDRIVE',
                          'GMAIL', 'URL', 'FTP', 'WEBDAV'],
                maxSize: 50 *1024
            }, {
                location: 'S3',
                // path: '/path',
                access: 'private'
                                        
            },function(FPFile){
                console.log(JSON.stringify(FPFile));
            }, function(FPError){
                console.log(FPError.toString());
            }
                           );
    
        }
        ,database: function() {
    
        }
        ,disk: function() {
            // var reader = new FileReader();
    
        }
    };


    persist.save = {
        local: function ($scope) {
            localStorage.setItem($scope.document.title, JSON.stringify($scope.document, null, ' '));
            console.log('Saved to local storage');
            $scope.rButton.local = 'Saved';
            setTimeout(function() {
                $scope.rButton.local = 'Local';
                $scope.$apply();
            }, 1500);
        }
        ,dropbox: function() {
            filepicker.exportFile(
                'https://drpyjw32lhcoa.cloudfront.net/fb03a37/img/success.png',
                {
                    // mimetypes: ['image/*', 'text/plain'],
                    extension: '.pi',
                    container: 'modal',
                    services:['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'BOX', 'SKYDRIVE',
                               'FTP', 'WEBDAV'],
                    suggestedFilename: 'YourRecommendedFilename'
                    
                },function(FPFile){
                    console.log(FPFile);
                },function(FPError){
                    console.log(FPError.toString());
                }

            );
    
        }
        ,database: function() {
    
        }
        ,disk: function() {
    
        }
    };
    return persist;
});