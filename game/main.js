$(function() {
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var canvasW = 800;
	var canvasH = 800*9/16;
	canvas.width = canvasW;
	canvas.height = canvasH;	
	
	var lastFrameTime = 0;
	var curFps;
	var gameState = "stopped";
	
	var player = {
		x : 10.0,
		y : 10.0,
		color : "blue",
		v : 5.0,
		size : 10,
		render : function (c) {
			c.fillStyle = this.color;
			c.fillRect(Math.round(this.x), Math.round(this.y), this.size, this.size);
		}
	};
	
	function update(delta) {
		var xx = player.v * (delta / 1000);
		//player.x += player.v * (delta / 1000);
		player.x += xx;
		console.log("px = " + player.x);
		console.log("xx = " + xx);
	}
	
	function render() {
		ctx.clearRect(0, 0, canvasW, canvasH);
		player.render(ctx);
	}
	
	function mainLoop(timeStamp) {
		delta = timeStamp - lastFrameTime;
		lastFrameTime = timeStamp;
		/* measure frame rate */
		curFps = Math.round((1/delta)*1000);
		
		/* game logic */
		update(delta);
		render();
		
		if (gameState == "running") {
			$("#fps").html("FPS = " + curFps);
			/* request next frame */
			requestAnimationFrame(mainLoop);
		} else {
			$("#fps").html("FPS = 0");
		}
	}
	
	$("#btnStart").click(function(){
		if (gameState == "stopped" || gameState == "paused") {
			gameState = "running";			
			mainLoop();
			$("#btnStart").html("Pause");
		} else if (gameState == "running") {
			gameState = "paused";
			$("#btnStart").html("Start");
		}
    });
	
	gameState = "running";
	mainLoop();
	
	console.log("loaded.");
});