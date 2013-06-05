/*global process:false require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

var https = require('https');
var querystring = require('querystring');
var VOW = require('./vow.js').VOW;
var audience = process.env.AUDIENCE;

var options = {
    hostname: 'verifier.login.persona.org',
    port: 443,
    path: '/verify',
    method: 'POST'
};

function verifyReq(assertion) {
    var vow = VOW.make();
    var data = querystring.stringify({
        assertion: assertion,
        audience: audience ? audience : 'localhost'
    });
    
    options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
    };
    
    var req = https.request(options, function(res) {
        // console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var data = "";
        res.on('data', function (chunk) { data += chunk; });
        res.on('end', function () { 
            // console.log('BODY: ' + data);
            try {
                data = JSON.parse(data);
                vow.keep(data);
            } catch(e) {
                console.log("non-JSON response from verifier");
                // bogus response from verifier!
                vow['break']("bogus response from verifier!");
            }
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message, e);
        vow['break']('problem with request: ' + e.message);
    });
    
    req.write(data);
    req.end();
    return vow.promise;
}

function sendResponse(res, obj) {
    var headers = {'Content-Type': 'text/html'};
    var returnCode = 403;
    var descr = obj.reason;
    if (obj.success) {
        var expireDate = new Date(new Date().getTime() + 24*60*60).toUTCString();
        headers['Set-Cookie'] = 'persona=' +obj.email + '; expires=' + expireDate;
        returnCode = 200; 
        descr = "OK";
    }
    res.writeHead(returnCode, descr, headers);
    res.write(JSON.stringify(obj));
    res.end();
}

function verify(session, assertion, res) {
    verifyReq(assertion).when(
        function(data) {
            console.log(data);
            var valid = data && data.status === 'okay';
            var email = valid ? data.email : null;
            if (valid) {
                console.log('assertion verified succesfully for email:', email);
                if (session) session.set('email', email);
                sendResponse(res, { success: true, email: email});
            }
            else {
                console.log("failed to verify assertion:", data.reason);   
                sendResponse(res, { success: false, reason: data.reason});
            }
        },
        function(error) {
            console.log('post error: ', error);
            sendResponse(res, { success: false, reason: error });
        }
    );
}

exports.handlePost= function(req, res) {
    console.log('Signin is handling post!!');
    console.log('x-forwarded-for:' + req.headers['x-forwarded-for']);
    console.log('session email is: ' , req.session.get('email'));
    
    var data = '';
    req.on('data', function(chunk) {
        data+=chunk;
    });
    
    req.on('end', function() {
        try {
            data = JSON.parse(data);
            verify(req.session, data.assertion, res);
        } catch(e) {
            sendResponse(res, { success:false, error:'non-JSON received!!!' });
            // res.end();
        } 
    });
        
    req.on('error', function(e) {
        sendResponse(res, { success: false, reason: e });
    });
    
    console.log('Verifying assertion!!!');
};