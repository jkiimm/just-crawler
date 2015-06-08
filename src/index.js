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

var url = 'https://ajouin.com/lecturereview1';

var childArgs = [
  path.join(__dirname, 'opic-crawler.js'),
  auth.id,
  auth.pw
];

childProcess.execFile(binPath, childArgs.concat(url), function(err, stdout, stderr) {
  console.log(err, stdout, stderr); 
});

//glob('./outputs/*.txt', function(err, files) {
//  files.forEach(function(filePath) { ttsMaker(filePath); });
//});
