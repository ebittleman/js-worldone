/**
 * @author who
 */
function worldBrick(x,y){
	this.x = x;
	this.y = y;
}
worldBrick.prototype = {
	w:50,
	h:45,
	a:100,
	bx:0,
	dx:0,
	by:20,
	dy:0,
	BG : 'url(./imgs/brick.jpg)',
	bC : function(){this.dy = -2;},
	tC : function(){this.dy = 0;}
}
