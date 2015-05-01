var fs = require('fs'),
  spawn = require('child_process').spawn,
  crypto = require('crypto');

var ttsMaker = module.exports = function(filePath) {
  console.log(filePath);
  var createAudio = function(sentence, i) {
    var qid = crypto.randomBytes(6).toString('hex');
    console.log('['+i+']', qid, sentence);
    spawn('./lib/GoogleTTS.py', ['-l', 'en', '-o', './outputs/audio/opic_'+qid+'.mp3', '-s', sentence]);
  };

  fs.readFile(filePath, 'utf-8', function(err, data) {
    var questions = data.split('\n\n');
    for(var i = 0; i < questions.length; i++) {
      createAudio(questions[i], i);
    }
  });
};

ttsMaker(process.argv[2]);
