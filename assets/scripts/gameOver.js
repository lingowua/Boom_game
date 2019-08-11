
var PreGame = cc.Class({
    extends: cc.Component,

    properties: {
        btnNode: {
            default: null,
            type: cc.Node
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // score label 的引用
        highScoreDisplay: {
            default: null,
            type: cc.Label
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.director.preloadScene('game');

        var score = cc.sys.localStorage.getItem("score");
        var maxScore = cc.sys.localStorage.getItem("maxScore");
 
        if(score == null) {
            cc.sys.localStorage.setItem("score", "0");
            score = cc.sys.localStorage.getItem("score");

            cc.sys.localStorage.setItem("maxScore", "0");
            maxScore = cc.sys.localStorage.getItem("maxScore");
        }
        
        this.scoreDisplay.string = 'Score: ' + score;
        this.highScoreDisplay.string = 'High Score: ' + maxScore;
    },

    onStartGame: function () {
        cc.director.loadScene('game');
    },

});
