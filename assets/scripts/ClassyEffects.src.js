/*!
 * jQuery ClassyEffects library
 * http://www.class.pm/projects/jquery/classyeffects
 *
 * Copyright 2011 - 2013, Class.PM www.class.pm
 * Written by Marius Stanciu - Sergiu <marius@picozu.net>
 * Licensed under the GPL Version 3 license.
 * Version 1.0.0
 *
 */

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
        return window.setTimeout(callback, 17);
    });
}

if (!window.cancelRequestAnimationFrame) {
    window.cancelRequestAnimationFrame = (window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.clearTimeout);
}

function ClassyEffects(params) {
    var self = this;

    this.pointObj = function(x, y) {
        this.x = x;
        this.y = y;
    };

    this.listObj = function() {
        this.first = null;
    };

    this.raindropObj = function(x, y) {
        this.lifespan;
        this.breakawayTime;
        this.radius = 1.5;
        this.next;
        this.prev;
        this.visible = false;
        this.splashing = true;
        this.atFullSpeed = false;

        this.__constructor = function(x, y) {
            this.accel = new self.pointObj(0, 0);
            this.vel = new self.pointObj(0, 0);
            this.color = 0xDDDDDD;
            this.pos = new self.pointObj(x, y);
            this.p0 = new self.pointObj(x, y);
            this.p1 = new self.pointObj(x, y);
            this.lastPos = new self.pointObj(x, y);
            this.lastLastPos = new self.pointObj(x, y);
        };

        this.reset = function(x, y) {
            this.pos = new self.pointObj(x, y);
            this.p0 = new self.pointObj(x, y);
            this.p1 = new self.pointObj(x, y);
            this.lastPos = new self.pointObj(x, y);
            this.lastLastPos = new self.pointObj(x, y);
        };

        this.__constructor(x, y);
    };

    this.effectObj = function(width, height, canvas) {
        this.gravity = 0.1;
        this.ctx = canvas.getContext("2d");
        this.onStageList = new self.listObj();
        this.recycleBin = new self.listObj();
        this.numOnStage = 0;
        this.numInRecycleBin = 0;
        this.ctx.canvas.width = this.displayWidth = width;
        this.ctx.canvas.height = this.displayHeight = height;
        this.wind = this.defaultInitialVelocity = new self.pointObj(0, 3);
        this.initialVelocityVariancePercent = 0.8;
        this.initialVelocityVarianceX = 0;
        this.initialVelocityVarianceY = 5;
        this.dropThickness = 1;
        this.windOnSplash = 0.2;
        this.noSplashes = false;
        this.dropsPerFrame = 3;
        this.dropColor = "#FFFFFF";
        this.randomizeColor = true;
        this.dropLength = "short";
        this.dropAlpha = 1;
        this.splashAlpha = 1;
        this.splashThickness = 1;
        this.splashMaxVelX = 0.6;
        this.splashMinVelX = -0.6;
        this.splashMinVelY = 0.33;
        this.splashMaxVelY = 1.5;
        this.minSplashDrops = 4;
        this.maxSplashDrops = 80;
        this.removeDropsOutsideXRange = true;
        this.globalBreakawayTime = 0;
        this.breakawayTimeVariance = 0;
        this.left;
        this.right;
        this.param;
        this.r;
        this.g;
        this.b;
        this.outsideTest;
        this.variance;
        this.dropX;
        this.radius = 1.5;
        this.movePoints = new Array();
        this.colorTransform = false;
        this.stopped = false;
        this.init = false;
        this.waitCount = 0;
        this.count = 0;
        this.anim = true;
        this.linePoints = new Array();

        this.start = function () {
            var c = Math.random() * 0.05;
            if (this.wind.x == undefined) {
                this.wind.x = (1.5 + 0.5 * Math.cos(7.5 * c)) * Math.pow(Math.cos(7 * c + Math.cos(23 * c)), 2)
            }
            if (this.init && this.numOnStage == 0) {
                this.anim = false;
            }
            if (!this.stopped) {
                this.count++;
                if (this.count >= this.waitCount) {
                    this.count = 0;
                    for (var b = 0; b < this.dropsPerFrame; b++) {
                        var a = this.droplet(Math.random() * this.displayWidth, Math.random());
                        a.radius = 1 + 1 * Math.random();
                        if (this.globalBreakawayTime == 0) {
                            a.atFullSpeed = true;
                        }
                    }
                }
            }
            this.update();
            if (this.anim) {
                window.requestAnimationFrame($.proxy(this.start, this));
            }
            return this;
        };

        this.stop = function () {
            this.stopped = true;
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        };

        this.droplet = function (d, j, i, b, h, f, k, c) {
            var e, g, a;
            this.numOnStage++;
            this.init = true;
            g = this.dropColor;
            if (arguments.length > 3) {
                a = arguments[3];
            }
            else {
                a = this.dropThickness;
            }
            if (this.recycleBin.first != null) {
                this.numInRecycleBin--;
                e = this.recycleBin.first;
                if (e.next != null) {
                    this.recycleBin.first = e.next;
                    e.next.prev = null;
                }
                else {
                    this.recycleBin.first = null;
                }
                e.reset(d, j);
                e.visible = true;
            }
            else {
                e = new self.raindropObj(d, j);
                e.visible = true;
            }
            e.thickness = a;
            e.color = g;
            if (this.onStageList.first == null) {
                this.onStageList.first = e;
                e.prev = null;
                e.next = null;
            }
            else {
                e.next = this.onStageList.first;
                this.onStageList.first.prev = e;
                this.onStageList.first = e;
                e.prev = null;
            }
            if (h == undefined) {
                this.variance = (1 + Math.random() * this.initialVelocityVariancePercent);
                e.vel.x = this.defaultInitialVelocity.x * this.variance + Math.random() * this.initialVelocityVarianceX;
                e.vel.y = this.defaultInitialVelocity.y * this.variance + Math.random() * this.initialVelocityVarianceY;
            }
            else {
                e.vel.x = h;
                e.vel.y = f;
            }
            if (k != undefined) {
                e.alpha = k;
            }
            else {
                e.alpha = this.dropAlpha;
            }
            if (c != undefined) {
                e.splashing = c;
            }
            else {
                e.splashing = !this.noSplashes;
            }
            e.atFullSpeed = false;
            e.lifespan = 0;
            e.breakawayTime = this.globalBreakawayTime * (1 + this.breakawayTimeVariance * Math.random());
            return e;
        };

        this.update = function () {
            if (!this.colorTransform) {
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            }
            var b = this.onStageList.first, f, c = 0;
            this.movePoints = new Array();
            this.linePoints = new Array();
            while (b != null) {
                c++;
                f = b.next;
                b.lifespan++;
                if (b.lifespan > b.breakawayTime) {
                    b.lastLastPos.x = b.lastPos.x;
                    b.lastLastPos.y = b.lastPos.y;
                    b.lastPos.x = b.p1.x;
                    b.lastPos.y = b.p1.y;
                    if (!b.atFullSpeed) {
                        b.vel.y += this.gravity;
                    }
                    if (b.splashing) {
                        b.p1.x += b.vel.x + this.wind.x;
                        b.p1.y += b.vel.y + this.wind.y;
                    }
                    else {
                        b.p1.x += b.vel.x + this.windOnSplash * this.wind.x;
                        b.p1.y += b.vel.y + this.windOnSplash * this.wind.y;
                    }
                    if (this.dropLength == "long") {
                        b.p0.x = b.lastLastPos.x;
                        b.p0.y = b.lastLastPos.y;
                    }
                    else {
                        if (this.dropLength == "short") {
                            b.p0.x = b.lastPos.x;
                            b.p0.y = b.lastPos.y;
                        }
                        else {
                        }
                    }
                    if (this.removeDropsOutsideXRange) {
                        this.left = Math.min(b.p0.x, b.p1.x);
                        this.right = Math.max(b.p0.x, b.p1.x);
                        this.outsideTest = ((b.p0.y > this.displayHeight) || (this.right < 0) || (this.left > this.displayWidth));
                        if ((this.right < 0) || (this.left > this.displayWidth)) {
                            b.splashing = false;
                        }
                    }
                    else {
                        this.outsideTest = (b.p0.y > this.displayHeight);
                    }
                    if (this.outsideTest) {
                        this.recycle(b);
                    }
                }
                if (b.lifespan < b.breakawayTime) {
                    this.ctx.fillStyle = this.dropColor;
                    this.ctx.beginPath();
                    this.ctx.arc(b.p1.x - this.radius, b.p1.y, 2 * this.radius, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
                else {
                    this.movePoints.push({
                        x: b.p0.x,
                        y: b.p0.y
                    });
                    this.linePoints.push({
                        x: b.p1.x,
                        y: b.p1.y
                    });
                }
                b = f;
            }
            this.ctx.strokeStyle = this.dropColor;
            this.ctx.lineWidth = this.dropThickness;
            this.ctx.globalAlpha = this.dropAlpha;
            this.ctx.beginPath();
            var a = this.onStageList.first;
            for (var d = 0; d < this.numOnStage; d++) {
                this.ctx.moveTo(a.p0.x, a.p0.y);
                this.ctx.lineTo(a.p1.x, a.p1.y);
                a = a.next;
            }
            this.ctx.stroke();
            if (this.colorTransform === true) {
                var g = this.ctx.getImageData(0, 0, this.displayWidth, this.displayHeight);
                var e = g.data;
                for (var d = 0; d < e.length; d += 4) {
                    e[d + 3] = e[d + 3] * 0.7;
                }
                this.ctx.putImageData(g, 0, 0);
            }
        };

        this.recycle = function (a) {
            this.numOnStage--;
            this.numInRecycleBin++;
            if (a.splashing) {
                this.dropX = a.p0.x + (this.displayHeight - a.p0.y) * (a.p1.x - a.p0.x) / (a.p1.y - a.p0.y);
                this.splash(this.dropX, a.color);
            }
            a.visible = false;
            if (this.onStageList.first == a) {
                if (a.next != null) {
                    a.next.prev = null;
                    this.onStageList.first = a.next;
                }
                else {
                    this.onStageList.first = null;
                }
            }
            else {
                if (a.next == null) {
                    a.prev.next = null;
                }
                else {
                    a.prev.next = a.next;
                    a.next.prev = a.prev;
                }
            }
            if (this.recycleBin.first == null) {
                this.recycleBin.first = a;
                a.prev = null;
                a.next = null;
            }
            else {
                a.next = this.recycleBin.first;
                this.recycleBin.first.prev = a;
                this.recycleBin.first = a;
                a.prev = null;
            }
        };

        this.splash = function (h, c) {
            var g = Math.ceil(this.minSplashDrops + Math.random() * (this.maxSplashDrops - this.minSplashDrops));
            for (var e = 0; e < g - 1; e++) {
                var a = 0.75 + 0.75 * Math.random();
                var f = a * (this.splashMinVelX + Math.random() * (this.splashMaxVelX - this.splashMinVelX));
                var d = -a * (this.splashMinVelY + Math.random() * (this.splashMaxVelY - this.splashMinVelY));
                var b = this.droplet(h, this.displayHeight, c, this.splashThickness, f, d, this.splashAlpha, false);
                b.breakawayTime = 0;
            }
        };
    };

    this.__constructor = function(params) {
        var _c = params.container;
        this.effect = new self.effectObj(_c.width(), _c.height(), _c[0]);
        switch (params.effect) {
            case 'rain':
                this.effect.colorTransform = true;
                this.effect.dropThickness = 2;
                this.effect.dropAlpha = 0.8;
                this.effect.splashAlpha = 0.8;
                this.effect.defaultInitialVelocity = new self.pointObj(0, 15);
                this.effect.splashMaxVelX = .6;
                this.effect.splashMinVelX = -.6;
                this.effect.splashMinVelY = 0.33;
                this.effect.splashMaxVelY = 1.5;
                this.effect.minSplashDrops = 4;
                this.effect.maxSplashDrops = 80;
                this.effect.removeDropsOutsideXRange = false;
                this.effect.breakawayTimeVariance = 0.5;
                this.effect.wind = new self.pointObj(1, 1);
                this.effect.waitCount = 4;
                this.effect.count = this.effect.waitCount - 1;
                break;
            case 'drip':
                this.effect.dropColor = "#2f96b4";
                this.effect.colorTransform = true;
                this.effect.dropThickness = 1.5;
                this.effect.gravity = 0.15;
                this.effect.defaultInitialVelocity = new self.pointObj(0, 8);
                this.effect.initialVelocityVariancePercent = 0;
                this.effect.initialVelocityVarianceY = 02;
                this.effect.dropLength = "long";
                this.effect.splashMaxVelX = 1;
                this.effect.splashMinVelX = -1;
                this.effect.splashMinVelY = 1;
                this.effect.splashMaxVelY = 2;
                this.effect.minSplashDrops = 10;
                this.effect.maxSplashDrops = 15;
                this.effect.removeDropsOutsideXRange = false;
                this.effect.globalBreakawayTime = 100;
                this.effect.breakawayTimeVariance = 0.5;
                this.effect.wind = new self.pointObj(0, 1);
                this.effect.dropsPerFrame = 1;
                this.effect.waitCount = 15;
                this.effect.count = this.effect.waitCount - 1;
                break;
            case 'snow':
                this.effect.noSplashes = true;
                this.effect.dropThickness = 2;
                this.effect.splashThickness = 1;
                this.effect.dropAlpha = 0.7;
                this.effect.defaultInitialVelocity = new self.pointObj(0, 0);
                this.effect.initialVelocityVariancePercent = 0;
                this.effect.initialVelocityVarianceX = 1;
                this.effect.initialVelocityVarianceY = 1;
                this.effect.dropLength = "long";
                this.effect.breakawayTimeVariance = 0.5;
                this.effect.wind = new self.pointObj(0, 5);
                this.effect.dropsPerFrame = 5;
                this.effect.waitCount = 3;
                this.effect.count = this.effect.waitCount - 1;
                break;
            case 'tadpoles':
                this.effect.colorTransform = true;
                this.effect.noSplashes = true;
                this.effect.dropThickness = 3;
                this.effect.splashThickness = 1;
                this.effect.dropAlpha = 0.7;
                this.effect.defaultInitialVelocity = new self.pointObj(0, 0);
                this.effect.initialVelocityVariancePercent = 0;
                this.effect.initialVelocityVarianceX = 1;
                this.effect.initialVelocityVarianceY = 1;
                this.effect.dropLength = "long";
                this.effect.breakawayTimeVariance = 0.5;
                this.effect.wind = new self.pointObj(0, 5);
                this.effect.dropsPerFrame = 15;
                this.effect.waitCount = 3;
                this.effect.count = this.effect.waitCount - 1;
                break;
        }
        if (params.autostart === false) {
            return this.effect;
        }
        else {
            return this.effect.start();
        }
    };

    return this.__constructor(params);
};