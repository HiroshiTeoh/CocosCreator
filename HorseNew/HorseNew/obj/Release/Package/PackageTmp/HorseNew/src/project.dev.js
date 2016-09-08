require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"CommonUserDis":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0735cP+h7tKnJKydwamoB9n', 'CommonUserDis');
// scripts\Common\CommonUserDis.js

module.exports = {
    distance: {
        userCount: null,
        shakeNum: null,
        distancePerShake: null
    }
};

cc._RFpop();
},{}],"CommonUserIfo":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ce0443ulApFk6xC/myLyruf', 'CommonUserIfo');
// scripts\Common\CommonUserIfo.js

module.exports = {
    data: {
        userNum: null,
        command: null,
        userName: null
    }
};

cc._RFpop();
},{}],"GameOver":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2ed21Zk38JFrb0XdmRGPU0/', 'GameOver');
// scripts\GameOver.js

var dis = require('CommonUserDis');
// dis.distance.shakeNum=5;
// dis.distance.userCount=1;
// dis.distance.distancePerShake=70;
cc.Class({
    'extends': cc.Component,

    properties: {
        newUserPrefab: {
            'default': null,
            type: cc.Prefab
        },
        newHorsePrefab: {
            'default': null,
            type: cc.Prefab
        },
        scoreLabel: {
            'default': null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initSprite();
        cc.log(dis.distance);
    },
    initSprite: function initSprite() {
        var newUser = cc.instantiate(this.newUserPrefab);
        var newHorse = cc.instantiate(this.newHorsePrefab);
        if (dis.distance.shakeNum <= 5) {
            dis.distance.shakeNum -= 2;
        }
        for (var i = 0; i < dis.distance.userCount; i++) {
            newUser.setPosition(cc.p(-210, 525 - 92 * i));
            newHorse.setPosition(cc.p(dis.distance.shakeNum * dis.distance.distancePerShake + 80, 525 - 92 * i));
            this.node.addChild(newUser);
            this.node.addChild(newHorse);
        }
        this.scoreLabel.string = Math.ceil(dis.distance.shakeNum * dis.distance.distancePerShake + 80);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{"CommonUserDis":"CommonUserDis"}],"Gaming":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9f25dQ4WYJPxaSjNmzQ35KO', 'Gaming');
// scripts\Main\Gaming.js

var com = require('CommonUserIfo');
var dis = require('CommonUserDis');
cc.Class({
    'extends': cc.Component,
    properties: {

        //跑马精灵
        newHorse2: null,
        newUser: null,
        // newHorse2Array:{
        //     default:null,
        //     type:cc.Array
        // },
        horseSpritePrefab: {
            'default': null,
            type: cc.Prefab
        },
        userIfoPrefab: {
            'default': null,
            type: cc.Prefab
        },
        queueArray: {
            'default': null,
            type: cc.Array
        }, //数组用来存放算法中的点
        userCount: null,
        horseAudio: {
            'default': null,
            url: cc.AudioClip
        },
        winsize: null,
        gameData: null






    },

    // use this for initialization
    onLoad: function onLoad() {

        dis.distance.userCount = com.data.userNum;
        //初始化跑马距离
        this.winsize = this.node.width;
        this.gameData = JSON.parse(cc.sys.localStorage.getItem('gameData'));
        if (this.gameData.shakeNum == "") {
            this.gameData.shakeNum = "50";
        }

        //初始化精灵数组并加载
        this.initSprite();

        //单例精灵对象初始化并加载
        // this.newHorse2=cc.instantiate(this.horseSpritePrefab);
        // this.node.addChild(this.newHorse2);

        //监听手机
        this.addListener();
    },
    addListener: function addListener() {
        //初始化坐标数组
        this.queueArray = [];
        var shakeCount = 1;
        var self = this;
        //cc.log(ws)
        var ws = new WebSocket("ws://127.0.0.1:2200");
        ws.send("Move," + self.gameData.command + com.data[2]);
        ws.onmessage = function (event) {
            cc.log(event.data);
        };
        cc.log(ws);
        cc.log("ws readyState" + ws.readyState);

        cc.inputManager.setAccelerometerInterval(1 / 7);
        //使用加速计事件监听器之前，需要先启用此硬件设备
        cc.inputManager.setAccelerometerEnabled(true);
        var listener = {
            event: cc.EventListener.ACCELERATION,
            callback: function callback(accelEvent, event) {
                var target = event.getCurrentTarget();

                //获取到当前的节点组件
                target = target.getComponent("Gaming");

                //进行收集重力位置的记录
                this.x = accelEvent.x;
                this.y = accelEvent.y;
                this.z = accelEvent.z;

                var tempLength = target.queueArray.length;
                if (tempLength < 7) {
                    // target.queueArray.push({xPos:Math.ceil(accelEvent.x),yPos:Math.ceil(accelEvent.y),zPos:Math.ceil(accelEvent.z)});
                    target.queueArray.push({ xPos: accelEvent.x, yPos: accelEvent.y, zPos: accelEvent.z });

                    //用来裁剪数组
                    // target.queueArray.splice(6,tempLength-1);
                    //cc.log("Node:", self.node.children)
                    //target.newHorse2.x += 10;
                    // target.score2Display.string=("("+Math.ceil(target.queueArray[0].xPos)+","+Math.ceil(target.queueArray[0].yPos)+","+Math.ceil(target.queueArray[0].zPos)+")")
                    //判断是否进行了摇动
                    if (target.isShake(this.x, this.y, this.z)) {
                        //var ws = new WebSocket("ws://127.0.0.1:2200");
                        ws.send("Move," + self.gameData.command + com.data[2]);
                        ws.onmessage = function (event) {
                            cc.log("eventdata:" + event.data);
                            shakeCount++;
                            dis.distance.shakeNum = shakeCount / 4;
                            dis.distance.distancePerShake = target.winsize / target.gameData.shakeNum / 5;

                            //记录用户摇手机的数据
                            target.newHorse2.x += target.winsize / target.gameData.shakeNum / 5;
                            cc.audioEngine.playEffect(target.horseAudio, false);
                            target.queueArray.splice(0, tempLength);
                        };
                    } else {
                        // target.queueArray.splice(0,tempLength-1);
                        cc.audioEngine.pauseAllEffects();
                    }
                } else {
                    target.queueArray.splice(0, tempLength);
                }
            }

        };
        cc.eventManager.addListener(listener, this.node);
    },

    //初始化精灵数组并加载
    initSprite: function initSprite() {

        // this.newHorse2Array=[];    
        cc.log("data:" + com.data.length);
        // for(var i=0;i<com.data.userNum;i++){
        for (var i = 0; i < com.data.length - 3; i++) {

            this.newHorse2 = cc.instantiate(this.horseSpritePrefab);
            this.newUser = cc.instantiate(this.userIfoPrefab);
            this.newHorse2.tag = i;

            this.newHorse2.setPosition(cc.p(-280, 520 + -92 * i));
            this.newUser.setPosition(cc.p(-150, 525 + -92 * i));

            this.newUser.children[0].getComponent(cc.Label).string = "[" + com.data[i + 2].substr(0, 8) + "]";

            this.node.addChild(this.newHorse2);
            this.node.addChild(this.newUser);
        }
        cc.log(this);
    },
    //判断是否进行了摇动
    isShake: function isShake(xPre, yPre, zPre) {
        //参数用来记录当前的坐标

        //for (var i = 0; i < this.queueArray.length; i++) {

        //    if (Math.abs(this.queueArray[i].xPos - xPre) > 0.2 || Math.abs(this.queueArray[i].yPos - yPre) > 0.2 || Math.abs(this.queueArray[i].zPos - zPre) > 0.2) {
        //        xPre = this.queueArray[i].xPos;
        //        yPre = this.queueArray[i].yPos;
        //        zPre = this.queueArray[i].zPos;
        //        return true;
        //    } else {
        //        return false;
        //    }
        //}
        return true;
    },

    update: function update(dt) {

        //结束判断场景跳转
        if (this.newHorse2.x > this.winsize / 2 - 120) {
            cc.director.loadScene('GameOver');
            cc.audioEngine.pauseAllEffects();
            cc.audioEngine.unloadEffect(cc.horseAudio);
        }
        dis.distance.shakeNum++;
    }

});

cc._RFpop();
},{"CommonUserDis":"CommonUserDis","CommonUserIfo":"CommonUserIfo"}],"Index":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9ccdb+bf0xCUb+VflvRAu7h', 'Index');
// scripts\Index.js

var appId = "wx673145934e1ff68f";
var appSecret = "2385e9446f095435be35a07b0ef25748";
var code = "";
var Nick = "zhangsan";
var Sex = "nan";
cc.Class({
    "extends": cc.Component,

    properties: {
        StartBtn: {
            "default": null,
            type: cc.Button
        },
        clickPlayAudio: {
            "default": null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {

        this.startCallBack(event);
        //cc.log(this.getCode());
        //cc.log(this.getToken());
        if (url[0] == "?Skip" && url[1] != "" && access != "4") {
            cc.director.loadScene("Waiting");
        }
    },
    startCallBack: function startCallBack(event) {
        cc.log("StartBtn:", this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            var target = event.getCurrentTarget();
            target = target.getComponent("Index");
            cc.audioEngine.playEffect(target.clickPlayAudio, false);
            cc.director.loadScene("Setting");
        });
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            var target = event.getCurrentTarget();
            target = target.getComponent("Index");
            cc.audioEngine.playEffect(target.clickPlayAudio, false);
            cc.director.loadScene("Setting");
        });
    },
    getCode: function getCode() {
        var url = window.location.pathname;
        cc.log(url);
        var tempCode = url.split(":");
        // code=tempCode[2].split("=");
        return tempCode;
    },
    getToken: function getToken(appId, appSecret, code) {
        // var token=$.get("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appId + "&secret=" + appSecret + "&code=" + code + "&grant_type=authorization_code")
        var xmlhttp;
        // xmlhttp=new XMLHttpRequest();
        // xmlhttp.open("GET","https://www.baidu.com/",true)
        // xmlhttp.send();
        // $.ajax({
        // type: "post",
        // contentType: "application/json",
        // url: "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appId + "&secret=" + appSecret + "&code=" + code + "&grant_type=authorization_code",
        // data: "{iUnid:"+1+"}",
        // dataType: 'json',
        // success: function(data) {
        //     var tt = '';
        //     var jsonObject = $.jsonToObject(data.d);
        //     $.each(jsonObject, function(k, v) {
        //         $.each(v, function(kk, vv) {
        //             tt += kk + "：" + vv + "<br/>";
        //         });
        //     });
        //     cc.log(tt)
        // }
        //});

        // return xmlhttp.responseText;
    },
    commandCallBack: function commandCallBack() {
        cc.log(this.node);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"Setting-BacBtn":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5b2c8nFtstKW5ehhZBhy6aE', 'Setting-BacBtn');
// scripts\Setting\Setting-BacBtn.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        BackBtn: {

            "default": null,
            type: cc.Button
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.backCallBack(event);
    },
    backCallBack: function backCallBack(event) {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            cc.director.loadScene("Index");
        });
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.director.loadScene("Index");
        });
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"Setting-EditBox":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0169fjydXlEKrEM01n82dQK', 'Setting-EditBox');
// scripts\Setting\Setting-EditBox.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        NameEd: {
            "default": null,
            type: cc.EditBox
        },
        ShakeNumEd: {
            "default": null,
            type: cc.EditBox
        },
        CommandEd: {
            "default": null,
            type: cc.EditBox
        },
        gameData: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        //this.gameData = {
        //    name: "",
        //    shakeNum: "",
        //    command: "",
        //    user: "Admin"
        //};
        Command = "Admin";
    },
    NameEdCallBack: function NameEdCallBack() {
        this.gameData = {
            name: this.NameEd.string,
            shakeNum: this.ShakeNumEd.string,
            command: this.CommandEd.string,
            user: "Admin"
        };
        // this.gameData.name=this.NameEd.string;

        cc.sys.localStorage.setItem('gameData', JSON.stringify(this.gameData));
        cc.log(this.gameData);
    },
    ShakeNumEdCallBack: function ShakeNumEdCallBack() {
        this.gameData = {
            name: this.NameEd.string,
            shakeNum: this.ShakeNumEd.string,
            command: this.CommandEd.string,
            user: "Admin"
        };
        // this.gameData.shakeNum=this.ShakeNumEd.string;
        cc.sys.localStorage.setItem('gameData', JSON.stringify(this.gameData));
        cc.log(this.gameData);
    },
    CommandEdCallBack: function CommandEdCallBack() {
        this.gameData = {
            name: this.NameEd.string,
            shakeNum: this.ShakeNumEd.string,
            command: this.CommandEd.string,
            user: "Admin"
        };
        // this.gameData.command=this.CommandEd.string;
        cc.sys.localStorage.setItem('gameData', JSON.stringify(this.gameData));
        cc.log(this.gameData);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"Setting-SubBtn":[function(require,module,exports){
"use strict";
cc._RFpush(module, '93034PECJVJE62cw482XQ7i', 'Setting-SubBtn');
// scripts\Setting\Setting-SubBtn.js

cc.Class({
    "extends": cc.Component,

    properties: {
        SubmitBtn: {
            "default": null,
            type: cc.Button
        },
        NameEd: {
            "default": null,
            type: cc.EditBox
        },
        ShakeNumEd: {
            "default": null,
            type: cc.EditBox
        },
        CommandEd: {
            "default": null,
            type: cc.EditBox
        },
        clickAudio: {
            "default": null,
            url: cc.AudioClip
        },
        DataTemp: null

    },
    // use this for initialization
    onLoad: function onLoad() {
        this.startCallBack(event);
        access = "admin";
    },
    startCallBack: function startCallBack(event) {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            var target = event.getCurrentTarget();
            target = target.getComponent("Setting-SubBtn");
            cc.audioEngine.playEffect(target.clickAudio, false);
            cc.director.loadScene("Waiting");
        });
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            var target = event.getCurrentTarget();
            target = target.getComponent("Setting-SubBtn");
            cc.audioEngine.playEffect(target.clickAudio, false);
            cc.director.loadScene("Waiting");
        });
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"Waiting-BacBtn":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f457debQaZP0o0zbY5xgp5e', 'Waiting-BacBtn');
// scripts\Waiting\Waiting-BacBtn.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        BackBtn: {
            "default": null,
            type: cc.Button
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.startCallBack(event);
    },
    startCallBack: function startCallBack(event) {
        var self = this;
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            // self.websocket();
            cc.director.loadScene("Setting");
        });
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            // self.websocket();   
            cc.director.loadScene("Setting");
        });
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"Waiting-GoBtn":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5acc6Qkj0hEvLmsNCMEivZS', 'Waiting-GoBtn');
// scripts\Waiting\Waiting-GoBtn.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        GoBtn: {
            "default": null,
            type: cc.Button
        },
        clickAudio: {
            "default": null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {

        this.startCallBack(event);
    },
    startCallBack: function startCallBack(event) {}

    //this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
    //    var target = event.getCurrentTarget();
    //    target = target.getComponent("Waiting-GoBtn");
    //    cc.audioEngine.playEffect(target.clickAudio, false);
    //    cc.director.loadScene("Gaming");
    //});
    //this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
    //    var target = event.getCurrentTarget();
    //    target = target.getComponent("Waiting-GoBtn");
    //    cc.audioEngine.playEffect(target.clickAudio, false);
    //    cc.director.loadScene("Gaming");
    //});

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"Waiting":[function(require,module,exports){
"use strict";
cc._RFpush(module, '104cdXWrFhJpK8B1KMWxImA', 'Waiting');
// scripts\Waiting\Waiting.js

var com = require('CommonUserIfo');
var dis = require('CommonUserDis');
var horsearray = new Array();
// 测试一下git仓库
cc.Class({
    'extends': cc.Component,
    properties: {

        //跑马精灵
        newHorse2: null,
        newUser: null,
        queueArray: {
            'default': null,
            type: cc.Array
        }, //数组用来存放算法中的点
        horseSpritePrefab: {
            'default': null,
            type: cc.Prefab
        },
        horse2SpritePrefab: {
            'default': null,
            type: cc.Prefab
        },
        //用户信息
        userIfoPrefab: {
            'default': null,
            type: cc.Prefab
        },
        userCount: null,
        winsize: null,
        gameData: null,
        //遮罩层
        MaskSprite: {
            'default': null,
            type: cc.Sprite
        },
        NumLabel: {
            'default': null,
            type: cc.Label
        },
        MessageLabel: {
            'default': null,
            type: cc.Label
        },
        //遮罩层二
        Load2Mask: {
            'default': null,
            type: cc.Sprite
        },
        NumLabel2: {
            'default': null,
            type: cc.Label
        },
        MessageLabel2: {
            'default': null,
            type: cc.Label
        },
        GameOverMask: {
            'default': null,
            type: cc.Label
        },
        RankLabel: {
            'default': null,
            type: cc.Label
        },
        ScoreLabel: {
            'default': null,
            type: cc.Label
        },
        BackBtn: {
            'default': null,
            type: cc.Button
        },
        BeginBtn: {
            'default': null,
            type: cc.Button
        },
        MoreBtn: {
            'default': null,
            type: cc.Button
        },
        length: null,
        ws: null,
        temphorse: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        //用户数量统计计数

        //临时变量记录data值

        this.winsize = this.node.width;
        this.gameData = JSON.parse(cc.sys.localStorage.getItem('gameData'));

        //初始化精灵数组并加载
        // this.initSprite();
        com.data.userNum = 0;
        com.data.userName = null;
        this.webSocket();
    },
    webSocket: function webSocket() {
        var ws = new WebSocket("ws://192.168.0.25:2200");
        cc.log(ws);
        var self = this;
        //退出等待大厅及时刷新
        this.BackBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            ws.close();
        });
        //主持人点击开赛所有人响应
        this.BeginBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("开赛");
            ws.send("BeginGame," + url[1] + "," + self.gameData.shakeNum);
        });
        ws.onopen = function (event) {
            cc.log("通讯连接成功！");
            if (Command == "Admin") {
                ws.send("Open," + self.gameData.command);
            } else {
                ws.send("Open," + url[1]);
            }
        };
        ws.onmessage = function (event) {
            length = event.data.split("/").length - 2;

            // cc.log(event.data)
            // cc.log(ws.readyState)
            self.userCount = length;
            var data = event.data.split("/");
            com.data = data;
            cc.log("dataData:" + com.data);
            //连接消息处理
            if (event.data[0] == "0") {
                horsearray = new Array();
                self.node.children[1].removeAllChildren();
                for (var i = 0; i < length; i++) {
                    //添加刚进行连接的用户跑马精灵
                    self.newHorse2 = cc.instantiate(self.horseSpritePrefab);
                    self.newUser = cc.instantiate(self.userIfoPrefab);
                    //定义需要加入到跑马场景的单例对象
                    var temp = { id: data[i + 1].substr(0, 8), sprite: cc.instantiate(self.horse2SpritePrefab), user: self.newUser };
                    horsearray.push(temp);
                    cc.log(horsearray);
                    //进行唯一标识
                    self.newHorse2.tag = data[i + 1];
                    self.newUser.tag = data[i + 1] + "user";
                    // cc.log(this.newHorse2);
                    //设置跑马进来的站位
                    self.newHorse2.setPosition(cc.p(-120, 525 + -92 * i));
                    self.newUser.setPosition(cc.p(-410, 525 + -92 * i));
                    //展示用户的唯一ID
                    // self.newUser.children[0].getComponent(cc.Label).string="["+data[i*2+2].substr(0,8)+"]"
                    self.newUser.children[0].getComponent(cc.Label).string = data[i + 1].substr(0, 8);
                    self.node.children[1].addChild(self.newHorse2);
                    self.node.children[1].addChild(self.newUser);
                }
                //判断是否是网页输入了正确口令
                if (url[0] == "?Skip" && url[1] != "" && access != "4") {
                    if (access == "token") {
                        self.gameData = {
                            name: self.gameData.name,
                            shakeNum: self.gameData.shakeNum,
                            command: self.gameData.command,
                            user: "User"
                        };
                        cc.sys.localStorage.setItem('gameData', JSON.stringify(this.gameData));
                        cc.log(self.gameData);
                    }

                    //遮罩数据
                    if (Command == "Admin" && access != "token") {
                        self.MaskSprite.node.opacity = 180;
                        self.MaskSprite.node.zIndex = 1;
                        //self.node.removeChild(self.node.children[3]);
                    } else {
                            self.Load2Mask.node.opacity = 180;
                            self.Load2Mask.node.zIndex = 1;
                            self.node.removeChild(self.node.children[2]);
                        }
                    //用户数量格式修改
                    if (self.userCount < 10) {
                        self.userCount = "00" + self.userCount;
                    } else if (self.userCount >= 10 && self.userCount <= 99) {
                        self.userCount = "0" + self.userCount;
                    }
                    //管理员遮罩层数据
                    self.NumLabel.string = self.userCount;
                    self.MessageLabel.string = "已有" + self.userCount + "位好友准备就绪";
                    //用户遮罩层数据
                    self.NumLabel2.string = self.userCount;
                    self.MessageLabel2.string = "已有" + self.userCount + "位好友准备就绪";
                }
            }
            //退出消息处理
            else if (event.data[0] == "1") {
                    //先清除所有用户
                    self.node.children[1].removeAllChildren();
                    horsearray = new Array();
                    //添加没有退出大厅的用户
                    for (var j = 0; j < length; j++) {
                        self.newHorse2 = cc.instantiate(self.horseSpritePrefab);
                        self.newUser = cc.instantiate(self.userIfoPrefab);

                        var temp = { id: data[j + 1].substr(0, 8), sprite: self.newHorse2, user: self.newUser };
                        horsearray.push(temp);

                        // cc.log(this.newHorse2);
                        self.newHorse2.setPosition(cc.p(-120, 525 + -92 * j));
                        self.newUser.setPosition(cc.p(-410, 525 + -92 * j));
                        self.newUser.children[0].getComponent(cc.Label).string = data[j + 1].substr(0, 8);
                        self.node.children[1].addChild(self.newHorse2);
                        self.node.children[1].addChild(self.newUser);
                    }
                    if (url[0] == "?Skip" && url[1] != "" && access != "4") {
                        if (access == "token") {
                            self.gameData = {
                                name: "",
                                shakeNum: "",
                                command: "",
                                user: "User"
                            };
                        }

                        //遮罩数据
                        if (Command == "Admin" && access != "token") {
                            self.MaskSprite.node.opacity = 180;
                            self.MaskSprite.node.zIndex = 1;
                        } else {
                            self.Load2Mask.node.opacity = 180;
                            self.Load2Mask.node.zIndex = 1;
                            self.node.removeChild(self.node.children[2]);
                        }
                        //用户数量格式修改
                        if (self.userCount < 10) {
                            self.userCount = "00" + self.userCount;
                        } else if (self.userCount >= 10 && self.userCount <= 99) {
                            self.userCount = "0" + self.userCount;
                        }
                        //管理员遮罩层数据
                        self.NumLabel.string = self.userCount;
                        self.MessageLabel.string = "已有" + self.userCount + "位好友准备就绪";
                        //用户遮罩层数据
                        self.NumLabel2.string = self.userCount;
                        self.MessageLabel2.string = "已有" + self.userCount + "位好友准备就绪";
                    }
                } else if (event.data[0] == "2") {
                    //进入跑马界面
                    self.MaskSprite.node.opacity = 0;
                    self.Load2Mask.node.opacity = 0;

                    self.node.children[1].removeAllChildren();
                    self.initSprite();
                    self.addListener(ws);
                    shakeNum = data[length + 1];
                }
        };
        ws.onerror = function (event) {
            cc.log("Send Text fired an error");
        };
        ws.onclose = function (event) {
            cc.log("WebSocket instance closed.");
        };
    },
    //重力监听函数
    addListener: function addListener(ws) {
        //初始化坐标数组
        this.queueArray = [];
        var shakeCount = 1;
        var self = this;

        cc.inputManager.setAccelerometerInterval(1 / 7);
        //使用加速计事件监听器之前，需要先启用此硬件设备
        cc.inputManager.setAccelerometerEnabled(true);
        var listener = {
            event: cc.EventListener.ACCELERATION,
            callback: function callback(accelEvent, event) {
                var target = event.getCurrentTarget();

                //获取到当前的节点组件
                target = target.getComponent("Waiting");

                //进行收集重力位置的记录
                this.x = accelEvent.x;
                this.y = accelEvent.y;
                this.z = accelEvent.z;

                var tempLength = target.queueArray.length;
                if (tempLength < 7) {
                    // target.queueArray.push({xPos:Math.ceil(accelEvent.x),yPos:Math.ceil(accelEvent.y),zPos:Math.ceil(accelEvent.z)});
                    target.queueArray.push({ xPos: accelEvent.x, yPos: accelEvent.y, zPos: accelEvent.z });
                } else {
                    target.queueArray.splice(0, tempLength);
                }

                    //用来裁剪数组
                    //target.queueArray.splice(6, tempLength - 1);
                    //判断是否进行了摇动
                    if (target.isShake(this.x, this.y, this.z)) {
                        //处理发送过得移动数据
                        ws.send("Move,");
                        shakeCount++;
                    } else {
                        cc.audioEngine.pauseAllEffects();
                    }
                    ws.onmessage = function (event) {

                        dis.distance.shakeNum = shakeCount / 4;
                        dis.distance.distancePerShake = target.winsize / parseInt(shakeNum) / 5;

                        //记录用户摇手机的数据
                        var data = event.data.split("/");
                        //遍历数组进行寻找跑马
                        for (var horse in horsearray) {
                            if (horsearray[horse].sprite.x >= 280) {
                                if (Command == "Admin") {
                                    self.MoreBtn.node.opacity = 255;
                                    self.MoreBtn.node.on(cc.Node.EventType.TOUCH_START, function (event) {
                                        cc.director.loadScene("Public");
                                    });
                                }
                                cc.log(horsearray);
                                ws.send("temphorse,");
                                ws.onmessage = function (event) {
                                    var data = event.data.split("/");
                                    if (data[0] == "temphorse") {

                                        horsearray.sort(self.sortBy("sprite"));

                                        for (var horse in horsearray) {
                                            if (horsearray[horse].id == data[1].substr(0, 8)) {
                                                //展示结束数据
                                                var rank = horse;
                                                rank++;
                                                cc.log(horsearray);
                                                self.GameOverMask.node.opacity = 255;
                                                self.RankLabel.string = "第" + rank + "名";
                                                self.ScoreLabel.string = Math.floor((horsearray[horse].sprite.x + 280) / 2);

                                            }

                                        }
                                    }
                                };

                                cc.eventManager.removeListeners(cc.EventListener.ACCELERATION);
                            } else {
                                if (horsearray[horse].id == data[1].substr(0, 8)) {
                                    horsearray[horse].sprite.x += dis.distance.distancePerShake;
                                    cc.audioEngine.playEffect(target.horseAudio, false);
                                    target.queueArray.splice(0, tempLength);
                                }
                            }

                        }
                    };
            }
        };
        cc.eventManager.addListener(listener, this.node);
    },
    //排序
    sortBy: function sortBy(field) {
        return function (a, b) {
            return b.sprite.x - a.sprite.x;
        };
    },
    //初始化精灵数组并加载
    initSprite: function initSprite() {
        this.node.children[1].removeAllChildren();
        // for(var i=0;i<com.data.userNum;i++){
        var arraylength = horsearray.length;
        cc.log(arraylength);
        for (var i = 0; i < arraylength; i++) {

            //this.newHorse2 = cc.instantiate(this.horse2SpritePrefab);
            //this.newUser = cc.instantiate(this.userIfoPrefab);
            //this.newHorse2.tag = i;

            horsearray[i].sprite.setPosition(cc.p(-280, 520 + -92 * i));
            horsearray[i].user.setPosition(cc.p(-150, 525 + -92 * i));

            this.newUser.children[0].getComponent(cc.Label).string = horsearray[i].id;

            this.node.addChild(horsearray[i].sprite);
            this.node.addChild(horsearray[i].user);
        }
    },
    //判断是否进行了摇动
    isShake: function isShake(xPre, yPre, zPre) {
        //参数用来记录当前的坐标

        for (var i = 0; i < this.queueArray.length; i++) {

            if (Math.abs(this.queueArray[i].xPos - xPre) > 0.2 || Math.abs(this.queueArray[i].yPos - yPre) > 0.2 || Math.abs(this.queueArray[i].zPos - zPre) > 0.2) {
                xPre = this.queueArray[i].xPos;
                yPre = this.queueArray[i].yPos;
                zPre = this.queueArray[i].zPos;
                return true;
            } else {
                return false;
            }
        }
    },
    update: function update(dt) {
        //for (var horse in horsearray) {
        //    if (horsearray[horse].sprite.x >= 270) {
        //        cc.log(horsearray)
        //    }
        //}
    }
});

