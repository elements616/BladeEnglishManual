/*
   Copyright (c) 2002 SHINTEC HOZUMI Co.,LTD.
   All Rights Reserved. 
*/

function EWDItem(code, type)
{
	this.code = code;
	this.type = adjustType(type);
	this.subType = type;
	this.pinNo = null;
	this.spec = null;
}


EWDItem.prototype.isSame = function ( ewdItem, fPinNo, fSpec )
{
	if( ewdItem.code != this.code )	return false;
	if( ewdItem.type != this.type )	return false;
	

	if( fPinNo ){
		if( ewdItem.type == "w2w" ){
			if( ewdItem.pinNo != this.pinNo ) return false;
		}
	}
	

	if( fSpec ){
		var s1 = (ewdItem.spec == null) ? "" : ewdItem.spec;
		var s2 = (this.spec == null) ? "" : this.spec;
		if( s1.toUpperCase() != s2.toUpperCase() ) return false;
	}
	
	return true;
}

EWDItem.prototype.extractFromSVGNode = function ( node )
{
	try{
		this.type = node.getAttribute("ewd:figtype");
		this.code = node.getAttribute("ewd:code");
		if( this.type == "w2w" )
			this.pinNo = node.getAttribute("ewd:pinNo");
		
		return this;
	}
	catch(e){
		window.alert("Could not get EWD Object from svg!");
		return false;
	}
}









function adjustType( type )
{
	if( type == "jc" || type == "jbc" )
		return "conn";
	else if( type == "jb" || type == "rb" || type == "r" )
		return "relay";
	else
		return type;
}


function makeID( code, type )
{
	return type + ":" + code;
}


function getCodeFromID( id )
{
	return id.split(":")[1];
}


function getTypeFromID( id )
{
	return id.split(":")[0];
}
