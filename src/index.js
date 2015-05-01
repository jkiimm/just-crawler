var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var glob = require('glob');
var ttsMaker = require('./tts-maker');

var auth = {
    id: process.argv[2],
    pw: process.argv[3]'
};

var urls = [
  'http://m.cafe.naver.com/ArticleList.nhn?search.clubid=13227349&search.menuid=536&search.boardtype=L',
  'http://m.cafe.naver.com/ArticleList.nhn?search.clubid=13227349&search.menuid=537&search.boardtype=L',
  'http://m.cafe.naver.com/ArticleList.nhn?search.clubid=13227349&search.menuid=538&search.boardtype=L',
  'http://m.cafe.naver.com/ArticleList.nhn?search.clubid=13227349&search.menuid=539&search.boardtype=L'
];

var childArgs = [
  path.join(__dirname, 'opic-crawler.js'),
  auth.id,
  auth.pw
];

urls.forEach(function(url) {
  console.log(url);
  childProcess.execFile(binPath, childArgs.concat(url), function(err, stdout, stderr) {
    console.log(err, stdout, stderr); 
  });
});

//glob('./outputs/*.txt', function(err, files) {
//  files.forEach(function(filePath) { ttsMaker(filePath); });
//});
