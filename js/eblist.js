/**
 * @author who
 */

function EBList( container , nodeEvents , nodeClassName, nodeInnerFunc){
	this.set("obj" ,container);
	this.set("nodeEvents" ,nodeEvents);
	this.set("className" ,nodeClassName);
	this.set("innerHTML" ,nodeInnerFunc);
	this.set("data",[]);
}

EBList.prototype = {
	data : null,
	obj : null,
	nodeEvents : null,
	sel : -1,	// has room to be turned into an array for multiple selection
	
	set : function set(type , value){
		this[type] = value;
	},
	
	add : function addNode( data ){
		var node = new EBListItem(data,this.className,this.innerHTML,this.nodeEvents);
		this.data.push(node);
		this.printData();
		
		return node;
	},
	
	remove : function removeNode( index ){
		if((typeof(index)).toLowerCase() == "object"){
			var index = this.getIndex(index,0,(this.data.length - 1));
		}
		if((typeof(index)).toLowerCase() == "number"){
			if(index < 0 || index >= this.data.length){return false;}
			this.data.splice( index , 1 );
			this.printData();
			return index;
		}else{
			return -1;
		}
	},
	
	edit : function editNodeInList( index , data){
		var node = this.data[index];
		node.edit(data);
		this.obj.childNodes[index].innerHTML = node.getInnerHTML();
	},
	
	printData : function printData(){
		var limit = this.data.length;
		var html = '';
		for(var x = 0; x < limit; x++){
			var node = this.data[x];
			node.set("index",x);
			
			html += node.getOutterHTML();
		}
		this.obj.innerHTML = html;
	},
	
	select : function select( index ){
		this.deselect();
		if(index >= 0 && index < this.data.length){
			var obj = this.obj.childNodes[index];
			obj.className += " selected";
			this.sel = index;
		}
	},
	
	deselect : function deselect(){
		if(this.sel >= 0){
			var obj = this.obj.childNodes[this.sel];
			if(obj)
				obj.className = obj.className.replace(/(\sselected)|(selected)/,'');
			this.sel = -1;
		}
	},
	
	rollover  : function rollover( index ){
		var obj = this.obj.childNodes[index];
			obj.className += " hover";
	},
	
	rollout : function rollout( index ){
		var obj = this.obj.childNodes[index];
			obj.className = obj.className.replace(/(\shover)|(hover)/,'');
	},
	
	getIndex : function getIndex( key ){
		var index = null;
		var limit = this.data.length;
		for(var x = 0; x < limit; x++){
			if(this.data[x] == key){
				return x;
			}
		}
		return -1;
	}
}

function EBListItem( data , className , innerHTMLFunc,events){
	this.edit( data );
	this.set("getInnerHTML",innerHTMLFunc);
	this.set("className",className);
	this.set("evtLis",events);
}

EBListItem.prototype = {
	index : -1,
	
	set : function setNode(type , value){
		this[type] = value;
	},
	
	edit : function editNode( data ){
		for(key in data){
			this.set(key,data[key]);
		}
	},
	
	getOutterHTML : function getOutterHTML(){
		var html = 	'<div '+
					this.getEventString()+
					'class="'+this.className+'">'+
						((this.getInnerHTML)? this.getInnerHTML(): '') +
					'</div>';
		return html;
	},
	
	getEventString : function(){
		var str = '';
		for(key in this.evtLis){
			str += ' '+key+' = "'+this.evtLis[key]+'('+this.index+')"';
		}
		
		return str;
	}	
}