var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var glob = require('glob');
//var ttsMaker = require('./tts-maker');

var auth = {
    id: process.argv[2],
    pw: process.argv[3]
};

//var origin = 'https://ajouin.com/index.php?mid=lecturereview1&';
//var urls = [];
//for(var i = 0; i < 104; i++) {
//  urls.push(origin + 'page=' + (i+1));
//}
var url = 'https://ajouin.com/lecturereview1';

var childArgs = [
  path.join(__dirname, 'opic-crawler.js'),
  auth.id,
  auth.pw
];

childProcess.execFile(binPath, childArgs.concat(url), function(err, stdout, stderr) {
  console.log(err, stdout, stderr); 
});

//urls.forEach(function(url) {
//  console.log(url);
//  childProcess.execFile(binPath, childArgs.concat(url), function(err, stdout, stderr) {
//    console.log(err, stdout, stderr); 
//  });
//});

//glob('./outputs/*.txt', function(err, files) {
//  files.forEach(function(filePath) { ttsMaker(filePath); });
//});
