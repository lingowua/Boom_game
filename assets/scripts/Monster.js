
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad () {},

    // use this for initialization
    init: function (game) {
        this.game = game;
    },

    onCollisionEnter: function (other, self) {
        this.node.destroy();
        this.game.gainScore();
    },

    update (dt) {
        if (this.node.getNumberOfRunningActions() == 0) {
            this.node.destroy();
        }
    },
});
