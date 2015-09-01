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

    function Player() {
        return {
            pos: { x: 0, y: 0 },
            color: "blue",
            v: { x: 0, y: 0 },
            size: 10,
            get bounds() {
                return {
                    top: this.pos.y,
                    bottom: this.pos.y + this.size,
                    left: this.pos.x,
                    right: this.pos.x + this.size,
                }
            },

            spawn: function (px, py) {
                this.pos = {x: px, y: py};
            },

            update: function (time) {
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
            },

            render: function () {
                ctx.fillStyle = this.color;
                ctx.fillRect(Math.round(this.pos.x), Math.round(this.pos.y), this.size, this.size);
            },
        };
    }

    function update(delta) {
        /* time in seconds, to be simulated */
        time = delta/1000;
        p1.update(time);
        p2.update(time);
    }

    function render() {
        ctx.clearRect(0, 0, canvasW, canvasH);
        p1.render();
        p2.render();

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
        p1 = Player();
        p1.color = "blue";
        p1.spawn(canvasW*0.25, canvasH*0.75);

        p2 = Player();
        p2.color = "green";
        p2.spawn(canvasW*0.75, canvasH*0.75);
    }

    function startGame() {
        if (gameState == State.RUNNING) {
            return;
        }
        gameState = State.RUNNING;
        /* start main loop with a dummy first frame */
        requestAnimationFrame(function (timeStamp) {
            /* TODO: add first frame init code */
            lastFrameTime = timeStamp;
            lastFpsUpdate = timeStamp-1000;
            frameCount = 0;
            fps = 0;
            initialize();
            reqFrameId = requestAnimationFrame(mainLoop);
        });
        $("#btnStart").html("Stop");
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

    $("#btnStart").click(function(){
        if (gameState == State.LOADED) {
            startGame();
        } else if (gameState == State.RUNNING) {
            stopGame();
        }
    });

    gameState = State.LOADED;
    console.log("game loaded.");

    /* temp : start automatically */
    startGame();
});