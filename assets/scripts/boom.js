
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad () {},

    // use this for initialization
    init: function (game) {
        this.game = game;
        cc.director.getCollisionManager().enabled = false;
        this.scheduleOnce(function(){ cc.director.getCollisionManager().enabled = true;}, 0.001);
    },

    destroyIt: function () {
        this.node.destroy();
    },

    onCollisionEnter: function (other, self) {
        this.node.destroy();
    },
});
