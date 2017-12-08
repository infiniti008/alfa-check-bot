const base = require('./base.json');

function get_first(){
  for (var i in base) {
        return i;
//         break;
    }
}
// console.log(get_first());

newItertion();


function newItertion(){
  
  var casper = require("casper").create();
//   const base = require('./base.json');
  // console.log(base['0'].id);

  // for(var p in base){
    
    casper.start('https://easyfinance.ru/login/', function() {
        this.fillSelectors('#authentication > form', {
            '#flogin':    'nikitenok.sl@gmail.com',
            '#pass':    '191190',
            '#autoLogin': false
        }, true);
    });

    casper.then(function() {
        // Click on 1st result link
        this.click('#btnLogin');
    });

    casper.then(function() {
        // Click on 1st result link
        this.click('#op_addtocalendar_but > a');
    });
    fiilInput();
    function fiilInput(){
      var i = get_first();
      console.log(Object.keys(base).length);
      var curOb = base[i];
      console.log(curOb.id);
      //input a cost
      casper.waitForSelector('#p_index > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable.calendar.dialogOperationPlan', function() {
      //     this.captureSelector('twitter5.png', 'html');
          this.fillSelectors('#p_index > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable.calendar.dialogOperationPlan > form', {
              '#op_amount':    curOb.cost,
              '#op_comment': curOb.text
          }, false);
      });

      //Choise account alfabank myself
      casper.then(function() {
          // Click on 1st result link
          this.click('#p_index > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable.calendar.dialogOperationPlan > form > div.b-form-skeleton.b-operations-journal-options.fixed-width > div.b-row.cols2 > div.ufdSelectSimpleBox.selectAccount > div > span > input[type="text"]');
      });
      casper.then(function() {
          // Click on 1st result link
    //     my card
        if(curOb.id == '5.5782'){
          this.click('#ufd-container > div:nth-child(13) > div > div > ul > li:nth-child(3)');
        }
    //     family card
        else{
          this.click('#ufd-container > div:nth-child(13) > div > div > ul > li:nth-child(1)');
        }
      });

      //Choise catrgory not inspect
      casper.then(function() {
          // Click on 1st result link
          this.click('#op_category_fields > div > div > span > input[type="text"]');
      });
      casper.then(function() {
          // Click on 1st result link
          this.click('#ufd-container > div:nth-child(12) > div > div > ul > li:nth-child(3)');
      });

      //Save
      casper.then(function() {
          // Click on 1st result link
          this.click('#p_index > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable.calendar.dialogOperationPlan > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > button:nth-child(2)');
          console.log('finished');
      });
      
      casper.wait(5000, function() {
        this.echo("I've waited for a 5 second.");
        delete base[i];
        var len = Object.keys(base).length
        console.log(len);
        if(len > 0){
          fiilInput();
        }
        else{
          console.log('emddddd');
//           this.exit();
        }
      });
    }
    casper.on('run.complete', function() {
          this.echo('Test completed');
          this.exit();
    });

    // casper.then(function() {
    //     this.captureSelector('capture8.png', 'body');
    // });

    casper.run();
}
