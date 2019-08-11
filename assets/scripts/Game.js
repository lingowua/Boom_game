// 脚本文件名称
const Player = require('Player');
const boom = require('boom');
const claw = require('Monster');
const fly = require('Monster');
const jump = require('Monster');

var Game = cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        boomFinY: 21.1,
        boomPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 三种 monster
        flyPrefab: {
            default: null,
            type: cc.Prefab
        },
        clawPrefab: {
            default: null,
            type: cc.Prefab
        },
        jumpPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
        leftTap: {
            default: null,
            type: cc.Node
        },
        rightTap: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: Player
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        btnNode: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        // this.enabled = false;
        cc.director.getCollisionManager().enabled = true;
        // 初始化计分
        this.resetScore();
        // set game state to running
        this.enabled = true;
        // set button and gameover text out of screen
        this.btnNode.x = 3000;
        // reset player position and move speed
        this.player.startGame();

        this.schedule(function() { this.spawnEnemy(); }, 2, cc.macro.REPEAT_FOREVER, 1);
    },

    onStartGame: function () {
    },

    resetScore: function () {
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    },

    gainScore: function () {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();

        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    removeLeftTap: function () {
        this.leftTap.active = false;
    },

    removeRightTap: function () {
        this.rightTap.active = false;
    },

    spawnNewBoom: function () {
        var newBoom = newBoom = cc.instantiate(this.boomPrefab);
        newBoom.setPosition(this.player.getCenterPos());
        // pass Game instance to boom
        newBoom.getComponent('boom').init(this);

        var moveDis = this.node.width / 5 * 2;
        var boomMove1 = cc.moveBy(0.6, cc.v2(moveDis, 0)).easing(cc.easeCubicActionOut());
        var boomMove2 = cc.moveBy(0.6, cc.v2(-moveDis, 0)).easing(cc.easeCubicActionIn());
        var boomMove3 = cc.moveBy(0.6, cc.v2(-moveDis, 0)).easing(cc.easeCubicActionOut());
        var boomMove4 = cc.moveBy(0.6, cc.v2(moveDis, 0)).easing(cc.easeCubicActionIn());
        var boomAction = cc.repeatForever(cc.sequence(boomMove1, boomMove2, boomMove3, boomMove4));
        newBoom.runAction(boomAction);
        var actionBy = cc.rotateBy(1, 360);
        newBoom.runAction(cc.repeatForever(actionBy));
        var dropAction = cc.moveTo((this.player.getCenterPos().y - this.boomFinY) * 12 / this.node.height, cc.v2(0, this.boomFinY));
        newBoom.runAction(dropAction);

        this.node.addChild(newBoom);
    },

    spawnEnemy: function (dt) {
        var enemyChoose = Math.floor((Math.random()*6)+1);

        switch (enemyChoose) {
            case 1 : this.leftFlyEnemy();
                break;
            case 2 : this.rightFlyEnemy();
                break;
            case 3 :
                this.leftJumpEnemy();
                break;
            case 4 : 
                this.rightJumpEnemy();
                break;
            case 5 : 
                this.leftClawEnemy();
                break;
            case 6 : 
                this.rightClawEnemy();
                break;
            }
    },

    leftFlyEnemy: function () {
        var limit = this.node.width/12;
        var enemyPositionY = Math.random() * limit * 2;
        var newEnemy = cc.instantiate(this.flyPrefab);
        newEnemy.rotation = 180;
        newEnemy.setPosition(cc.v2(-this.node.width/2, this.boomFinY + enemyPositionY));
        newEnemy.getComponent('Monster').init(this);

        newEnemy.runAction(cc.moveBy(8.0, cc.v2(this.node.width*2, 0)));//怪物左右移动
        var delay = cc.delayTime(Math.random()*0.1);
        var enemyMove1 = cc.moveBy(0.8, cc.v2(0, -limit));
        var enemyMove2 = cc.moveBy(0.8, cc.v2(0, limit));

        newEnemy.runAction(cc.sequence(delay, enemyMove1, enemyMove2, enemyMove1, enemyMove2, enemyMove1, enemyMove2));
        this.node.addChild(newEnemy);
    },

    rightFlyEnemy: function () {
        var limit = this.node.width/12;
        var enemyPositionY = Math.random() * limit * 2;
        var newEnemy = cc.instantiate(this.flyPrefab);
        newEnemy.setPosition(cc.v2(this.node.width/2, this.boomFinY + enemyPositionY));
        newEnemy.getComponent('Monster').init(this);

        newEnemy.runAction(cc.moveBy(8.0, cc.v2(-this.node.width*2, 0)));//怪物左右移动
        var delay = cc.delayTime(Math.random()*0.1);
        var enemyMove1 = cc.moveBy(0.8, cc.v2(0, -limit));
        var enemyMove2 = cc.moveBy(0.8, cc.v2(0, limit));

        newEnemy.runAction(cc.sequence(delay, enemyMove1, enemyMove2, enemyMove1, enemyMove2, enemyMove1, enemyMove2));
        this.node.addChild(newEnemy);
    },

    leftJumpEnemy: function () {
        var newEnemy = cc.instantiate(this.jumpPrefab);
        newEnemy.setPosition(cc.v2(-this.node.width/2, -this.node.height/2 + this.node.height/8));
        newEnemy.getComponent('Monster').init(this);

        var delay = cc.delayTime(Math.random()*0.5);
        var enemyMove = cc.jumpBy(8, cc.v2(this.node.width*2, 0), this.node.height / 2.0, 10);

        newEnemy.runAction(cc.sequence(delay, enemyMove));
        this.node.addChild(newEnemy);
    },

    rightJumpEnemy: function () {
        var newEnemy = cc.instantiate(this.jumpPrefab);
        newEnemy.setPosition(cc.v2(this.node.width/2, -this.node.height/2 + this.node.height/8));
        newEnemy.getComponent('Monster').init(this);

        var delay = cc.delayTime(Math.random()*0.5);
        var enemyMove = cc.jumpBy(8, cc.v2(-this.node.width*2, 0), this.node.height / 2.0, 10);

        newEnemy.runAction(cc.sequence(delay, enemyMove));
        this.node.addChild(newEnemy);
    },

    leftClawEnemy: function () {
        var newEnemy = cc.instantiate(this.clawPrefab);
        newEnemy.setPosition(cc.v2(-this.node.width-this.node.width/21, -this.node.height/2 + this.node.height/9));
        newEnemy.getComponent('Monster').init(this);

        var delay = cc.delayTime(Math.random()*0.5);
        var enemyMove1 = cc.moveBy(4.0, cc.v2(this.node.width, 0));
        var enemyMove2 = cc.moveBy(1.0, cc.v2(0, this.node.height/2.45));
        var enemyMove3 = cc.moveBy(0.5, cc.v2(this.node.width/11, 0));
        var enemyMove4 = cc.moveBy(1.0, cc.v2(0, -this.node.height/2.45));
        var enemyMove5 = cc.moveBy(4.0, cc.v2(this.node.width, 0));
        var enemyRot1 = cc.rotateBy(0.2, 90);
        var enemyRot2 = cc.rotateBy(0.2, -90);

        newEnemy.runAction(cc.sequence(delay, enemyMove1, enemyRot2, enemyMove2, enemyRot1, enemyMove3, enemyRot1, enemyMove4, enemyRot2, enemyMove5));
        this.node.addChild(newEnemy);
    },

    rightClawEnemy: function () {
        var newEnemy = cc.instantiate(this.clawPrefab);
        newEnemy.setPosition(cc.v2(this.node.width+this.node.width/21, -this.node.height/2 + this.node.height/9));
        newEnemy.getComponent('Monster').init(this);

        var delay = cc.delayTime(Math.random()*0.5);
        var enemyMove1 = cc.moveBy(4.0, cc.v2(-this.node.width, 0));
        var enemyMove2 = cc.moveBy(1.0, cc.v2(0, this.node.height/2.45));
        var enemyMove3 = cc.moveBy(0.5, cc.v2(-this.node.width/11, 0));
        var enemyMove4 = cc.moveBy(1.0, cc.v2(0, -this.node.height/2.45));
        var enemyMove5 = cc.moveBy(4.0, cc.v2(-this.node.width, 0));
        var enemyRot1 = cc.rotateBy(0.2, -90);
        var enemyRot2 = cc.rotateBy(0.2, 90);

        newEnemy.runAction(cc.sequence(delay, enemyMove1, enemyRot2, enemyMove2, enemyRot1, enemyMove3, enemyRot1, enemyMove4, enemyRot2, enemyMove5));
        this.node.addChild(newEnemy);
    },

    // called every frame
    update: function (dt) {

    },

    gameOver: function() {
        this.unscheduleAllCallbacks();
        this.btnNode.x = 300;
        this.leftTap.active = true;
        this.rightTap.active = true;

        cc.sys.localStorage.setItem("score", this.score.toString());
        var maxScore = cc.sys.localStorage.getItem("maxScore");
        var iMax = parseInt(maxScore);
        if(this.score > iMax)
            cc.sys.localStorage.setItem("maxScore", this.score.toString());

        cc.director.loadScene('gameOver');
    },
});
