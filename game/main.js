$(function() {
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var canvasW = 800;
    var canvasH = 800*9/16;
    canvas.width = canvasW;
    canvas.height = canvasH;

    var lastFrameTime;
    var lastFpsUpdate;
    var fps;
    var frameCount;
    var reqFrameId;
    var gameState;
    /* enum for game state */
    var State = {
        LOADED : "loaded",
        RUNNING : "running",
        PAUSED : "paused",
    };
    var p1, p2;

    /* player object constructor */
    function Player() {
        this.pos = { x: 0, y: 0 };
        this.color = "blue";
        this.v = { x: 20, y: 0 };
        this.size = 10;
        this.active = false;
    }

    Object.defineProperty(Player.prototype, 'bounds', {
        get: function() {
            return {
                top: this.pos.y,
                bottom: this.pos.y + this.size,
                left: this.pos.x,
                right: this.pos.x + this.size,
            }
        }
    });

    Player.prototype.spawn = function(px, py) {
        this.pos = {x: px, y: py};
        this.active = true;
    };

    Player.prototype.update = function(time) {
        if (this.active == false) return;

        this.pos.x += this.v.x * time;
        this.pos.y += this.v.y * time;

        /* keep it in canvas bounds */
        if (this.bounds.left < 0)
            this.pos.x += -this.bounds.left;
        if (this.bounds.right > canvasW)
            this.pos.x -= this.bounds.right - canvasW;
        if (this.bounds.top < 0)
            this.pos.y += -this.bounds.top;
        if (this.bounds.bottom > canvasH)
            this.pos.y -= this.bounds.bottom - canvasH;
    };

    Player.prototype.render = function() {
        if (this.active == false) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(Math.round(this.pos.x),
            Math.round(this.pos.y), this.size, this.size);
    };

    function update(delta) {
        /* time in seconds, to be simulated */
        time = delta/1000;
        p1.update(time);
        //p2.update(time);
    }

    function render() {
        ctx.clearRect(0, 0, canvasW, canvasH);
        p1.render();
        //p2.render();

        /* display current fps */
        $("#fps").html(Math.round(fps));
    }

    function updateFps(timeStamp) {
        var alpha = 0.5;
        // update fps every second
        if (timeStamp > lastFpsUpdate + 1000) {
            // compute the new FPS running average
            fps = alpha * frameCount + (1 - alpha) * fps;
            lastFpsUpdate = timeStamp;
            frameCount = 0;
        }
        frameCount++;
    }

    function mainLoop(timeStamp) {
        delta = timeStamp - lastFrameTime;
        lastFrameTime = timeStamp;

        updateFps(timeStamp);

        /* game logic */
        update(delta);
        render();

        /* request next frame */
        reqFrameId = requestAnimationFrame(mainLoop);
    }

    function initialize() {
        p1 = new Player();
        p1.color = "blue";
        p1.spawn(canvasW*0.25, canvasH*0.75);

        //p2 = Player();
        //p2.color = "green";
        //p2.spawn(canvasW*0.75, canvasH*0.75);
    }

    function startGame() {
        if (gameState == State.RUNNING) {
            return;
        }
        if (gameState == State.LOADED) {
            initialize();
        }
        gameState = State.RUNNING;
        /* start main loop with a dummy first frame */
        requestAnimationFrame(function (timeStamp) {
            /* TODO: add first frame init code */
            lastFrameTime = timeStamp;
            lastFpsUpdate = timeStamp-1000;
            frameCount = 0;
            fps = 0;
            reqFrameId = requestAnimationFrame(mainLoop);
        });
        $("#btnStart").html("Stop");
        console.log("started");
    }

    function stopGame() {
        if (gameState == State.LOADED) {
            return;
        }
        cancelAnimationFrame(reqFrameId);
        gameState = State.LOADED;
        $("#fps").html("0");
        $("#btnStart").html("Start");
    }

    function pauseGame() {
        console.log("paused");
        if (gameState != State.RUNNING) {
            return;
        }
        cancelAnimationFrame(reqFrameId);
        gameState = State.PAUSED;
        $("#fps").html("0");
    }

    $("#btnStart").click(function(){
        if (gameState == State.LOADED) {
            startGame();
        } else if (gameState == State.RUNNING) {
            stopGame();
        }
    });

    $(window).blur = function() {
        pauseGame();
    }

    $(window).focus = function() {
        startGame();
    }

    gameState = State.LOADED;
    console.log("game loaded.");

    /* temp : start automatically */
    startGame();
});
