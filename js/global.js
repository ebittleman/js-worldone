/**
 * @author who
 */
function $( id ){
	return document.getElementById( id );
}

	function getObject(id){
		return document.getElementById(id);
	}
	
	function getDim(obj,flag){
		if(!obj || obj.nodeType != 1)return 0;
		return ((flag)? obj.offsetWidth: obj.offsetHeight);
	}
	
	function getPos(obj,flag){
		if(obj.nodeType != 1)return 0;
		return ((flag)? obj.offsetLeft : obj.offsetTop);
	}
	
	function moveCursor(obj, flag){
		var temp = ((flag)? obj.nextSibling : obj.previousSibling );
		if(temp && temp.nodeType != 1)
			return moveCursor(temp, flag);
		return temp;
	}
	
	function setDim(obj,offset,flag){
		var size = (offset) + "px";
		if(flag){obj.style.width = size;}
		else{obj.style.height = size;}
	}
	
	function setPos(obj,offset,flag){
		var size = (offset) + "px";
		if(flag){obj.style.left = size;}
		else{obj.style.top = size;}
	}

	function setOpacity(obj ,value) {
		obj.style.opacity = value/100;
		obj.style.filter = 'alpha(opacity=' + value + ')';
		obj.opacity = value;
	}
	
	function getOpacity(obj){
		return ((obj.opacity)? obj.opacity : (obj.opacity = 100))
	}
	
	function calcFill(obj , flag){
		var temp = obj;
		var offset = 0;
		while((temp = moveCursor(temp))){offset += parseInt(getDim(temp,flag));}
		temp = obj;
		while((temp = moveCursor(temp,true))){offset += parseInt(getDim(temp,flag));}
		return offset;
	}
	
	function fill( obj , flag ){
		var offset = getDim(obj.parentNode,flag) - calcFill(obj , flag);
		setDim(obj,(offset),flag);
		return offset;
	}
	
	function hide(obj){obj.className += " hidden";}
	function show(obj){obj.className = obj.className.replace(/(hidden)|(\shidden)/,'');}
	function isEmpty(param){
		if(parseInt(param) == 0)return false;
		if(param == null)return true;
	}
	function dumpObj(obj){
		var msg='';
		for(key in obj){
			msg += key+" : "+obj[key]+"\n<br />";
		}
		return msg;
	}

/*******************************************
 * 
 * 		Drag and Drop
 * 
 ******************************************/
var mousedown = false;
var mouseX = 0;
var mouseY = 0;
var topZIndex = 2000;

function registerMove( obj ){
	var newX = ((mouseX - obj.mouseStart.x)+obj.objStart.x);
	var newY = ((mouseY - obj.mouseStart.y)+ obj.objStart.y);
	obj.style.left = ((newX < 0)? 0 : ((newX > obj.objStart.w)?obj.objStart.w:newX))+"px";
	obj.style.top = ((newY < 0)? 0 : ((newY > obj.objStart.h)?obj.objStart.h:newY))+"px";
}
function dragParent(e,obj){
	drag( e, obj.parentNode.parentNode );
}
function dropParent(e,obj){
	drop(e,obj.parentNode.parentNode);
}
function drag( e, obj ){
	mousedown = true;
	setMousePos(e);
	var timeOutFunc = function(){
		if(mousedown){
				moveObj = document.createElement('div');//obj.cloneNode(true);
				setDim(moveObj,getDim(obj,true),true);
				setDim(moveObj,getDim(obj));
				moveObj.onmouseup = function(){drop(e, moveObj )};
				moveObj.cloner = obj;
				moveObj.className = "moveObj";
				moveObj.objStart = {x:(getPos(obj,true)),y:(getPos(obj)),w:(getDim(obj.parentNode,true) - getDim(obj,true)),h:(getDim(obj.parentNode) - getDim(obj))};
				moveObj.mouseStart = {x:mouseX,y:mouseY};
				
				try{obj.parentNode.appendChild(moveObj);bringToTop(moveObj);setTimeout(function(){hide(obj);},10);}
				catch(ex){drop(e, obj );}
				docmove["drag"] = function(e){setMousePos(e);registerMove(moveObj);}
		}else{drop( e,obj );}
	}
	setTimeout(timeOutFunc,250);
}
function bringToTop(obj){obj.style.zIndex = ++topZIndex;}
function drop( e,obj ){
	mousedown = false;
	delete docmove["drag"];
	if(obj.cloner){
		obj.cloner.style.left = obj.style.left;
		obj.cloner.style.top = obj.style.top;
		try{bringToTop(obj.cloner);show(obj.cloner);obj.parentNode.removeChild(obj);}
		catch(ex){}
	}
}

var	setMousePos = function( e ){
	var posx = 0;
	var posy = 0;
	if (!e) var e = window.event;
	posx = ((e.pageX )? e.pageX : (e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft));
	posy = ((e.pageY )? e.pageY : (e.clientY + document.body.scrollTop + document.documentElement.scrollTop));
	mouseX = posx;
	mouseY = posy;
	return true;
}

/**********************************************************************
 * 
 *			Event Attachment
 * 
 * *******************************************************************/
var docmove = {};
function docMoveFunc(e){
	for(key in docmove){
		docmove[key](e);
	}
}
document.onmousemove = docMoveFunc;

/*******************************************************
 * 
 * 		Animation
 * 
 ******************************************************/
var tweening = false;
var nextAni = [];
function animate(obj,tweenObj,moves,callfunc,callback){
	if(tweening){
		//if(callfunc)
		//nextAni.unshift(callfunc);
		return true;
	}
	tweening = true;
	var current = {x:getPos(obj,true),y:getPos(obj),w:getDim(obj,true),h:getDim(obj),a:getOpacity(obj)};
	var delta = {
		x:((!isEmpty(tweenObj.x))? ((tweenObj.x - current.x)/moves):0),
		y:((!isEmpty(tweenObj.y))? ((tweenObj.y - current.y)/moves):0),
		w:((!isEmpty(tweenObj.w))? ((tweenObj.w - current.w)/moves):0),
		h:((!isEmpty(tweenObj.h))? ((tweenObj.h - current.h)/moves):0),
		a:((!isEmpty(tweenObj.a))? ((tweenObj.a - current.a)/moves):0)
	}
	var buffer = [];
	for(var x = 0; x < moves; x++){
		var data = {};
		for(key in tweenObj){
			data[key] = current[key] += delta[key]
		}
		buffer.unshift(data);
	}
	buffer.unshift(tweenObj);
	//setTimeout(function(){aniTimeout(obj,buffer)},0);
	aniTimeout(obj,buffer,callback);
	return true;
}

function aniTimeout(obj,buffer,callback){
	var frame = buffer.pop();
	if(frame){
		if(frame.x)
			setPos(obj,frame.x,true);
		if(frame.y)
			setPos(obj,frame.y);
		if(frame.w)
			setDim(obj,frame.w,true);
		if(frame.h)
			setDim(obj,frame.h);
		if(frame.a)
			setOpacity(obj,frame.a);
		setTimeout(function(){aniTimeout(obj,buffer,callback)},33);
	}else{
		tweening = false;
		if(callback)callback();
		
		//var func = nextAni.pop();
			//dumpNextArray();
		/*while(func && !(func())){
			delete func;
			func = nextAni.pop();
			//dumpNextArray();
		}	*/
		
	}
}