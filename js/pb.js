/**
 * @author who
 */
function pbNodeInnerHTML(){
	var html = 	'<div class="pbNodeName">'+this.name+'</div>'+
				'<div class="pbInfo">'+
					'<div class="pbNodepNum">'+this.pNum+'</div>'+
					'<div class="pbNodeEmail">'+this.email+'</div>'+
				'</div>';
	return html;
}

function phoneForm( ){
	this.pbName = $('pbName');
	this.pbPnum = $('pbPnum');
	this.pbEmail = $('pbEmail');
	
	this.pbSubmit = $('pbSubmit');
	this.pbCancel = $('pbCancel');
	this.pbDelete = $('pbDelete');
	
	var thisForm = this;
	this.pbSubmit.onclick = function(){thisForm.saveData();};
	this.pbCancel.onclick = function(){thisForm.cancelData();};
	this.pbDelete.onclick = function(){thisForm.deleteData();};
}

phoneForm.prototype = {
	pbName : null,
	pbPnum : null,
	pbEmail : null,
	
	pbSubmit : null,
	pbCancel : null,
	pbDelete : null,
	
	pbIndex : -1,
	
	loadData : function( index ){
		if(this.pbIndex == index){
			this.cancelData();
			return false;
		}
		
		var pbNode = pb.data[index];
		
		this.pbName.value = pbNode.name;
		this.pbPnum.value = pbNode.pNum;
		this.pbEmail.value = pbNode.email;
		this.pbIndex = parseInt(index);
		
		this.pbName.focus();
		this.pbName.select();
		pb.select(index);
	},
	
	cancelData : function(){
		this.pbName.value = '';
		this.pbPnum.value = '';
		this.pbEmail.value = '';
		this.pbIndex = -1;
		pb.deselect();
	},
	
	saveData : function(){
		if(this.pbIndex < 0){
			pb.add(this.getDataObj());
		}else{
			pb.edit(this.pbIndex,this.getDataObj());
		}
		this.cancelData();
	},
	
	deleteData : function(){
		pb.remove(this.pbIndex);
		this.cancelData();
	},
	
	getDataObj : function(){
		return {name : this.pbName.value,
				pNum : this.pbPnum.value,
				email : this.pbEmail.value};
	}
}