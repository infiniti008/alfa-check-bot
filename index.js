const base = require('./base.json');

function get_first() {
    for (var i in base) {
        return i;
    }
}

newItertion();

function newItertion() {
    var casper = require("casper").create();
    casper.start('https://easyfinance.ru/login/', function() {
        this.fillSelectors('#authentication > form', {
            '#flogin': 'nikitenok.sl@gmail.com',
            '#pass': '191190',
            '#autoLogin': false
        }, true);
    });

    // Click to button "login"
    casper.then(function() {
        this.click('#btnLogin');
    });

    // Click on buttont "add to calendar"
    casper.then(function() {
        this.click('#op_addtocalendar_but > a');
    });

    fiilInput();

    function fiilInput() {
        var i = get_first();
        console.log(Object.keys(base).length);
        var curOb = base[i];
        console.log(curOb.id);
        // Insert a cost
        casper.waitForSelector('#p_index > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable.calendar.dialogOperationPlan', function() {
            this.fillSelectors('#p_index > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable.calendar.dialogOperationPlan > form', {
                '#op_amount': curOb.cost,
                '#op_comment': curOb.text
            }, false);
        });

        // Click on field to choise account
        casper.then(function() {
            this.click('#p_index > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable.calendar.dialogOperationPlan > form > div.b-form-skeleton.b-operations-journal-options.fixed-width > div.b-row.cols2 > div.ufdSelectSimpleBox.selectAccount > div > span > input[type="text"]');
        });

        // Choise account
        casper.then(function() {
            // My card
            if (curOb.id == '5.5782') {
                this.click('#ufd-container > div:nth-child(13) > div > div > ul > li:nth-child(3)');
            }
            // Family card
            else {
                this.click('#ufd-container > div:nth-child(13) > div > div > ul > li:nth-child(1)');
            }
        });

        // Choise catrgory not inspect
        casper.then(function() {
            this.click('#op_category_fields > div > div > span > input[type="text"]');
        });
        casper.then(function() {
            this.click('#ufd-container > div:nth-child(12) > div > div > ul > li:nth-child(3)');
        });

        // Save
        casper.then(function() {
            this.click('#p_index > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable.calendar.dialogOperationPlan > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > button:nth-child(2)');
            console.log('Finished one operation');
        });

        // Wait before statrt new operation
        casper.wait(5000, function() {
            this.echo("I've waited for a 5 second.");
            delete base[i];
            var len = Object.keys(base).length
            if (len > 0) {
                console.log('Start new operation');
                fiilInput();
            } else {
                console.log('Operations doesn\'t exist');
            }
        });
    }
    casper.on('run.complete', function() {
        this.echo('Casper work completed');
        this.exit();
    });

    casper.run();
}