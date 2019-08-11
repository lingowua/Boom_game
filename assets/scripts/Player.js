cc.Class({
    extends: cc.Component,

    properties: {
        posX: 1.6,
        posY: 21.1,
        // 主角跳跃高度
        jumpHeight: 220,
        // 主角跳跃持续时间
        jumpDuration: 1.2,
        // 跳跃音效资源
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },
        shootAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    // use this for initialization
    onLoad: function () {
        this.enabled = false;
        this.game = this.node.parent.getComponent('Game');
    },

    startGame: function () {
        this.enabled = true;
        this.leftTapVisible = true;
        this.rightTapVisible = true;
        this.node.setPosition(cc.v2(this.posX, this.posY));

        // 初始化键盘输入监听和触控监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        cc.Canvas.instance.node.on('touchstart', this.onTouchStart, this);
        cc.Canvas.instance.node.on('touchend', this.onTouchEnd, this);
    },

    onDestroy () {
        // 取消键盘输入监听和触控监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        
        cc.Canvas.instance.node.off('touchstart', this.onTouchStart, this);
        cc.Canvas.instance.node.off('touchend', this.onTouchEnd, this);
    },

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.jumpUpAction();
        }
    },

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                // 发射子弹
                this.shootAction();
        }
    },

    onTouchStart (event) {
        if (event.getLocation().x < cc.winSize.width/2) 
            this.jumpUpAction();
    },

    onTouchEnd (event) {
        if (event.getLocation().x >= cc.winSize.width/2)
            // 发射子弹
            this.shootAction();
    },

    jumpUpAction: function () {
        //只执行一次
        if (this.leftTapVisible){
            this.game.removeLeftTap();
            this.leftTapVisible = false;
        }
        //若已在执行动作就不再进入
        if (this.node.getNumberOfRunningActions() == 0){
            cc.audioEngine.playEffect(this.jumpAudio, false);

            var jumpUp = cc.jumpBy(this.jumpDuration, cc.v2(0, 0), this.jumpHeight, 1);
            // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
            var callback = cc.callFunc(this.playJumpSound, this);
            
            this.node.runAction(jumpUp);
        }
    },

    shootAction: function () {
        //只执行一次
        if (this.rightTapVisible){
            this.game.removeRightTap();
            this.rightTapVisible = false;
        }
        cc.audioEngine.playEffect(this.shootAudio, false);
        this.game.spawnNewBoom();
    },

    getCenterPos: function () {
        var centerPos = cc.v2(this.node.x, this.node.y);
        return centerPos;
    },

    stopMove: function () {
        this.node.destroy();
    },

    onCollisionEnter: function (other, self) {
        this.node.stopAllActions();
        this.onDestroy();
        this.game.gameOver();
    },

    update (dt) {

    },

});
