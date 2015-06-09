(function() {
  var page = require('webpage').create();
  var fs = require('fs');
  var system = require('system');
  var args = system.args;
  console.log(args);

  page.onResourceError = function(resourceError) {
    page.reason = resourceError.errorString;
    page.reason_url = resourceError.url;
  };

  var stepBunch = [{
    url: 'https://ajouin.com',
    todo: function() {
      page.evaluate(function(id, pw) {
        document.querySelector('.idpw input[name="user_id"]').value = id;
        document.querySelector('.idpw input[name="password"]').value = pw;

        document.querySelector('#fo_login_widget').submit();
      }, args[1], args[2]);
    },
  }, {
    url: args[3],
    todo: function() {
      page.evaluate(function() {
        // Javascript in Web
        var target = null,
          list = document.querySelector('tr.notice + tr'); 
         // list = document.querySelector('tbody'); 

        target = list.querySelector('.title a');
        //target = list.querySelector('tr .title a');
        //      for(var i = 0; i < list.length; i++) {
        //        if(list[i].className === '.bd_lst_wrp tbody') {
        //          target = list[i].querySelector('.title a');
        //          break;
        //        }
        //      }

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
          return document.querySelector('.xe_content').textContent; 
        });
        console.log(content);
        return content;
      },
      getTitle = function() {
        return page.evaluate(function() {
          return document.querySelector('.np_18px a').innerHTML.trim();
          //return document.querySelector('tbody  a').innerHTML.trim();
        }); 
      },
      getNextArticle = function() {
        return page.evaluate(function() {
          // var curNo = document.querySelector('.bd_lst_wrp tbody .select');
          var curNo = document.querySelector('tr.select + tr');
          var target = curNo.querySelector('.title a');
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
              //console.log(getTitle());
              questions.push(getQuestion());
            } catch(e) {
              phantom.exit();
            }
            if(!getNextArticle()) {
              fileWrite(questions.reverse());
              phantom.exit();
            }
          }, ms*2000);
        })(i);
      }

    },
  }];

  function handlePage(unit) {
    if(!unit) { return; }

    page.open(unit.url, function(status) {
      console.log(unit.url);
      console.log('STATUS: ' + status);
      //page.render(Math.floor(Math.random()*1000) + '.png');

      if(status === 'success') {
        unit.todo();
      } else {
        console.log('Error: ' + page.reason);
        phantom.exit(1);
      }
      //page.render(Math.floor(Math.random()*1000) + '.png');
      window.setTimeout(nextPage, 2500); 
    });
  }


  function nextPage() {
    var stepUnit = stepBunch.shift();
    handlePage(stepUnit);
  }

  nextPage();
})();