cc._RFpop();
},{"CommonUserDis":"CommonUserDis","CommonUserIfo":"CommonUserIfo"}],"dbConn":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2a266Lx+/5A2aQBeO6J0kHh', 'dbConn');
// scripts\SQLite\dbConn.js

// var mysql=require("mysql");

// var conn=mysql.createConnection({
//     host:'192.168.1.58',
//     user:'root',
//     password:'123456',
//     database:'smsp'
// });
// conn.connect();
// conn.query('select * from member',
// function(err,rows,fields){
//     for(var row of rows){
//         var result='';
//         for(var field of fields){
//             result+=(''+row[field.name]);
//         }
//         console.log(result);
//     }
// });
// conn.end();

cc._RFpop();
},{}],"horseSprite":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9132bnAbg1PW7IwOCSKHiPk', 'horseSprite');
// scripts\Sprite\horseSprite.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        xPos: 0,
        yPos: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        var anim = this.getComponent(cc.Animation);
        var animState = anim.play('horseAnimation');

        // 设置动画循环次数为无限次
        animState.repeatCount = Infinity;
        animState.speed = 1.2;
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}]},{},["Setting-EditBox","CommonUserDis","Waiting","dbConn","GameOver","Waiting-GoBtn","Setting-BacBtn","horseSprite","Setting-SubBtn","Index","Gaming","CommonUserIfo","Waiting-BacBtn"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNjcmlwdHMvQ29tbW9uL0NvbW1vblVzZXJEaXMuanMiLCJzY3JpcHRzL0NvbW1vbi9Db21tb25Vc2VySWZvLmpzIiwic2NyaXB0cy9HYW1lT3Zlci5qcyIsInNjcmlwdHMvTWFpbi9HYW1pbmcuanMiLCJzY3JpcHRzL0luZGV4LmpzIiwic2NyaXB0cy9TZXR0aW5nL1NldHRpbmctQmFjQnRuLmpzIiwic2NyaXB0cy9TZXR0aW5nL1NldHRpbmctRWRpdEJveC5qcyIsInNjcmlwdHMvU2V0dGluZy9TZXR0aW5nLVN1YkJ0bi5qcyIsInNjcmlwdHMvV2FpdGluZy9XYWl0aW5nLUJhY0J0bi5qcyIsInNjcmlwdHMvV2FpdGluZy9XYWl0aW5nLUdvQnRuLmpzIiwic2NyaXB0cy9XYWl0aW5nL1dhaXRpbmcuanMiLCJzY3JpcHRzL1NRTGl0ZS9kYkNvbm4uanMiLCJzY3JpcHRzL1Nwcml0ZS9ob3JzZVNwcml0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMDczNWNQK2g3dEtuSkt5ZHdhbW9COW4nLCAnQ29tbW9uVXNlckRpcycpO1xuLy8gc2NyaXB0c1xcQ29tbW9uXFxDb21tb25Vc2VyRGlzLmpzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGRpc3RhbmNlOiB7XG4gICAgICAgIHVzZXJDb3VudDogbnVsbCxcbiAgICAgICAgc2hha2VOdW06IG51bGwsXG4gICAgICAgIGRpc3RhbmNlUGVyU2hha2U6IG51bGxcbiAgICB9XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnY2UwNDQzdWxBcEZrNnhDL215THlydWYnLCAnQ29tbW9uVXNlcklmbycpO1xuLy8gc2NyaXB0c1xcQ29tbW9uXFxDb21tb25Vc2VySWZvLmpzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGRhdGE6IHtcbiAgICAgICAgdXNlck51bTogbnVsbCxcbiAgICAgICAgY29tbWFuZDogbnVsbCxcbiAgICAgICAgdXNlck5hbWU6IG51bGxcbiAgICB9XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMmVkMjFaazM4SkZyYjBYZG1SR1BVMC8nLCAnR2FtZU92ZXInKTtcbi8vIHNjcmlwdHNcXEdhbWVPdmVyLmpzXG5cbnZhciBkaXMgPSByZXF1aXJlKCdDb21tb25Vc2VyRGlzJyk7XG4vLyBkaXMuZGlzdGFuY2Uuc2hha2VOdW09NTtcbi8vIGRpcy5kaXN0YW5jZS51c2VyQ291bnQ9MTtcbi8vIGRpcy5kaXN0YW5jZS5kaXN0YW5jZVBlclNoYWtlPTcwO1xuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBuZXdVc2VyUHJlZmFiOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgbmV3SG9yc2VQcmVmYWI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICBzY29yZUxhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmluaXRTcHJpdGUoKTtcbiAgICAgICAgY2MubG9nKGRpcy5kaXN0YW5jZSk7XG4gICAgfSxcbiAgICBpbml0U3ByaXRlOiBmdW5jdGlvbiBpbml0U3ByaXRlKCkge1xuICAgICAgICB2YXIgbmV3VXNlciA9IGNjLmluc3RhbnRpYXRlKHRoaXMubmV3VXNlclByZWZhYik7XG4gICAgICAgIHZhciBuZXdIb3JzZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMubmV3SG9yc2VQcmVmYWIpO1xuICAgICAgICBpZiAoZGlzLmRpc3RhbmNlLnNoYWtlTnVtIDw9IDUpIHtcbiAgICAgICAgICAgIGRpcy5kaXN0YW5jZS5zaGFrZU51bSAtPSAyO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlzLmRpc3RhbmNlLnVzZXJDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBuZXdVc2VyLnNldFBvc2l0aW9uKGNjLnAoLTIxMCwgNTI1IC0gOTIgKiBpKSk7XG4gICAgICAgICAgICBuZXdIb3JzZS5zZXRQb3NpdGlvbihjYy5wKGRpcy5kaXN0YW5jZS5zaGFrZU51bSAqIGRpcy5kaXN0YW5jZS5kaXN0YW5jZVBlclNoYWtlICsgODAsIDUyNSAtIDkyICogaSkpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld1VzZXIpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld0hvcnNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjb3JlTGFiZWwuc3RyaW5nID0gTWF0aC5jZWlsKGRpcy5kaXN0YW5jZS5zaGFrZU51bSAqIGRpcy5kaXN0YW5jZS5kaXN0YW5jZVBlclNoYWtlICsgODApO1xuICAgIH1cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5ZjI1ZFE0V1lKUHhhU2pObXpRMzVLTycsICdHYW1pbmcnKTtcbi8vIHNjcmlwdHNcXE1haW5cXEdhbWluZy5qc1xuXG52YXIgY29tID0gcmVxdWlyZSgnQ29tbW9uVXNlcklmbycpO1xudmFyIGRpcyA9IHJlcXVpcmUoJ0NvbW1vblVzZXJEaXMnKTtcbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgLy/ot5Hpqaznsr7ngbVcbiAgICAgICAgbmV3SG9yc2UyOiBudWxsLFxuICAgICAgICBuZXdVc2VyOiBudWxsLFxuICAgICAgICAvLyBuZXdIb3JzZTJBcnJheTp7XG4gICAgICAgIC8vICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgIC8vICAgICB0eXBlOmNjLkFycmF5XG4gICAgICAgIC8vIH0sXG4gICAgICAgIGhvcnNlU3ByaXRlUHJlZmFiOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgdXNlcklmb1ByZWZhYjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG4gICAgICAgIHF1ZXVlQXJyYXk6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkFycmF5XG4gICAgICAgIH0sIC8v5pWw57uE55So5p2l5a2Y5pS+566X5rOV5Lit55qE54K5XG4gICAgICAgIHVzZXJDb3VudDogbnVsbCxcbiAgICAgICAgaG9yc2VBdWRpbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgd2luc2l6ZTogbnVsbCxcbiAgICAgICAgZ2FtZURhdGE6IG51bGxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG5cbiAgICAgICAgZGlzLmRpc3RhbmNlLnVzZXJDb3VudCA9IGNvbS5kYXRhLnVzZXJOdW07XG4gICAgICAgIC8v5Yid5aeL5YyW6LeR6ams6Led56a7XG4gICAgICAgIHRoaXMud2luc2l6ZSA9IHRoaXMubm9kZS53aWR0aDtcbiAgICAgICAgdGhpcy5nYW1lRGF0YSA9IEpTT04ucGFyc2UoY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdnYW1lRGF0YScpKTtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZURhdGEuc2hha2VOdW0gPT0gXCJcIikge1xuICAgICAgICAgICAgdGhpcy5nYW1lRGF0YS5zaGFrZU51bSA9IFwiNTBcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8v5Yid5aeL5YyW57K+54G15pWw57uE5bm25Yqg6L29XG4gICAgICAgIHRoaXMuaW5pdFNwcml0ZSgpO1xuXG4gICAgICAgIC8v5Y2V5L6L57K+54G15a+56LGh5Yid5aeL5YyW5bm25Yqg6L29XG4gICAgICAgIC8vIHRoaXMubmV3SG9yc2UyPWNjLmluc3RhbnRpYXRlKHRoaXMuaG9yc2VTcHJpdGVQcmVmYWIpO1xuICAgICAgICAvLyB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5uZXdIb3JzZTIpO1xuXG4gICAgICAgIC8v55uR5ZCs5omL5py6XG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIoKTtcbiAgICB9LFxuICAgIGFkZExpc3RlbmVyOiBmdW5jdGlvbiBhZGRMaXN0ZW5lcigpIHtcbiAgICAgICAgLy/liJ3lp4vljJblnZDmoIfmlbDnu4RcbiAgICAgICAgdGhpcy5xdWV1ZUFycmF5ID0gW107XG4gICAgICAgIHZhciBzaGFrZUNvdW50ID0gMTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvL2NjLmxvZyh3cylcbiAgICAgICAgdmFyIHdzID0gbmV3IFdlYlNvY2tldChcIndzOi8vMTI3LjAuMC4xOjIyMDBcIik7XG4gICAgICAgIHdzLnNlbmQoXCJNb3ZlLFwiICsgc2VsZi5nYW1lRGF0YS5jb21tYW5kICsgY29tLmRhdGFbMl0pO1xuICAgICAgICB3cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGNjLmxvZyhldmVudC5kYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2MubG9nKHdzKTtcbiAgICAgICAgY2MubG9nKFwid3MgcmVhZHlTdGF0ZVwiICsgd3MucmVhZHlTdGF0ZSk7XG5cbiAgICAgICAgY2MuaW5wdXRNYW5hZ2VyLnNldEFjY2VsZXJvbWV0ZXJJbnRlcnZhbCgxIC8gNyk7XG4gICAgICAgIC8v5L2/55So5Yqg6YCf6K6h5LqL5Lu255uR5ZCs5Zmo5LmL5YmN77yM6ZyA6KaB5YWI5ZCv55So5q2k56Gs5Lu26K6+5aSHXG4gICAgICAgIGNjLmlucHV0TWFuYWdlci5zZXRBY2NlbGVyb21ldGVyRW5hYmxlZCh0cnVlKTtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0ge1xuICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuQUNDRUxFUkFUSU9OLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIGNhbGxiYWNrKGFjY2VsRXZlbnQsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LmdldEN1cnJlbnRUYXJnZXQoKTtcblxuICAgICAgICAgICAgICAgIC8v6I635Y+W5Yiw5b2T5YmN55qE6IqC54K557uE5Lu2XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LmdldENvbXBvbmVudChcIkdhbWluZ1wiKTtcblxuICAgICAgICAgICAgICAgIC8v6L+b6KGM5pS26ZuG6YeN5Yqb5L2N572u55qE6K6w5b2VXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gYWNjZWxFdmVudC54O1xuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFjY2VsRXZlbnQueTtcbiAgICAgICAgICAgICAgICB0aGlzLnogPSBhY2NlbEV2ZW50Lno7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGVtcExlbmd0aCA9IHRhcmdldC5xdWV1ZUFycmF5Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAodGVtcExlbmd0aCA8IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0LnF1ZXVlQXJyYXkucHVzaCh7eFBvczpNYXRoLmNlaWwoYWNjZWxFdmVudC54KSx5UG9zOk1hdGguY2VpbChhY2NlbEV2ZW50LnkpLHpQb3M6TWF0aC5jZWlsKGFjY2VsRXZlbnQueil9KTtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnF1ZXVlQXJyYXkucHVzaCh7IHhQb3M6IGFjY2VsRXZlbnQueCwgeVBvczogYWNjZWxFdmVudC55LCB6UG9zOiBhY2NlbEV2ZW50LnogfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy/nlKjmnaXoo4HliarmlbDnu4RcbiAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0LnF1ZXVlQXJyYXkuc3BsaWNlKDYsdGVtcExlbmd0aC0xKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jYy5sb2coXCJOb2RlOlwiLCBzZWxmLm5vZGUuY2hpbGRyZW4pXG4gICAgICAgICAgICAgICAgICAgIC8vdGFyZ2V0Lm5ld0hvcnNlMi54ICs9IDEwO1xuICAgICAgICAgICAgICAgICAgICAvLyB0YXJnZXQuc2NvcmUyRGlzcGxheS5zdHJpbmc9KFwiKFwiK01hdGguY2VpbCh0YXJnZXQucXVldWVBcnJheVswXS54UG9zKStcIixcIitNYXRoLmNlaWwodGFyZ2V0LnF1ZXVlQXJyYXlbMF0ueVBvcykrXCIsXCIrTWF0aC5jZWlsKHRhcmdldC5xdWV1ZUFycmF5WzBdLnpQb3MpK1wiKVwiKVxuICAgICAgICAgICAgICAgICAgICAvL+WIpOaWreaYr+WQpui/m+ihjOS6huaRh+WKqFxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmlzU2hha2UodGhpcy54LCB0aGlzLnksIHRoaXMueikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIHdzID0gbmV3IFdlYlNvY2tldChcIndzOi8vMTI3LjAuMC4xOjIyMDBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB3cy5zZW5kKFwiTW92ZSxcIiArIHNlbGYuZ2FtZURhdGEuY29tbWFuZCArIGNvbS5kYXRhWzJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdzLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmxvZyhcImV2ZW50ZGF0YTpcIiArIGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWtlQ291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXMuZGlzdGFuY2Uuc2hha2VOdW0gPSBzaGFrZUNvdW50IC8gNDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXMuZGlzdGFuY2UuZGlzdGFuY2VQZXJTaGFrZSA9IHRhcmdldC53aW5zaXplIC8gdGFyZ2V0LmdhbWVEYXRhLnNoYWtlTnVtIC8gNTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6K6w5b2V55So5oi35pGH5omL5py655qE5pWw5o2uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Lm5ld0hvcnNlMi54ICs9IHRhcmdldC53aW5zaXplIC8gdGFyZ2V0LmdhbWVEYXRhLnNoYWtlTnVtIC8gNTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRhcmdldC5ob3JzZUF1ZGlvLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnF1ZXVlQXJyYXkuc3BsaWNlKDAsIHRlbXBMZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRhcmdldC5xdWV1ZUFycmF5LnNwbGljZSgwLHRlbXBMZW5ndGgtMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wYXVzZUFsbEVmZmVjdHMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5xdWV1ZUFycmF5LnNwbGljZSgwLCB0ZW1wTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKGxpc3RlbmVyLCB0aGlzLm5vZGUpO1xuICAgIH0sXG5cbiAgICAvL+WIneWni+WMlueyvueBteaVsOe7hOW5tuWKoOi9vVxuICAgIGluaXRTcHJpdGU6IGZ1bmN0aW9uIGluaXRTcHJpdGUoKSB7XG5cbiAgICAgICAgLy8gdGhpcy5uZXdIb3JzZTJBcnJheT1bXTsgICAgXG4gICAgICAgIGNjLmxvZyhcImRhdGE6XCIgKyBjb20uZGF0YS5sZW5ndGgpO1xuICAgICAgICAvLyBmb3IodmFyIGk9MDtpPGNvbS5kYXRhLnVzZXJOdW07aSsrKXtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb20uZGF0YS5sZW5ndGggLSAzOyBpKyspIHtcblxuICAgICAgICAgICAgdGhpcy5uZXdIb3JzZTIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmhvcnNlU3ByaXRlUHJlZmFiKTtcbiAgICAgICAgICAgIHRoaXMubmV3VXNlciA9IGNjLmluc3RhbnRpYXRlKHRoaXMudXNlcklmb1ByZWZhYik7XG4gICAgICAgICAgICB0aGlzLm5ld0hvcnNlMi50YWcgPSBpO1xuXG4gICAgICAgICAgICB0aGlzLm5ld0hvcnNlMi5zZXRQb3NpdGlvbihjYy5wKC0yODAsIDUyMCArIC05MiAqIGkpKTtcbiAgICAgICAgICAgIHRoaXMubmV3VXNlci5zZXRQb3NpdGlvbihjYy5wKC0xNTAsIDUyNSArIC05MiAqIGkpKTtcblxuICAgICAgICAgICAgdGhpcy5uZXdVc2VyLmNoaWxkcmVuWzBdLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCJbXCIgKyBjb20uZGF0YVtpICsgMl0uc3Vic3RyKDAsIDgpICsgXCJdXCI7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLm5ld0hvcnNlMik7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5uZXdVc2VyKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5sb2codGhpcyk7XG4gICAgfSxcbiAgICAvL+WIpOaWreaYr+WQpui/m+ihjOS6huaRh+WKqFxuICAgIGlzU2hha2U6IGZ1bmN0aW9uIGlzU2hha2UoeFByZSwgeVByZSwgelByZSkge1xuICAgICAgICAvL+WPguaVsOeUqOadpeiusOW9leW9k+WJjeeahOWdkOagh1xuXG4gICAgICAgIC8vZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXVlQXJyYXkubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAvLyAgICBpZiAoTWF0aC5hYnModGhpcy5xdWV1ZUFycmF5W2ldLnhQb3MgLSB4UHJlKSA+IDAuMiB8fCBNYXRoLmFicyh0aGlzLnF1ZXVlQXJyYXlbaV0ueVBvcyAtIHlQcmUpID4gMC4yIHx8IE1hdGguYWJzKHRoaXMucXVldWVBcnJheVtpXS56UG9zIC0gelByZSkgPiAwLjIpIHtcbiAgICAgICAgLy8gICAgICAgIHhQcmUgPSB0aGlzLnF1ZXVlQXJyYXlbaV0ueFBvcztcbiAgICAgICAgLy8gICAgICAgIHlQcmUgPSB0aGlzLnF1ZXVlQXJyYXlbaV0ueVBvcztcbiAgICAgICAgLy8gICAgICAgIHpQcmUgPSB0aGlzLnF1ZXVlQXJyYXlbaV0uelBvcztcbiAgICAgICAgLy8gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAvLyAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAvLyAgICB9XG4gICAgICAgIC8vfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcblxuICAgICAgICAvL+e7k+adn+WIpOaWreWcuuaZr+i3s+i9rFxuICAgICAgICBpZiAodGhpcy5uZXdIb3JzZTIueCA+IHRoaXMud2luc2l6ZSAvIDIgLSAxMjApIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnR2FtZU92ZXInKTtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBhdXNlQWxsRWZmZWN0cygpO1xuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUudW5sb2FkRWZmZWN0KGNjLmhvcnNlQXVkaW8pO1xuICAgICAgICB9XG4gICAgICAgIGRpcy5kaXN0YW5jZS5zaGFrZU51bSsrO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5Y2NkYitiZjB4Q1ViK1ZmbHZSQXU3aCcsICdJbmRleCcpO1xuLy8gc2NyaXB0c1xcSW5kZXguanNcblxudmFyIGFwcElkID0gXCJ3eDY3MzE0NTkzNGUxZmY2OGZcIjtcbnZhciBhcHBTZWNyZXQgPSBcIjIzODVlOTQ0NmYwOTU0MzViZTM1YTA3YjBlZjI1NzQ4XCI7XG52YXIgY29kZSA9IFwiXCI7XG52YXIgTmljayA9IFwiemhhbmdzYW5cIjtcbnZhciBTZXggPSBcIm5hblwiO1xuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFN0YXJ0QnRuOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICBjbGlja1BsYXlBdWRpbzoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuXG4gICAgICAgIHRoaXMuc3RhcnRDYWxsQmFjayhldmVudCk7XG4gICAgICAgIC8vY2MubG9nKHRoaXMuZ2V0Q29kZSgpKTtcbiAgICAgICAgLy9jYy5sb2codGhpcy5nZXRUb2tlbigpKTtcbiAgICAgICAgaWYgKHVybFswXSA9PSBcIj9Ta2lwXCIgJiYgdXJsWzFdICE9IFwiXCIgJiYgYWNjZXNzICE9IFwiNFwiKSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJXYWl0aW5nXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzdGFydENhbGxCYWNrOiBmdW5jdGlvbiBzdGFydENhbGxCYWNrKGV2ZW50KSB7XG4gICAgICAgIGNjLmxvZyhcIlN0YXJ0QnRuOlwiLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0RPV04sIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LmdldEN1cnJlbnRUYXJnZXQoKTtcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5nZXRDb21wb25lbnQoXCJJbmRleFwiKTtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGFyZ2V0LmNsaWNrUGxheUF1ZGlvLCBmYWxzZSk7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJTZXR0aW5nXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBldmVudC5nZXRDdXJyZW50VGFyZ2V0KCk7XG4gICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQuZ2V0Q29tcG9uZW50KFwiSW5kZXhcIik7XG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRhcmdldC5jbGlja1BsYXlBdWRpbywgZmFsc2UpO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiU2V0dGluZ1wiKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRDb2RlOiBmdW5jdGlvbiBnZXRDb2RlKCkge1xuICAgICAgICB2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgICAgICBjYy5sb2codXJsKTtcbiAgICAgICAgdmFyIHRlbXBDb2RlID0gdXJsLnNwbGl0KFwiOlwiKTtcbiAgICAgICAgLy8gY29kZT10ZW1wQ29kZVsyXS5zcGxpdChcIj1cIik7XG4gICAgICAgIHJldHVybiB0ZW1wQ29kZTtcbiAgICB9LFxuICAgIGdldFRva2VuOiBmdW5jdGlvbiBnZXRUb2tlbihhcHBJZCwgYXBwU2VjcmV0LCBjb2RlKSB7XG4gICAgICAgIC8vIHZhciB0b2tlbj0kLmdldChcImh0dHBzOi8vYXBpLndlaXhpbi5xcS5jb20vc25zL29hdXRoMi9hY2Nlc3NfdG9rZW4/YXBwaWQ9XCIgKyBhcHBJZCArIFwiJnNlY3JldD1cIiArIGFwcFNlY3JldCArIFwiJmNvZGU9XCIgKyBjb2RlICsgXCImZ3JhbnRfdHlwZT1hdXRob3JpemF0aW9uX2NvZGVcIilcbiAgICAgICAgdmFyIHhtbGh0dHA7XG4gICAgICAgIC8vIHhtbGh0dHA9bmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIC8vIHhtbGh0dHAub3BlbihcIkdFVFwiLFwiaHR0cHM6Ly93d3cuYmFpZHUuY29tL1wiLHRydWUpXG4gICAgICAgIC8vIHhtbGh0dHAuc2VuZCgpO1xuICAgICAgICAvLyAkLmFqYXgoe1xuICAgICAgICAvLyB0eXBlOiBcInBvc3RcIixcbiAgICAgICAgLy8gY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAvLyB1cmw6IFwiaHR0cHM6Ly9hcGkud2VpeGluLnFxLmNvbS9zbnMvb2F1dGgyL2FjY2Vzc190b2tlbj9hcHBpZD1cIiArIGFwcElkICsgXCImc2VjcmV0PVwiICsgYXBwU2VjcmV0ICsgXCImY29kZT1cIiArIGNvZGUgKyBcIiZncmFudF90eXBlPWF1dGhvcml6YXRpb25fY29kZVwiLFxuICAgICAgICAvLyBkYXRhOiBcIntpVW5pZDpcIisxK1wifVwiLFxuICAgICAgICAvLyBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAvLyBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIC8vICAgICB2YXIgdHQgPSAnJztcbiAgICAgICAgLy8gICAgIHZhciBqc29uT2JqZWN0ID0gJC5qc29uVG9PYmplY3QoZGF0YS5kKTtcbiAgICAgICAgLy8gICAgICQuZWFjaChqc29uT2JqZWN0LCBmdW5jdGlvbihrLCB2KSB7XG4gICAgICAgIC8vICAgICAgICAgJC5lYWNoKHYsIGZ1bmN0aW9uKGtrLCB2dikge1xuICAgICAgICAvLyAgICAgICAgICAgICB0dCArPSBrayArIFwi77yaXCIgKyB2diArIFwiPGJyLz5cIjtcbiAgICAgICAgLy8gICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyAgICAgY2MubG9nKHR0KVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vfSk7XG5cbiAgICAgICAgLy8gcmV0dXJuIHhtbGh0dHAucmVzcG9uc2VUZXh0O1xuICAgIH0sXG4gICAgY29tbWFuZENhbGxCYWNrOiBmdW5jdGlvbiBjb21tYW5kQ2FsbEJhY2soKSB7XG4gICAgICAgIGNjLmxvZyh0aGlzLm5vZGUpO1xuICAgIH1cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc1YjJjOG5GdHN0S1c1ZWhoWkJoeTZhRScsICdTZXR0aW5nLUJhY0J0bicpO1xuLy8gc2NyaXB0c1xcU2V0dGluZ1xcU2V0dGluZy1CYWNCdG4uanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBCYWNrQnRuOiB7XG5cbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuYmFja0NhbGxCYWNrKGV2ZW50KTtcbiAgICB9LFxuICAgIGJhY2tDYWxsQmFjazogZnVuY3Rpb24gYmFja0NhbGxCYWNrKGV2ZW50KSB7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9ET1dOLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkluZGV4XCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkluZGV4XCIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcwMTY5Zmp5ZFhsRUtyRU0wMW44MmRRSycsICdTZXR0aW5nLUVkaXRCb3gnKTtcbi8vIHNjcmlwdHNcXFNldHRpbmdcXFNldHRpbmctRWRpdEJveC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIE5hbWVFZDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94XG4gICAgICAgIH0sXG4gICAgICAgIFNoYWtlTnVtRWQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveFxuICAgICAgICB9LFxuICAgICAgICBDb21tYW5kRWQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveFxuICAgICAgICB9LFxuICAgICAgICBnYW1lRGF0YTogbnVsbFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy90aGlzLmdhbWVEYXRhID0ge1xuICAgICAgICAvLyAgICBuYW1lOiBcIlwiLFxuICAgICAgICAvLyAgICBzaGFrZU51bTogXCJcIixcbiAgICAgICAgLy8gICAgY29tbWFuZDogXCJcIixcbiAgICAgICAgLy8gICAgdXNlcjogXCJBZG1pblwiXG4gICAgICAgIC8vfTtcbiAgICAgICAgQ29tbWFuZCA9IFwiQWRtaW5cIjtcbiAgICB9LFxuICAgIE5hbWVFZENhbGxCYWNrOiBmdW5jdGlvbiBOYW1lRWRDYWxsQmFjaygpIHtcbiAgICAgICAgdGhpcy5nYW1lRGF0YSA9IHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMuTmFtZUVkLnN0cmluZyxcbiAgICAgICAgICAgIHNoYWtlTnVtOiB0aGlzLlNoYWtlTnVtRWQuc3RyaW5nLFxuICAgICAgICAgICAgY29tbWFuZDogdGhpcy5Db21tYW5kRWQuc3RyaW5nLFxuICAgICAgICAgICAgdXNlcjogXCJBZG1pblwiXG4gICAgICAgIH07XG4gICAgICAgIC8vIHRoaXMuZ2FtZURhdGEubmFtZT10aGlzLk5hbWVFZC5zdHJpbmc7XG5cbiAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdnYW1lRGF0YScsIEpTT04uc3RyaW5naWZ5KHRoaXMuZ2FtZURhdGEpKTtcbiAgICAgICAgY2MubG9nKHRoaXMuZ2FtZURhdGEpO1xuICAgIH0sXG4gICAgU2hha2VOdW1FZENhbGxCYWNrOiBmdW5jdGlvbiBTaGFrZU51bUVkQ2FsbEJhY2soKSB7XG4gICAgICAgIHRoaXMuZ2FtZURhdGEgPSB7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLk5hbWVFZC5zdHJpbmcsXG4gICAgICAgICAgICBzaGFrZU51bTogdGhpcy5TaGFrZU51bUVkLnN0cmluZyxcbiAgICAgICAgICAgIGNvbW1hbmQ6IHRoaXMuQ29tbWFuZEVkLnN0cmluZyxcbiAgICAgICAgICAgIHVzZXI6IFwiQWRtaW5cIlxuICAgICAgICB9O1xuICAgICAgICAvLyB0aGlzLmdhbWVEYXRhLnNoYWtlTnVtPXRoaXMuU2hha2VOdW1FZC5zdHJpbmc7XG4gICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZ2FtZURhdGEnLCBKU09OLnN0cmluZ2lmeSh0aGlzLmdhbWVEYXRhKSk7XG4gICAgICAgIGNjLmxvZyh0aGlzLmdhbWVEYXRhKTtcbiAgICB9LFxuICAgIENvbW1hbmRFZENhbGxCYWNrOiBmdW5jdGlvbiBDb21tYW5kRWRDYWxsQmFjaygpIHtcbiAgICAgICAgdGhpcy5nYW1lRGF0YSA9IHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMuTmFtZUVkLnN0cmluZyxcbiAgICAgICAgICAgIHNoYWtlTnVtOiB0aGlzLlNoYWtlTnVtRWQuc3RyaW5nLFxuICAgICAgICAgICAgY29tbWFuZDogdGhpcy5Db21tYW5kRWQuc3RyaW5nLFxuICAgICAgICAgICAgdXNlcjogXCJBZG1pblwiXG4gICAgICAgIH07XG4gICAgICAgIC8vIHRoaXMuZ2FtZURhdGEuY29tbWFuZD10aGlzLkNvbW1hbmRFZC5zdHJpbmc7XG4gICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZ2FtZURhdGEnLCBKU09OLnN0cmluZ2lmeSh0aGlzLmdhbWVEYXRhKSk7XG4gICAgICAgIGNjLmxvZyh0aGlzLmdhbWVEYXRhKTtcbiAgICB9XG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5MzAzNFBFQ0pWSkU2MmN3NDgyWFE3aScsICdTZXR0aW5nLVN1YkJ0bicpO1xuLy8gc2NyaXB0c1xcU2V0dGluZ1xcU2V0dGluZy1TdWJCdG4uanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFN1Ym1pdEJ0bjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAgICAgICAgfSxcbiAgICAgICAgTmFtZUVkOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3hcbiAgICAgICAgfSxcbiAgICAgICAgU2hha2VOdW1FZDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94XG4gICAgICAgIH0sXG4gICAgICAgIENvbW1hbmRFZDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94XG4gICAgICAgIH0sXG4gICAgICAgIGNsaWNrQXVkaW86IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgRGF0YVRlbXA6IG51bGxcblxuICAgIH0sXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuc3RhcnRDYWxsQmFjayhldmVudCk7XG4gICAgICAgIGFjY2VzcyA9IFwiYWRtaW5cIjtcbiAgICB9LFxuICAgIHN0YXJ0Q2FsbEJhY2s6IGZ1bmN0aW9uIHN0YXJ0Q2FsbEJhY2soZXZlbnQpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0RPV04sIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LmdldEN1cnJlbnRUYXJnZXQoKTtcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5nZXRDb21wb25lbnQoXCJTZXR0aW5nLVN1YkJ0blwiKTtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGFyZ2V0LmNsaWNrQXVkaW8sIGZhbHNlKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIldhaXRpbmdcIik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LmdldEN1cnJlbnRUYXJnZXQoKTtcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5nZXRDb21wb25lbnQoXCJTZXR0aW5nLVN1YkJ0blwiKTtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGFyZ2V0LmNsaWNrQXVkaW8sIGZhbHNlKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIldhaXRpbmdcIik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2Y0NTdkZWJRYVpQMG8wemJZNXhncDVlJywgJ1dhaXRpbmctQmFjQnRuJyk7XG4vLyBzY3JpcHRzXFxXYWl0aW5nXFxXYWl0aW5nLUJhY0J0bi5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIEJhY2tCdG46IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuc3RhcnRDYWxsQmFjayhldmVudCk7XG4gICAgfSxcbiAgICBzdGFydENhbGxCYWNrOiBmdW5jdGlvbiBzdGFydENhbGxCYWNrKGV2ZW50KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0RPV04sIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy8gc2VsZi53ZWJzb2NrZXQoKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIlNldHRpbmdcIik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy8gc2VsZi53ZWJzb2NrZXQoKTsgICBcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIlNldHRpbmdcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc1YWNjNlFrajBoRXZMbXNOQ01FaXZaUycsICdXYWl0aW5nLUdvQnRuJyk7XG4vLyBzY3JpcHRzXFxXYWl0aW5nXFxXYWl0aW5nLUdvQnRuLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgR29CdG46IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG4gICAgICAgIGNsaWNrQXVkaW86IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcblxuICAgICAgICB0aGlzLnN0YXJ0Q2FsbEJhY2soZXZlbnQpO1xuICAgIH0sXG4gICAgc3RhcnRDYWxsQmFjazogZnVuY3Rpb24gc3RhcnRDYWxsQmFjayhldmVudCkge31cblxuICAgIC8vdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX0RPV04sIGZ1bmN0aW9uIChldmVudCkge1xuICAgIC8vICAgIHZhciB0YXJnZXQgPSBldmVudC5nZXRDdXJyZW50VGFyZ2V0KCk7XG4gICAgLy8gICAgdGFyZ2V0ID0gdGFyZ2V0LmdldENvbXBvbmVudChcIldhaXRpbmctR29CdG5cIik7XG4gICAgLy8gICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0YXJnZXQuY2xpY2tBdWRpbywgZmFsc2UpO1xuICAgIC8vICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkdhbWluZ1wiKTtcbiAgICAvL30pO1xuICAgIC8vdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAvLyAgICB2YXIgdGFyZ2V0ID0gZXZlbnQuZ2V0Q3VycmVudFRhcmdldCgpO1xuICAgIC8vICAgIHRhcmdldCA9IHRhcmdldC5nZXRDb21wb25lbnQoXCJXYWl0aW5nLUdvQnRuXCIpO1xuICAgIC8vICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGFyZ2V0LmNsaWNrQXVkaW8sIGZhbHNlKTtcbiAgICAvLyAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJHYW1pbmdcIik7XG4gICAgLy99KTtcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzEwNGNkWFdyRmhKcEs4QjFLTVd4SW1BJywgJ1dhaXRpbmcnKTtcbi8vIHNjcmlwdHNcXFdhaXRpbmdcXFdhaXRpbmcuanNcblxudmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vblVzZXJJZm8nKTtcbnZhciBkaXMgPSByZXF1aXJlKCdDb21tb25Vc2VyRGlzJyk7XG52YXIgaG9yc2VhcnJheSA9IG5ldyBBcnJheSgpO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIC8v6LeR6ams57K+54G1XG4gICAgICAgIG5ld0hvcnNlMjogbnVsbCxcbiAgICAgICAgbmV3VXNlcjogbnVsbCxcbiAgICAgICAgcXVldWVBcnJheToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQXJyYXlcbiAgICAgICAgfSwgLy/mlbDnu4TnlKjmnaXlrZjmlL7nrpfms5XkuK3nmoTngrlcbiAgICAgICAgaG9yc2VTcHJpdGVQcmVmYWI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICBob3JzZTJTcHJpdGVQcmVmYWI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICAvL+eUqOaIt+S/oeaBr1xuICAgICAgICB1c2VySWZvUHJlZmFiOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgdXNlckNvdW50OiBudWxsLFxuICAgICAgICB3aW5zaXplOiBudWxsLFxuICAgICAgICBnYW1lRGF0YTogbnVsbCxcbiAgICAgICAgLy/pga7nvanlsYJcbiAgICAgICAgTWFza1Nwcml0ZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIE51bUxhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBNZXNzYWdlTGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIC8v6YGu572p5bGC5LqMXG4gICAgICAgIExvYWQyTWFzazoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIE51bUxhYmVsMjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgTWVzc2FnZUxhYmVsMjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgR2FtZU92ZXJNYXNrOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBSYW5rTGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIFNjb3JlTGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIEJhY2tCdG46IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICBCZWdpbkJ0bjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG4gICAgICAgIE1vcmVCdG46IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICBsZW5ndGg6IG51bGwsXG4gICAgICAgIHdzOiBudWxsLFxuICAgICAgICB0ZW1waG9yc2U6IG51bGxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8v55So5oi35pWw6YeP57uf6K6h6K6h5pWwXG5cbiAgICAgICAgLy/kuLTml7blj5jph4/orrDlvZVkYXRh5YC8XG5cbiAgICAgICAgdGhpcy53aW5zaXplID0gdGhpcy5ub2RlLndpZHRoO1xuICAgICAgICB0aGlzLmdhbWVEYXRhID0gSlNPTi5wYXJzZShjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2dhbWVEYXRhJykpO1xuXG4gICAgICAgIC8v5Yid5aeL5YyW57K+54G15pWw57uE5bm25Yqg6L29XG4gICAgICAgIC8vIHRoaXMuaW5pdFNwcml0ZSgpO1xuICAgICAgICBjb20uZGF0YS51c2VyTnVtID0gMDtcbiAgICAgICAgY29tLmRhdGEudXNlck5hbWUgPSBudWxsO1xuICAgICAgICB0aGlzLndlYlNvY2tldCgpO1xuICAgIH0sXG4gICAgd2ViU29ja2V0OiBmdW5jdGlvbiB3ZWJTb2NrZXQoKSB7XG4gICAgICAgIHZhciB3cyA9IG5ldyBXZWJTb2NrZXQoXCJ3czovLzE5Mi4xNjguMC4yNToyMjAwXCIpO1xuICAgICAgICBjYy5sb2cod3MpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8v6YCA5Ye6562J5b6F5aSn5Y6F5Y+K5pe25Yi35pawXG4gICAgICAgIHRoaXMuQmFja0J0bi5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHdzLmNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvL+S4u+aMgeS6uueCueWHu+W8gOi1m+aJgOacieS6uuWTjeW6lFxuICAgICAgICB0aGlzLkJlZ2luQnRuLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgY2MubG9nKFwi5byA6LWbXCIpO1xuICAgICAgICAgICAgd3Muc2VuZChcIkJlZ2luR2FtZSxcIiArIHVybFsxXSArIFwiLFwiICsgc2VsZi5nYW1lRGF0YS5zaGFrZU51bSk7XG4gICAgICAgIH0pO1xuICAgICAgICB3cy5vbm9wZW4gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcIumAmuiur+i/nuaOpeaIkOWKn++8gVwiKTtcbiAgICAgICAgICAgIGlmIChDb21tYW5kID09IFwiQWRtaW5cIikge1xuICAgICAgICAgICAgICAgIHdzLnNlbmQoXCJPcGVuLFwiICsgc2VsZi5nYW1lRGF0YS5jb21tYW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd3Muc2VuZChcIk9wZW4sXCIgKyB1cmxbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB3cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGxlbmd0aCA9IGV2ZW50LmRhdGEuc3BsaXQoXCIvXCIpLmxlbmd0aCAtIDI7XG5cbiAgICAgICAgICAgIC8vIGNjLmxvZyhldmVudC5kYXRhKVxuICAgICAgICAgICAgLy8gY2MubG9nKHdzLnJlYWR5U3RhdGUpXG4gICAgICAgICAgICBzZWxmLnVzZXJDb3VudCA9IGxlbmd0aDtcbiAgICAgICAgICAgIHZhciBkYXRhID0gZXZlbnQuZGF0YS5zcGxpdChcIi9cIik7XG4gICAgICAgICAgICBjb20uZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICBjYy5sb2coXCJkYXRhRGF0YTpcIiArIGNvbS5kYXRhKTtcbiAgICAgICAgICAgIC8v6L+e5o6l5raI5oGv5aSE55CGXG4gICAgICAgICAgICBpZiAoZXZlbnQuZGF0YVswXSA9PSBcIjBcIikge1xuICAgICAgICAgICAgICAgIGhvcnNlYXJyYXkgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgICAgICAgICBzZWxmLm5vZGUuY2hpbGRyZW5bMV0ucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8v5re75Yqg5Yia6L+b6KGM6L+e5o6l55qE55So5oi36LeR6ams57K+54G1XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubmV3SG9yc2UyID0gY2MuaW5zdGFudGlhdGUoc2VsZi5ob3JzZVNwcml0ZVByZWZhYik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubmV3VXNlciA9IGNjLmluc3RhbnRpYXRlKHNlbGYudXNlcklmb1ByZWZhYik7XG4gICAgICAgICAgICAgICAgICAgIC8v5a6a5LmJ6ZyA6KaB5Yqg5YWl5Yiw6LeR6ams5Zy65pmv55qE5Y2V5L6L5a+56LGhXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0geyBpZDogZGF0YVtpICsgMV0uc3Vic3RyKDAsIDgpLCBzcHJpdGU6IGNjLmluc3RhbnRpYXRlKHNlbGYuaG9yc2UyU3ByaXRlUHJlZmFiKSwgdXNlcjogc2VsZi5uZXdVc2VyIH07XG4gICAgICAgICAgICAgICAgICAgIGhvcnNlYXJyYXkucHVzaCh0ZW1wKTtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nKGhvcnNlYXJyYXkpO1xuICAgICAgICAgICAgICAgICAgICAvL+i/m+ihjOWUr+S4gOagh+ivhlxuICAgICAgICAgICAgICAgICAgICBzZWxmLm5ld0hvcnNlMi50YWcgPSBkYXRhW2kgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5uZXdVc2VyLnRhZyA9IGRhdGFbaSArIDFdICsgXCJ1c2VyXCI7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNjLmxvZyh0aGlzLm5ld0hvcnNlMik7XG4gICAgICAgICAgICAgICAgICAgIC8v6K6+572u6LeR6ams6L+b5p2l55qE56uZ5L2NXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubmV3SG9yc2UyLnNldFBvc2l0aW9uKGNjLnAoLTEyMCwgNTI1ICsgLTkyICogaSkpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm5ld1VzZXIuc2V0UG9zaXRpb24oY2MucCgtNDEwLCA1MjUgKyAtOTIgKiBpKSk7XG4gICAgICAgICAgICAgICAgICAgIC8v5bGV56S655So5oi355qE5ZSv5LiASURcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VsZi5uZXdVc2VyLmNoaWxkcmVuWzBdLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nPVwiW1wiK2RhdGFbaSoyKzJdLnN1YnN0cigwLDgpK1wiXVwiXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubmV3VXNlci5jaGlsZHJlblswXS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGRhdGFbaSArIDFdLnN1YnN0cigwLCA4KTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5ub2RlLmNoaWxkcmVuWzFdLmFkZENoaWxkKHNlbGYubmV3SG9yc2UyKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5ub2RlLmNoaWxkcmVuWzFdLmFkZENoaWxkKHNlbGYubmV3VXNlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8v5Yik5pat5piv5ZCm5piv572R6aG16L6T5YWl5LqG5q2j56Gu5Y+j5LukXG4gICAgICAgICAgICAgICAgaWYgKHVybFswXSA9PSBcIj9Ta2lwXCIgJiYgdXJsWzFdICE9IFwiXCIgJiYgYWNjZXNzICE9IFwiNFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhY2Nlc3MgPT0gXCJ0b2tlblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmdhbWVEYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNlbGYuZ2FtZURhdGEubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFrZU51bTogc2VsZi5nYW1lRGF0YS5zaGFrZU51bSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiBzZWxmLmdhbWVEYXRhLmNvbW1hbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogXCJVc2VyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2dhbWVEYXRhJywgSlNPTi5zdHJpbmdpZnkodGhpcy5nYW1lRGF0YSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MubG9nKHNlbGYuZ2FtZURhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy/pga7nvanmlbDmja5cbiAgICAgICAgICAgICAgICAgICAgaWYgKENvbW1hbmQgPT0gXCJBZG1pblwiICYmIGFjY2VzcyAhPSBcInRva2VuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuTWFza1Nwcml0ZS5ub2RlLm9wYWNpdHkgPSAxODA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLk1hc2tTcHJpdGUubm9kZS56SW5kZXggPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZWxmLm5vZGUucmVtb3ZlQ2hpbGQoc2VsZi5ub2RlLmNoaWxkcmVuWzNdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLkxvYWQyTWFzay5ub2RlLm9wYWNpdHkgPSAxODA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5Mb2FkMk1hc2subm9kZS56SW5kZXggPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubm9kZS5yZW1vdmVDaGlsZChzZWxmLm5vZGUuY2hpbGRyZW5bMl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+aVsOmHj+agvOW8j+S/ruaUuVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi51c2VyQ291bnQgPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyQ291bnQgPSBcIjAwXCIgKyBzZWxmLnVzZXJDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLnVzZXJDb3VudCA+PSAxMCAmJiBzZWxmLnVzZXJDb3VudCA8PSA5OSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyQ291bnQgPSBcIjBcIiArIHNlbGYudXNlckNvdW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8v566h55CG5ZGY6YGu572p5bGC5pWw5o2uXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuTnVtTGFiZWwuc3RyaW5nID0gc2VsZi51c2VyQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuTWVzc2FnZUxhYmVsLnN0cmluZyA9IFwi5bey5pyJXCIgKyBzZWxmLnVzZXJDb3VudCArIFwi5L2N5aW95Y+L5YeG5aSH5bCx57uqXCI7XG4gICAgICAgICAgICAgICAgICAgIC8v55So5oi36YGu572p5bGC5pWw5o2uXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuTnVtTGFiZWwyLnN0cmluZyA9IHNlbGYudXNlckNvdW50O1xuICAgICAgICAgICAgICAgICAgICBzZWxmLk1lc3NhZ2VMYWJlbDIuc3RyaW5nID0gXCLlt7LmnIlcIiArIHNlbGYudXNlckNvdW50ICsgXCLkvY3lpb3lj4vlh4blpIflsLHnu6pcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+mAgOWHuua2iOaBr+WkhOeQhlxuICAgICAgICAgICAgZWxzZSBpZiAoZXZlbnQuZGF0YVswXSA9PSBcIjFcIikge1xuICAgICAgICAgICAgICAgICAgICAvL+WFiOa4hemZpOaJgOacieeUqOaIt1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm5vZGUuY2hpbGRyZW5bMV0ucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgaG9yc2VhcnJheSA9IG5ldyBBcnJheSgpO1xuICAgICAgICAgICAgICAgICAgICAvL+a3u+WKoOayoeaciemAgOWHuuWkp+WOheeahOeUqOaIt1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm5ld0hvcnNlMiA9IGNjLmluc3RhbnRpYXRlKHNlbGYuaG9yc2VTcHJpdGVQcmVmYWIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5uZXdVc2VyID0gY2MuaW5zdGFudGlhdGUoc2VsZi51c2VySWZvUHJlZmFiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSB7IGlkOiBkYXRhW2ogKyAxXS5zdWJzdHIoMCwgOCksIHNwcml0ZTogc2VsZi5uZXdIb3JzZTIsIHVzZXI6IHNlbGYubmV3VXNlciB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaG9yc2VhcnJheS5wdXNoKHRlbXApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYy5sb2codGhpcy5uZXdIb3JzZTIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5uZXdIb3JzZTIuc2V0UG9zaXRpb24oY2MucCgtMTIwLCA1MjUgKyAtOTIgKiBqKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm5ld1VzZXIuc2V0UG9zaXRpb24oY2MucCgtNDEwLCA1MjUgKyAtOTIgKiBqKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm5ld1VzZXIuY2hpbGRyZW5bMF0uZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBkYXRhW2ogKyAxXS5zdWJzdHIoMCwgOCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm5vZGUuY2hpbGRyZW5bMV0uYWRkQ2hpbGQoc2VsZi5uZXdIb3JzZTIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5ub2RlLmNoaWxkcmVuWzFdLmFkZENoaWxkKHNlbGYubmV3VXNlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHVybFswXSA9PSBcIj9Ta2lwXCIgJiYgdXJsWzFdICE9IFwiXCIgJiYgYWNjZXNzICE9IFwiNFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWNjZXNzID09IFwidG9rZW5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2FtZURhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWtlTnVtOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiBcIlVzZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6YGu572p5pWw5o2uXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ29tbWFuZCA9PSBcIkFkbWluXCIgJiYgYWNjZXNzICE9IFwidG9rZW5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuTWFza1Nwcml0ZS5ub2RlLm9wYWNpdHkgPSAxODA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5NYXNrU3ByaXRlLm5vZGUuekluZGV4ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5Mb2FkMk1hc2subm9kZS5vcGFjaXR5ID0gMTgwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuTG9hZDJNYXNrLm5vZGUuekluZGV4ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm5vZGUucmVtb3ZlQ2hpbGQoc2VsZi5ub2RlLmNoaWxkcmVuWzJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35pWw6YeP5qC85byP5L+u5pS5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi51c2VyQ291bnQgPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudXNlckNvdW50ID0gXCIwMFwiICsgc2VsZi51c2VyQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYudXNlckNvdW50ID49IDEwICYmIHNlbGYudXNlckNvdW50IDw9IDk5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51c2VyQ291bnQgPSBcIjBcIiArIHNlbGYudXNlckNvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy/nrqHnkIblkZjpga7nvanlsYLmlbDmja5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuTnVtTGFiZWwuc3RyaW5nID0gc2VsZi51c2VyQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLk1lc3NhZ2VMYWJlbC5zdHJpbmcgPSBcIuW3suaciVwiICsgc2VsZi51c2VyQ291bnQgKyBcIuS9jeWlveWPi+WHhuWkh+Wwsee7qlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfpga7nvanlsYLmlbDmja5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuTnVtTGFiZWwyLnN0cmluZyA9IHNlbGYudXNlckNvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5NZXNzYWdlTGFiZWwyLnN0cmluZyA9IFwi5bey5pyJXCIgKyBzZWxmLnVzZXJDb3VudCArIFwi5L2N5aW95Y+L5YeG5aSH5bCx57uqXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmRhdGFbMF0gPT0gXCIyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/ov5vlhaXot5HpqaznlYzpnaJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5NYXNrU3ByaXRlLm5vZGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuTG9hZDJNYXNrLm5vZGUub3BhY2l0eSA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5ub2RlLmNoaWxkcmVuWzFdLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW5pdFNwcml0ZSgpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFkZExpc3RlbmVyKHdzKTtcbiAgICAgICAgICAgICAgICAgICAgc2hha2VOdW0gPSBkYXRhW2xlbmd0aCArIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgd3Mub25lcnJvciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgY2MubG9nKFwiU2VuZCBUZXh0IGZpcmVkIGFuIGVycm9yXCIpO1xuICAgICAgICB9O1xuICAgICAgICB3cy5vbmNsb3NlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBjYy5sb2coXCJXZWJTb2NrZXQgaW5zdGFuY2UgY2xvc2VkLlwiKTtcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIC8v6YeN5Yqb55uR5ZCs5Ye95pWwXG4gICAgYWRkTGlzdGVuZXI6IGZ1bmN0aW9uIGFkZExpc3RlbmVyKHdzKSB7XG4gICAgICAgIC8v5Yid5aeL5YyW5Z2Q5qCH5pWw57uEXG4gICAgICAgIHRoaXMucXVldWVBcnJheSA9IFtdO1xuICAgICAgICB2YXIgc2hha2VDb3VudCA9IDE7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBjYy5pbnB1dE1hbmFnZXIuc2V0QWNjZWxlcm9tZXRlckludGVydmFsKDEgLyA3KTtcbiAgICAgICAgLy/kvb/nlKjliqDpgJ/orqHkuovku7bnm5HlkKzlmajkuYvliY3vvIzpnIDopoHlhYjlkK/nlKjmraTnoazku7borr7lpIdcbiAgICAgICAgY2MuaW5wdXRNYW5hZ2VyLnNldEFjY2VsZXJvbWV0ZXJFbmFibGVkKHRydWUpO1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5BQ0NFTEVSQVRJT04sXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gY2FsbGJhY2soYWNjZWxFdmVudCwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZXZlbnQuZ2V0Q3VycmVudFRhcmdldCgpO1xuXG4gICAgICAgICAgICAgICAgLy/ojrflj5bliLDlvZPliY3nmoToioLngrnnu4Tku7ZcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQuZ2V0Q29tcG9uZW50KFwiV2FpdGluZ1wiKTtcblxuICAgICAgICAgICAgICAgIC8v6L+b6KGM5pS26ZuG6YeN5Yqb5L2N572u55qE6K6w5b2VXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gYWNjZWxFdmVudC54O1xuICAgICAgICAgICAgICAgIHRoaXMueSA9IGFjY2VsRXZlbnQueTtcbiAgICAgICAgICAgICAgICB0aGlzLnogPSBhY2NlbEV2ZW50Lno7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGVtcExlbmd0aCA9IHRhcmdldC5xdWV1ZUFycmF5Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAodGVtcExlbmd0aCA8IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0LnF1ZXVlQXJyYXkucHVzaCh7eFBvczpNYXRoLmNlaWwoYWNjZWxFdmVudC54KSx5UG9zOk1hdGguY2VpbChhY2NlbEV2ZW50LnkpLHpQb3M6TWF0aC5jZWlsKGFjY2VsRXZlbnQueil9KTtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnF1ZXVlQXJyYXkucHVzaCh7IHhQb3M6IGFjY2VsRXZlbnQueCwgeVBvczogYWNjZWxFdmVudC55LCB6UG9zOiBhY2NlbEV2ZW50LnogfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy/nlKjmnaXoo4HliarmlbDnu4RcbiAgICAgICAgICAgICAgICAgICAgLy90YXJnZXQucXVldWVBcnJheS5zcGxpY2UoNiwgdGVtcExlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAvL+WIpOaWreaYr+WQpui/m+ihjOS6huaRh+WKqFxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmlzU2hha2UodGhpcy54LCB0aGlzLnksIHRoaXMueikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSE55CG5Y+R6YCB6L+H5b6X56e75Yqo5pWw5o2uXG4gICAgICAgICAgICAgICAgICAgICAgICB3cy5zZW5kKFwiTW92ZSxcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFrZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wYXVzZUFsbEVmZmVjdHMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB3cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzLmRpc3RhbmNlLnNoYWtlTnVtID0gc2hha2VDb3VudCAvIDQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXMuZGlzdGFuY2UuZGlzdGFuY2VQZXJTaGFrZSA9IHRhcmdldC53aW5zaXplIC8gcGFyc2VJbnQoc2hha2VOdW0pIC8gNTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy/orrDlvZXnlKjmiLfmkYfmiYvmnLrnmoTmlbDmja5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gZXZlbnQuZGF0YS5zcGxpdChcIi9cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+mBjeWOhuaVsOe7hOi/m+ihjOWvu+aJvui3kemprFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaG9yc2UgaW4gaG9yc2VhcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChob3JzZWFycmF5W2hvcnNlXS5zcHJpdGUueCA+PSAyODApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MubG9nKGhvcnNlYXJyYXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cy5zZW5kKFwidGVtcGhvcnNlLFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3Mub25tZXNzYWdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGV2ZW50LmRhdGEuc3BsaXQoXCIvXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFbMF0gPT0gXCJ0ZW1waG9yc2VcIikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9yc2VhcnJheS5zb3J0KHNlbGYuc29ydEJ5KFwic3ByaXRlXCIpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGhvcnNlIGluIGhvcnNlYXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhvcnNlYXJyYXlbaG9yc2VdLmlkID09IGRhdGFbMV0uc3Vic3RyKDAsIDgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wxleekuue7k+adn+aVsOaNrlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhbmsgPSBob3JzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhbmsrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmxvZyhob3JzZWFycmF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuR2FtZU92ZXJNYXNrLm5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuUmFua0xhYmVsLnN0cmluZyA9IFwi56ysXCIgKyByYW5rICsgXCLlkI1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuU2NvcmVMYWJlbC5zdHJpbmcgPSBNYXRoLmZsb29yKChob3JzZWFycmF5W2hvcnNlXS5zcHJpdGUueCArIDI4MCkgLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5ldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXJzKGNjLkV2ZW50TGlzdGVuZXIuQUNDRUxFUkFUSU9OKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaG9yc2VhcnJheVtob3JzZV0uaWQgPT0gZGF0YVsxXS5zdWJzdHIoMCwgOCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvcnNlYXJyYXlbaG9yc2VdLnNwcml0ZS54ICs9IGRpcy5kaXN0YW5jZS5kaXN0YW5jZVBlclNoYWtlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0YXJnZXQuaG9yc2VBdWRpbywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnF1ZXVlQXJyYXkuc3BsaWNlKDAsIHRlbXBMZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liKnnlKjpgJrorq/nq6/ov5vooYznu5PmnZ/liKTmlq1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3dzLnNlbmQoXCJSYW5rLFwiICsgZGF0YVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy93cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICB2YXIgZGF0YSA9IGV2ZW50LmRhdGEuc3BsaXQoXCIvXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIGlmIChkYXRhWzBdID09IFwiNFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgIHNlbGYuR2FtZU92ZXJNYXNrLm5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgc2VsZi5SYW5rTGFiZWwuc3RyaW5nID0gZGF0YVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgc2VsZi5TY29yZUxhYmVsLnN0cmluZyA9IFwiMjkwXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov5vooYzmjpLluo9cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnF1ZXVlQXJyYXkuc3BsaWNlKDAsIHRlbXBMZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKGxpc3RlbmVyLCB0aGlzLm5vZGUpO1xuICAgIH0sXG4gICAgLy/mjpLluo9cbiAgICBzb3J0Qnk6IGZ1bmN0aW9uIHNvcnRCeShmaWVsZCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBiLnNwcml0ZS54IC0gYS5zcHJpdGUueDtcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIC8v5Yid5aeL5YyW57K+54G15pWw57uE5bm25Yqg6L29XG4gICAgaW5pdFNwcml0ZTogZnVuY3Rpb24gaW5pdFNwcml0ZSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuWzFdLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIC8vIGZvcih2YXIgaT0wO2k8Y29tLmRhdGEudXNlck51bTtpKyspe1xuICAgICAgICB2YXIgYXJyYXlsZW5ndGggPSBob3JzZWFycmF5Lmxlbmd0aDtcbiAgICAgICAgY2MubG9nKGFycmF5bGVuZ3RoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheWxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIC8vdGhpcy5uZXdIb3JzZTIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmhvcnNlMlNwcml0ZVByZWZhYik7XG4gICAgICAgICAgICAvL3RoaXMubmV3VXNlciA9IGNjLmluc3RhbnRpYXRlKHRoaXMudXNlcklmb1ByZWZhYik7XG4gICAgICAgICAgICAvL3RoaXMubmV3SG9yc2UyLnRhZyA9IGk7XG5cbiAgICAgICAgICAgIGhvcnNlYXJyYXlbaV0uc3ByaXRlLnNldFBvc2l0aW9uKGNjLnAoLTI4MCwgNTIwICsgLTkyICogaSkpO1xuICAgICAgICAgICAgaG9yc2VhcnJheVtpXS51c2VyLnNldFBvc2l0aW9uKGNjLnAoLTE1MCwgNTI1ICsgLTkyICogaSkpO1xuXG4gICAgICAgICAgICB0aGlzLm5ld1VzZXIuY2hpbGRyZW5bMF0uZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBob3JzZWFycmF5W2ldLmlkO1xuXG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQoaG9yc2VhcnJheVtpXS5zcHJpdGUpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKGhvcnNlYXJyYXlbaV0udXNlcik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v5Yik5pat5piv5ZCm6L+b6KGM5LqG5pGH5YqoXG4gICAgaXNTaGFrZTogZnVuY3Rpb24gaXNTaGFrZSh4UHJlLCB5UHJlLCB6UHJlKSB7XG4gICAgICAgIC8v5Y+C5pWw55So5p2l6K6w5b2V5b2T5YmN55qE5Z2Q5qCHXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXVlQXJyYXkubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMucXVldWVBcnJheVtpXS54UG9zIC0geFByZSkgPiAwLjIgfHwgTWF0aC5hYnModGhpcy5xdWV1ZUFycmF5W2ldLnlQb3MgLSB5UHJlKSA+IDAuMiB8fCBNYXRoLmFicyh0aGlzLnF1ZXVlQXJyYXlbaV0uelBvcyAtIHpQcmUpID4gMC4yKSB7XG4gICAgICAgICAgICAgICAgeFByZSA9IHRoaXMucXVldWVBcnJheVtpXS54UG9zO1xuICAgICAgICAgICAgICAgIHlQcmUgPSB0aGlzLnF1ZXVlQXJyYXlbaV0ueVBvcztcbiAgICAgICAgICAgICAgICB6UHJlID0gdGhpcy5xdWV1ZUFycmF5W2ldLnpQb3M7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgLy9mb3IgKHZhciBob3JzZSBpbiBob3JzZWFycmF5KSB7XG4gICAgICAgIC8vICAgIGlmIChob3JzZWFycmF5W2hvcnNlXS5zcHJpdGUueCA+PSAyNzApIHtcbiAgICAgICAgLy8gICAgICAgIGNjLmxvZyhob3JzZWFycmF5KVxuICAgICAgICAvLyAgICB9XG4gICAgICAgIC8vfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMmEyNjZMeCsvNUEyYVFCZU82SjBrSGgnLCAnZGJDb25uJyk7XG4vLyBzY3JpcHRzXFxTUUxpdGVcXGRiQ29ubi5qc1xuXG4vLyB2YXIgbXlzcWw9cmVxdWlyZShcIm15c3FsXCIpO1xuXG4vLyB2YXIgY29ubj1teXNxbC5jcmVhdGVDb25uZWN0aW9uKHtcbi8vICAgICBob3N0OicxOTIuMTY4LjEuNTgnLFxuLy8gICAgIHVzZXI6J3Jvb3QnLFxuLy8gICAgIHBhc3N3b3JkOicxMjM0NTYnLFxuLy8gICAgIGRhdGFiYXNlOidzbXNwJ1xuLy8gfSk7XG4vLyBjb25uLmNvbm5lY3QoKTtcbi8vIGNvbm4ucXVlcnkoJ3NlbGVjdCAqIGZyb20gbWVtYmVyJyxcbi8vIGZ1bmN0aW9uKGVycixyb3dzLGZpZWxkcyl7XG4vLyAgICAgZm9yKHZhciByb3cgb2Ygcm93cyl7XG4vLyAgICAgICAgIHZhciByZXN1bHQ9Jyc7XG4vLyAgICAgICAgIGZvcih2YXIgZmllbGQgb2YgZmllbGRzKXtcbi8vICAgICAgICAgICAgIHJlc3VsdCs9KCcnK3Jvd1tmaWVsZC5uYW1lXSk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbi8vICAgICB9XG4vLyB9KTtcbi8vIGNvbm4uZW5kKCk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5MTMyYm5BYmcxUFc3SXdPQ1NLSGlQaycsICdob3JzZVNwcml0ZScpO1xuLy8gc2NyaXB0c1xcU3ByaXRlXFxob3JzZVNwcml0ZS5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICB4UG9zOiAwLFxuICAgICAgICB5UG9zOiAwXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgYW5pbSA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIHZhciBhbmltU3RhdGUgPSBhbmltLnBsYXkoJ2hvcnNlQW5pbWF0aW9uJyk7XG5cbiAgICAgICAgLy8g6K6+572u5Yqo55S75b6q546v5qyh5pWw5Li65peg6ZmQ5qyhXG4gICAgICAgIGFuaW1TdGF0ZS5yZXBlYXRDb3VudCA9IEluZmluaXR5O1xuICAgICAgICBhbmltU3RhdGUuc3BlZWQgPSAxLjI7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiXX0=
