$(function() {
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	canvas.width = 800;
	canvas.height = 800*9/16;
	
	var lastFrameTime = 0;
	
	function mainLoop(timeStamp) {
		delta = timeStamp - lastFrameTime;
		console.log("delta = " + delta);
		lastFrameTime = timeStamp;
		requestAnimationFrame(mainLoop);
	}
	
	mainLoop();
	
	console.log("loaded.");
});