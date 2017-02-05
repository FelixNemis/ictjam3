(function (scope) {
    "use strict";

    var ICTJAM3 = scope.ICTJAM3;
    var Phaser = scope.Phaser;

    ICTJAM3.Npc = function (name, x, y, game) {
        Phaser.Sprite.call(this, game.game, x, y, name, 0);
        this.anchor.setTo(0.5, 0.5);

        game.physics.arcade.enable(this);
        this.body.immovable = true;

        this.body.setSize(20, 20, 10, 16);
        this.body.drag.setTo(1000, 1000);

        this.oneSecond = false;
        //this.game = this;
        this.text = null;
        this.timeout = null;
        this.hideText = function(){
            if(this.text) {
                this.text.kill();
                clearTimeout(this.timeout);
            }
        };
        this.exit = function(){
            this.x = 2000;
            this.y = 2000;
        }
        this.arrive = function(){
            this.x = 200;
            this.y = 200;
        }
        this.movex = function(x){
            this.x = this.x + x;
        }
        this.movey = function(y){
            this.y = this.y + y;
        }
        this.check = function(){
            var characterTextOptions = game.cache.getJSON('ictGameJamScript')[name];

            var textToSay = false;

            for (var i = 0; i < characterTextOptions.length; i++) {
                if (characterTextOptions[i].hasOwnProperty('action')) {

                    if (characterTextOptions[i].hasOwnProperty('condition')) {
                        var saveStateValue = game.stateSave.get(characterTextOptions[i].condition);
                        if (typeof saveStateValue === 'undefined' || saveStateValue === null) {
                            continue;
                        }
                        if (characterTextOptions[i].condType === 'greaterEqual') {
                            if (saveStateValue < characterTextOptions[i].condVal) {
                                textToSay = characterTextOptions[i].action;
                                continue;
                            }
                        } else if (characterTextOptions[i].condType === 'equal') {
                            console.log(saveStateValue);
                            if (saveStateValue !== characterTextOptions[i].condVal) {
                            console.log('go');
                                textToSay = characterTextOptions[i].action;
                                continue;
                            }
                        }
                    }
                }
            }
            if (textToSay) {
                if(textToSay == "exit") this.exit();
                else if(textToSay == "exit") this.exit();
                else if(textToSay == "arrive") this.exit();
                else if(textToSay == "moveright") this.movex(100);
                else if(textToSay == "moveleft") this.movex(-100);
                else if(textToSay == "moveup") this.movey(-100);
                else if(textToSay == "movedown") this.movey(100);
//                else eval(textToSay);
            }
        }

        this.talk = function() {
            if(this.oneSecond == true){
                this.hideText();
                this.oneSecond = false;
            } else {
                this.hideText();
                var characterTextOptions = game.cache.getJSON('ictGameJamScript')[name];
                var textToSay = false;
                for (var i = 0; i < characterTextOptions.length; i++) {
                    if (characterTextOptions[i].hasOwnProperty('condition')) {
                        var saveStateValue = game.stateSave.get(characterTextOptions[i].condition);
                        if (typeof saveStateValue === 'undefined' || saveStateValue === null) {
                            break;
                        }
                        if (characterTextOptions[i].condType === 'greaterEqual') {
                            if (saveStateValue >= Number(characterTextOptions[i].condValue)) {
                                textToSay = characterTextOptions[i].text;
                                break;
                            }
                        } else if (characterTextOptions[i].condType === 'equal') {
                            console.log(characterTextOptions[i].condType, saveStateValue, characterTextOptions[i].condValue);
                            if (saveStateValue === Number(characterTextOptions[i].condValue)) {
                                console.log('.');
                                textToSay = characterTextOptions[i].text;
                                break;
                            }
                        }
                    }
                }
                if (textToSay) {
                    this.text = game.world.add(new ICTJAM3.SpeechBubble(game, game.world.centerX + 35, game.world.centerY + 5, 256, textToSay));
                }
            }
            var self = this;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(function(){self.hideText(); self.oneSecond = false;}, 9000);
            setTimeout(function(){self.oneSecond = true;}, 1000);
        };
    };

    ICTJAM3.Npc.prototype = Object.create(Phaser.Sprite.prototype);
    ICTJAM3.Npc.prototype.constructor = ICTJAM3.Npc;
})(this);
