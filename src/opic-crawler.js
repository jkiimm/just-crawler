var page = require('webpage').create();
var fs = require('fs');
var system = require('system');
var args = system.args;
console.log(args);

var stepBunch = [{
  url: 'https://nid.naver.com/nidlogin.login',
  todo: function() {
    page.evaluate(function(id, pw) {
      var id = document.querySelector('#id').value = id;
      pw = document.querySelector('#pw').value = pw;
      document.querySelector('#frmNIDLogin').submit();
    }, args[1], args[2]);
  },
}, {
  url: args[3],
  todo: function() {
    page.evaluate(function() {
      // Javascript in Web
      var target = null,
      list = document.querySelectorAll('.lst4'); 
      
      for(var i = 0; i < list.length; i++) {
        if(list[i].className === 'lst4') {
          target = list[i].querySelector('li a');
          break;
        }
      }

      if(target) {
        var ev = document.createEvent("MouseEvents");
        ev.initEvent("click", true, true);
        target.dispatchEvent(ev);
      }
      return null;
    });

    var questions = [],
    getQuestion = function() {
      var content = page.evaluate(function() {
        return document.querySelector('#postContent').textContent; 
      });
      var str = content.match(/[a-zA-Z'].[ ,.a-zA-Z?!\n]*/g);
      console.log(str);
      return str.filter(function(el) { return el.length > 20; }).join(' ');
    },
    getTitle = function() {
      return page.evaluate(function() {
        return document.querySelector('.post_tit h2').innerHTML.trim();
      }); 
    },
    navigateNext = function() {
      return page.evaluate(function() {
        var target = document.querySelector('.post_nav .next');
        if(target) {
          var ev = document.createEvent("MouseEvents");
          ev.initEvent("click", true, true);
          target.dispatchEvent(ev);
          return true;
        }
        return false;
      });
    },
    fileWrite = function(strArr) {
      var qid = Math.floor(Math.random()*1000);
      //var qid = crypto.randomBytes(4).toString('hex');
      var text = strArr.join('\n\n');
      fs.write('./outputs/q_'+qid+'.txt', text, 'w');
      console.log('*************************** File was saved ***************************');
    };

    for(var i = 1; i <= 100; i++) {
      (function(ms) {
        setTimeout(function() {
          try {
            console.log(getTitle());
            questions.push(getQuestion());
          } catch(e) {
            phantom.exit();
          }
          if(!navigateNext()) {
            fileWrite(questions.reverse());
            phantom.exit();
          }
        }, ms*250);
      })(i);
    }

  },
}];

function handlePage(unit) {
  if(!unit) { return; }

  page.open(unit.url, function(status) {
    console.log(unit.url);
    console.log('STATUS: ' + status);

    if(status === 'success') {
      unit.todo();
    }
    window.setTimeout(nextPage, 2000); 
  });
}

function nextPage() {
  var stepUnit = stepBunch.shift();
  handlePage(stepUnit);
}

nextPage();
